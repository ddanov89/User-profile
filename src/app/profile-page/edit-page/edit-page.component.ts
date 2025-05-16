import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderComponent } from '../../loader/loader.component';
import { Profile } from '../types/profile.type';
import {select, Store } from '@ngrx/store';
import {
  loadUsers,
  updateUser,
  updateUserSuccess,
} from '../state/actions/profile.actions';
import {
  selectUserById,
} from '../state/selectors/profile.selectors';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.css',
})
export class EditPageComponent implements OnInit, OnDestroy {
  avatarUrl: string = 'https://avatars.githubusercontent.com/u/583231?v=4';

  isSubmitting = false;

  editForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    company: new FormGroup({
      name: new FormControl('', Validators.required),
    }),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      suite: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
    }),
  });

  userSubscription: Subscription | null = null;
  actionsSubscription: Subscription | null = null;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];

    this.actionsSubscription = this.actions$
      .pipe(ofType(updateUserSuccess))
      .subscribe(() => {
        this.isSubmitting = false;
      });
    this.store.dispatch(loadUsers());

    this.userSubscription = this.store
      .pipe(select(selectUserById(userId)))
      .subscribe((user: Profile | undefined) => {
        if (user) {
          this.setAvatarUrl(user.avatar);
          this.editForm.patchValue({
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            website: user.website,
            company: {
              name: user.company?.name ?? '',
            },
            address: {
              street: user.address?.street ?? '',
              suite: user.address?.suite ?? '',
              city: user.address?.city ?? '',
              zipcode: user.address?.zipcode ?? '',
            },
          });
        }
      });
  }

  editUser() {
    const userId = this.route.snapshot.params['userId'];
    const formValue = this.editForm.value;

    const updatedProfile: Profile = {
      id: userId,
      avatar: this.avatarUrl,
      name: formValue.name ?? '',
      username: formValue.username ?? '',
      email: formValue.email ?? '',
      phone: formValue.phone ?? '',
      website: formValue.website ?? '',
      company: {
        name: formValue.company?.name ?? '',
      },
      address: {
        street: formValue.address?.street ?? '',
        suite: formValue.address?.suite ?? '',
        city: formValue.address?.city ?? '',
        zipcode: formValue.address?.zipcode ?? '',
      },
    };

    this.isSubmitting = true;
    this.store.dispatch(updateUser({ userId, data: updatedProfile }));
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('There was an error uploading your image.');
      };

      reader.readAsDataURL(file);
    }
  }

  setAvatarUrl(avatar: File | string): void {
    if (typeof avatar === 'string') {
      this.avatarUrl = avatar;
    } else if (avatar instanceof File) {
      const reader = new FileReader();

      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };

      reader.readAsDataURL(avatar);
    }
  }

  saveUserToLocalStorage(updatedUser: { id: any }) {
    const userProfiles = JSON.parse(
      localStorage.getItem('userProfiles') || '[]'
    );

    const updatedUserProfiles = userProfiles.map((user: any) =>
      user.id === updatedUser.id
        ? { ...user, ...updatedUser }
        : user
    );

    localStorage.setItem('userProfiles', JSON.stringify(updatedUserProfiles));
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription?.unsubscribe();
    }
    if (this.actionsSubscription) {
      this.actionsSubscription?.unsubscribe();
    }
  }
}
