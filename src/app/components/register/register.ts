import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ import FormsModule
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  agree = false;
  constructor(private router: Router, private auth: AuthService) {}

  
 onSubmit() {
  this.auth.register({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password
  }).subscribe({
    next: () => {
      alert('Registered successfully');
      this.router.navigate(['/login']);
    },
    error: (err) => alert(err.error.message)
  });
}

}
