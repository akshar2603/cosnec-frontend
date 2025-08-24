import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
// Update the path below to the correct location of auth.service.ts
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {


   email = '';
  password = '';

   constructor(private router: Router, private auth: AuthService) {}



  onSubmit() {
  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: (res: any) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userId);
      console.log('Login successful:', res.userId);
      if(this.email === 'hacker@gmail.com' && this.password === 'hacker') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    },
    error: (err) => alert(err.error.message)
  });
}

}
