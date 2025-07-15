import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: ` 
  <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content> {{data.message}} </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{data.buttons.cancel}}</button>
      <button mat-flat-button color="primary" (click)="onConfirm()">
        {{ data.buttons.confirm}}
      </button>
    </mat-dialog-actions>`,
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  dialogRef: MatDialogRef<DialogComponent> = inject(
    MatDialogRef<DialogComponent>
  );

  data: any = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
