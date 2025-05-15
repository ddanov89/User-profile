import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from './types/profile.type';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllUsers } from './state/selectors/profile.selectors';
import { loadUsers } from './state/actions/profile.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  // private store = inject(Store);
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);

  currentUser: Profile | null | undefined;

  defaultAvatarUrl = 'https://avatars.githubusercontent.com/u/583231?v=4';
  profileSubscription: Subscription = new Subscription();

    constructor(
      private store: Store,
      private route: ActivatedRoute,
      private router: Router,
      private snackBar: MatSnackBar
    ) {}
  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.store.dispatch(loadUsers());

    const sub = this.store
      .select(selectAllUsers)
      .pipe(map((users) => users.find((user) => String(user.id) === userId)))
      .subscribe((user) => {
        this.currentUser = user;
      });

    this.profileSubscription.add(sub);
  }

  launchEditForm() {
    const userId = this.currentUser?.id;
    if (userId) {
      this.router.navigate(['/edit', userId]);
    }else{
      this.snackBar.open(
            "You can't perform this action now. Please try again later.",
            'Close',
            {
              duration: 5000,
              panelClass: ['snackbar-error'], 
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
    }
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }
}
