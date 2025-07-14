import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-url-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-url-dialog.component.html',
  styleUrl: './add-url-dialog.component.scss',
})
export class AddUrlDialogComponent {
  urlControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+'),
  ]);

  dialogRef: MatDialogRef<AddUrlDialogComponent> = inject(
    MatDialogRef<AddUrlDialogComponent>
  );

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.urlControl.valid) {
      this.dialogRef.close(this.urlControl.value);
    }
  }

  getErrorMessage() {
    if (this.urlControl.hasError('required')) {
      return 'Você deve inserir uma URL.';
    }
    return this.urlControl.hasError('pattern')
      ? 'URL não é válida (ex: https://google.com)'
      : '';
  }
}
