import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, withLatestFrom, takeUntil } from 'rxjs/operators';
import {
  NbLayoutComponent,
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { StateService } from '../../../@core/utils';
import { Monitor } from '../../../@data/monitor';

@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  templateUrl: './sample.layout.html'
})
export class SampleLayoutComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  layout: any = {};
  sidebar: any = {};
  isLoggedIn: boolean;

  currentTheme: string;

  @ViewChild(NbLayoutComponent, { static: false }) layoutComponent: NbLayoutComponent;

  constructor(protected stateService: StateService,
              protected menuService: NbMenuService,
              protected themeService: NbThemeService,
              protected monitor: Monitor,
              protected bpService: NbMediaBreakpointsService,
              protected sidebarService: NbSidebarService,
              @Inject(PLATFORM_ID) protected platformId,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.monitor.isLoggedIn();
    const isBp = this.bpService.getByName('is');
    this.menuService.onItemSelect()
      .pipe(
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
        takeUntil(this.destroy$),
      )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

        if (bpTo.width <= isBp.width) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

    this.themeService.getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => this.currentTheme = theme.name);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isMenuSidebarPositionEnd(): boolean {
    return this.sidebar.id === 'end';
  }

  isSettingsSidebarPositionEnd(): boolean {
    return !this.isMenuSidebarPositionEnd();
  }
}
