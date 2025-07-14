import { Component } from '@angular/core';
import { DashboardComponent } from './features/health-check/components/dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DashboardComponent,
    MatIconModule,
    MatToolbarModule,   
    MatButtonModule,     
    MatTooltipModule    
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'healthchecker-dashboard';
}