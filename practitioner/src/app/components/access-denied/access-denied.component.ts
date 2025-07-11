import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { ButtonComponent } from '../ui/button/button.component';
=======
>>>>>>> 506ddd8 (add practitioner login page  and access denied page)

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
<<<<<<< HEAD
  styleUrls: ['./access-denied.component.scss'],
  imports: [ButtonComponent],
  standalone: true,
=======
  styleUrls: ['./access-denied.component.scss']
>>>>>>> 506ddd8 (add practitioner login page  and access denied page)
})
export class AccessDeniedComponent {
  @Input() errorMessage: string = '';

  constructor(private router: Router) {}
  @Output() close = new EventEmitter<void>();

  clearQueryParams() {
    this.router.navigate(['/login'], {
      queryParams: {},
      replaceUrl: true,
    }).then(() => {
      this.close.emit();  
    });
  }
  
  
  
}
