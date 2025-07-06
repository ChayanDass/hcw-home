import { Component, computed, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { AuthService } from './auth/auth.service';
import {  MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TermService } from './services/term.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    AngularSvgIconModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'practitioner';
  pendingConsultations: number | undefined = 5;
  activeConsultations: number | undefined = 0;
  loginChecked = computed(() => this.authService.loginChecked());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  private iconNames = ['warning', 'download', 'chevron-right', 'chevron-left'];

  constructor(
    private iconRegistry: SvgIconRegistryService,
    private authService:AuthService,
    private termService: TermService

  ) {}

  ngOnInit(): void {
    this.registerAllIcons();
  }

  private registerAllIcons(): void {
    this.iconNames.forEach((iconName) => {
      if (this.iconRegistry) {
        this.iconRegistry
          .loadSvg(`assets/svg/${iconName}.svg`, iconName)
          ?.subscribe({
            next: () => console.log(`Icon ${iconName} registered successfully`),
            error: (error) =>
              console.error(`Failed to register icon ${iconName}:`, error),
          });
      }
    });
  }
  hasAcceptedLatestTerms(): boolean {
    const user = this.authService.getCurrentUser();
    const latest = this.termService.getLatestStored(); 
  
    return !!user && !!latest && user.termVersion >= latest.version && user.termId >= latest.id;
  }
  
}


