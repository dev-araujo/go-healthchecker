import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize, map, repeat, Subject, takeUntil } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { ApiResponse, CheckResult } from '../../models/health-check.model';
import { AddUrlDialogComponent } from '../add-url-dialog/add-url-dialog.component';
import { DialogComponent } from '../../../../core/shared/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed,void',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  columnsToDisplay: string[] = [
    'status',
    'url',
    'httpStatus',
    'latencyMs',
    'actions',
    'expand',
  ];

  private readonly desktopColumns = [
    'status',
    'url',
    'httpStatus',
    'latencyMs',
    'actions',
    'expand',
  ];
  private readonly mobileColumns = ['status', 'url', 'expand'];

  dataSource = new MatTableDataSource<CheckResult>();
  expandedElement: CheckResult | null = null;
  isLoading = false;
  isHandset = false;

  private destroy$ = new Subject<void>();

  private urls: string[] = [
    'https://www.google.com',
    'https://api.github.com',
    'https://api.coingecko.com/api/v3/simple',
    'https://reqres.in/api/users/2',
  ];

  apiService = inject(ApiService);
  dialog = inject(MatDialog);
  breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.handleBreakPoints();
    this.refreshAll(2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeUrl(element: CheckResult, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newUrl = inputElement.value.trim();
    const oldUrl = element.url;

    if (!newUrl || newUrl === oldUrl) {
      inputElement.value = oldUrl;
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.isHandset ? '90vw' : '450px',
      maxWidth: '95vw',
      data: {
        title: 'Confirmar Alteração',
        message: `Deseja alterar a URL?`,
        buttons: {
          confirm: 'confirmar',
          cancel: 'cancelar',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      inputElement.value = oldUrl;
      if (confirmed) {
        const index = this.urls.indexOf(oldUrl);
        if (index > -1) {
          this.urls[index] = newUrl;
          element.url = newUrl;
          this.refreshAll();
        }
      }
    });
  }
  handleBreakPoints(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(
        map((result: any) => result.matches),
        takeUntil(this.destroy$)
      )
      .subscribe((isHandset: any) => {
        this.isHandset = isHandset;
        if (isHandset) {
          this.columnsToDisplay = this.mobileColumns;
        } else {
          this.columnsToDisplay = this.desktopColumns;
        }
      });
  }

  refreshAll(tries=1): void {
    if (this.urls.length === 0) {
      this.dataSource.data = [];
      return;
    }
    this.isLoading = true;
    this.apiService
      .checkUrls(this.urls)
      .pipe(
        finalize(() => (this.isLoading = false)),
        repeat(tries),
        takeUntil(this.destroy$)
      )
      .subscribe((response: ApiResponse) => {
        this.dataSource.data = response.results.map((res: any) => ({
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

    dialogRef.afterClosed().subscribe((newUrl: string) => {
      if (newUrl && !this.urls.includes(newUrl)) {
        this.urls.push(newUrl);
        this.urls.sort();
        this.refreshAll();
      }
    });
  }

  removeUrl(urlToRemove: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.isHandset ? '90vw' : '450px',
      maxWidth: '95vw',
      data: {
        title: 'Confirmar a Exclusão',
        message: `Deseja deletar a URL?`,
        buttons: {
          confirm: 'deletar',
          cancel: 'cancelar',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.urls = this.urls.filter((url) => url !== urlToRemove);
      this.refreshAll();
    });
  }
}
