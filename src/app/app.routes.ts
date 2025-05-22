import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TodoFormsComponent } from './todo-forms/todo-forms.component';

export const routes: Routes = [
{ path: '', component: HomeComponent }, // Főoldal
  { 
    path: 'todo-forms', 
    component: TodoFormsComponent, // 👈 Új teendő hozzáadása
  },
  { 
    path: 'todo-forms/:id', 
    component: TodoFormsComponent, // 👈 Teendő szerkesztése
  },
];
