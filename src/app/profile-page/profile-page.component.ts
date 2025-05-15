import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from './types/profile.type';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllUsers } from './state/selectors/profile.selectors';
import { loadUsers } from './state/actions/profile.actions';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  currentUser: Profile | null | undefined;

  defaultAvatarUrl = 'https://avatars.githubusercontent.com/u/583231?v=4';
  profileSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.store.dispatch(loadUsers());

    const sub = this.store
      .select(selectAllUsers)
      .pipe(map((users) => users.find((user) => String(user.id) === userId)))
      .subscribe((user) => {
        this.currentUser = user;
        if (this.currentUser == undefined){
          this.router.navigate(["/404"]);
        }
        
      });

    this.profileSubscription.add(sub);
  }

  launchEditForm() {
    const userId = this.currentUser?.id;
    if (userId) {
      this.router.navigate(['/edit', userId]);
    }
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }
}
