import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule , FormsModule, CommonModule],
  templateUrl: './app.html',    
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cosmos-frontend');
}
