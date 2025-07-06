import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Router, ActivatedRoute } from '@angular/router';
import { TermService } from '../../services/term.service';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Term } from '../../models/term.model';
import { AuthService } from '../../auth/auth.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { LoginUser } from '../../models/user.model';

@Component({
  selector: 'app-accept-term',
  standalone: true,
  templateUrl: './accept-term.component.html',
  styleUrl: './accept-term.component.scss',
  imports: [
    CommonModule,
    MarkdownModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class AcceptTermComponent implements OnInit {
  returnUrl: string = '';
  term: Term | null = null;
  currentUser!: LoginUser;
  markdownContent: string = '';
  isAgreed: boolean = false;

  @Output() accepted = new EventEmitter<void>();
  @Output() rejected = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private termService: TermService,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    const storedTerm = this.termService.getLatestStored();
    const user = this.authService.getCurrentUser();

    if (!storedTerm || !user) {
      this.snackbarService.showError('Unable to load user or terms');
      this.router.navigateByUrl('/');
      return;
    }

    this.term = storedTerm;
    this.currentUser = user;
    this.markdownContent = storedTerm.content || '';
    const queryParams = this.route.snapshot.queryParams;
    this.returnUrl = queryParams['returnUrl'] || '/dashboard';
  }

  onAccept(): void {
    if (!this.isAgreed) {
      this.snackbarService.showError('Please check the agreement box to continue.');
      return;
    }
    console.log(this.currentUser);
    

    this.termService.acceptTerm(this.currentUser.id, this.term!.id).subscribe({
      next: (res) => {
        this.snackbarService.showSuccess(res.message);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.snackbarService.showError(err?.error?.message || 'Failed to accept terms');
      },
    });
  }

  onReject(): void {
    this.router.navigateByUrl('/not-accepted');
  }
}
