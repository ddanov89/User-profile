import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public toggleSnackBar(message: string) {
    this.snackBar.open(message, 'Затвори', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    setTimeout(() => {
      this.snackBar.dismiss();
    }, 5000);
  }
}
