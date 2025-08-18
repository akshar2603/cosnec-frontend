// app.routes.ts
import { Routes } from '@angular/router';
import { Dummy2 } from './components/dummy2/dummy2';
import { Checkout } from './components/checkout/checkout';
import { Admin } from './components/admin/admin';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Address } from './components/address/address';


export const routes: Routes = [
  { path: '', component: Dummy2, pathMatch: 'full' }, // this one redirects              // this one shows a component
  { path: 'checkout', component: Checkout },
   { path: 'admin', component: Admin },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'addresses', component: Address },
];
