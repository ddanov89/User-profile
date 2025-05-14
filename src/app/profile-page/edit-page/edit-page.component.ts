import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';
import { ProfileUpdateDTO } from '../dtos/profile.dto';
import { LoaderComponent } from '../../loader/loader.component';
import { Profile } from '../types/profile.type';
import { select, Store } from '@ngrx/store';
import { loadUsers, updateUser } from '../../state/actions/profile.actions';
import { selectUserById } from '../../state/selectors/profile.selectors';

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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];

    this.store.dispatch(loadUsers());

    // Select the user by ID from the store
    this.userSubscription = this.store
      .pipe(select(selectUserById(userId))) // Selector to get user by ID
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
    this.isSubmitting = true;

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

    // Dispatch the updateUser action to update the state via NgRx
    this.store.dispatch(updateUser({ userId, data: updatedProfile }));
this.isSubmitting = false;
    // Navigate after the state update (this could be done in an effect or after the state update completes)
    this.router.navigate([`/profile-page/${userId}`]);
  }

  onImageChange(event: any): void {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file type is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Create a file reader to read the image as a base64 string
      const reader = new FileReader();

      reader.onload = () => {
        this.avatarUrl = reader.result as string; // Set the new image URL to the base64 string
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('There was an error uploading your image.');
      };

      reader.readAsDataURL(file); // Read the file as base64
    }
  }

  setAvatarUrl(avatar: File | string): void {
    if (typeof avatar === 'string') {
      // If it's a string (Base64 or URL), assign directly
      this.avatarUrl = avatar;
    } else if (avatar instanceof File) {
      // If it's a File, use FileReader to read as Base64
      const reader = new FileReader();

      reader.onload = () => {
        this.avatarUrl = reader.result as string; // Convert file to Base64 string
      };

      reader.readAsDataURL(avatar); // Read the file as Base64
    }
  }

  saveUserToLocalStorage(updatedUser: { id: any }) {
    const userProfiles = JSON.parse(
      localStorage.getItem('userProfiles') || '[]'
    );

    const updatedUserProfiles = userProfiles.map((user: any) =>
      user.id === updatedUser.id
        ? { ...user, ...updatedUser } // Merge only updated fields
        : user
    );

    localStorage.setItem('userProfiles', JSON.stringify(updatedUserProfiles));
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription?.unsubscribe();
    }
  }
}
