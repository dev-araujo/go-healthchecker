import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize, map, Subject, takeUntil } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { CheckResult } from '../../models/health-check.model';
import { AddUrlDialogComponent } from '../add-url-dialog/add-url-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, LayoutModule, MatTableModule, MatIconModule, MatButtonModule,
    MatProgressBarModule, MatTooltipModule, MatDialogModule, DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  columnsToDisplay: string[] = ['status', 'url', 'httpStatus', 'latencyMs', 'actions', 'expand'];
  
  private readonly desktopColumns = ['status', 'url', 'httpStatus', 'latencyMs', 'actions', 'expand'];
  private readonly mobileColumns = ['status', 'url', 'expand'];
  
  dataSource = new MatTableDataSource<CheckResult>();
  expandedElement: CheckResult | null = null;
  isLoading = false;
  isHandset = false; 

  private destroy$ = new Subject<void>();
  
  private urls: string[] = [
    'https://www.google.com', 'https://api.github.com',
    'https://httpstat.us/404', 'https://httpstat.us/500',
  ];

  apiService = inject(ApiService);
  dialog = inject(MatDialog);
  breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.handleBreakPoints()
    this.refreshAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleBreakPoints():void{
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(
        map(result => result.matches),
        takeUntil(this.destroy$)
      ).subscribe(isHandset => {
        this.isHandset = isHandset;
        if (isHandset) {
          this.columnsToDisplay = this.mobileColumns;
        } else {
          this.columnsToDisplay = this.desktopColumns;
        }
      });
  }

  refreshAll(): void {
    if (this.urls.length === 0) {
      this.dataSource.data = [];
      return;
    }
    this.isLoading = true;
    this.apiService.checkUrls(this.urls).pipe(
      finalize(() => (this.isLoading = false))
    ).subscribe(response => {
      this.dataSource.data = response.results.map(res => ({
        ...res,
        lastChecked: response.checkedAt,
      }));
    });
  }

  openAddUrlDialog(): void {
    const dialogRef = this.dialog.open(AddUrlDialogComponent, {
      width: this.isHandset ? '90vw' : '450px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe(newUrl => {
      if (newUrl && !this.urls.includes(newUrl)) {
        this.urls.push(newUrl);
        this.urls.sort();
        this.refreshAll();
      }
    });
  }

  removeUrl(urlToRemove: string): void {
    this.urls = this.urls.filter(url => url !== urlToRemove);
    this.refreshAll();
  }
}