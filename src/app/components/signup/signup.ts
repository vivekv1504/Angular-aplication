import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: 'customer'
  };
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup(): void {
    // Validation
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.signup(this.user).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.success) {
          this.successMessage = 'Account created successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          if (result.message === 'Email already exists') {
            this.errorMessage = 'This email is already registered. Please use a different email or login.';
          } else {
            this.errorMessage = result.message || 'An error occurred. Please try again.';
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
        console.error('Signup error:', error);
      }
    });
  }
}
