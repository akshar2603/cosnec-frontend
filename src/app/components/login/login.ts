import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { environment } from '../../../environments/environment.prod'; // ✅ adjust path if needed

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  email = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // ✅ Initialize Google button
     google.accounts.id.initialize({
    client_id: environment.googleClientId,   // ✅ use from env
    callback: (response: any) => this.handleGoogleResponse(response)
  });


    // ✅ Render Google button in div with id="google-btn"
    google.accounts.id.renderButton(
    document.getElementById("google-btn"),
    { theme: "outline", size: "large", width: 250 }
  )
  }

  // ✅ Normal login
  onSubmit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        console.log('Login successful:', res.userId);
        if (this.email === 'hacker@gmail.com' && this.password === 'hacker') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => alert(err.error.message)
    });
  }




  // ✅ Google login response handler
private handleGoogleResponse(response: any) {
  const credential = response.credential;

  // ✅ print raw token
  console.log('Google ID Token (JWT):', credential);

  // ✅ decode JWT payload (for debugging only)
  const base64Url = credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(atob(base64));
  console.log('Decoded Google Payload:', decodedPayload);

  // send token to backend for verification
  this.auth.googleLogin(credential).subscribe({
    next: (res: any) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userId);
      console.log('Google Login successful:', res.userId);
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Google login failed:', err);
      alert('Google login failed');
    }
  });
}



}
