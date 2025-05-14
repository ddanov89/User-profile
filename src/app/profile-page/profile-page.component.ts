import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from './types/profile.type';
import { LoaderComponent } from '../loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  currentUser: Profile | null | undefined;

  profileSubscription: Subscription | undefined;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];

    this.profileSubscription = this.profileService
      .getUserById(userId)
      .subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (err) => {
          console.error("Can't fetch data!");
        },
      });
  }

  launchEditForm() {
    const userId = this.currentUser?.id;
    if (userId) {
      this.router.navigate(['/edit', userId]);
    }
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
