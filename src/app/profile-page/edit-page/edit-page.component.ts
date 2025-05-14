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

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.css',
})
export class EditPageComponent implements OnInit, OnDestroy {
  profileToUpdate: ProfileUpdateDTO | null | undefined;
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
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.userSubscription = this.profileService
      .getUserById(userId)
      .subscribe((user) => {
        if (!user) return;

        this.editForm.patchValue({
          name: user.name,
          website: user.website,
          username: user.username,
          email: user.email,
          phone: user.phone,
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
      });
  }

  editUser() {
    const userId = this.route.snapshot.params['userId'];

    this.profileToUpdate = { ...this.editForm.value };

    this.userSubscription = this.profileService
      .updateUser(userId, this.profileToUpdate)
      .subscribe((user) => {
        this.saveUserToLocalStorage(user);
        this.router.navigate([`/profile-page/${userId}`]);
      });
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
