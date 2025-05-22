import { Component, inject } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category, Todo } from '../whattodo';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'

})


export class HomeComponent {


    private todoService = inject(TodoService);
    private categoryService = inject(CategoryService);
    private router = inject(Router);

    public todos: Todo[] = [];
    public categories: Category[] = [];
    selectedCategory: string | null = null;
    lastSelectedCategory: string | null = null;


  ngOnInit() {
    this.todoService.loadTasks();
    this.categoryService.loadCategories();
    this.todos = this.todoService.getAllTasks();
    this.categories = this.categoryService.getAllCategories();
    }


      AddNewTask() {
    this.router.navigate(['/todo-forms']);
  }

  deleteTodo(id: string) {
    this.todoService.deleteTask(id);
    if (this.selectedCategory) {
    this.todos = this.todoService.getTasksByCategory(this.selectedCategory); 
  } else {
    this.todos = this.todoService.getAllTasks();
  }
  }


  onEdit(id: string) {
    this.router.navigate(['/todo-forms', id]);
  }

filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.todos = this.todoService.getTasksByCategory(categoryId);
  } 

  searchTerm: string = '';

onSearchChange() {
  const allTasks = this.todoService.getAllTasks();

  const term = this.searchTerm.toLowerCase().trim();

  if (term === '') {
    this.selectedCategory = this.lastSelectedCategory;
    this.todos = this.selectedCategory
      ? this.todoService.getTasksByCategory(this.selectedCategory)
      : allTasks;
    return;
  }

 
  if (!this.lastSelectedCategory) {
    this.lastSelectedCategory = this.selectedCategory;
  }

  this.selectedCategory = null; 

  const filteredInCategory = this.lastSelectedCategory
    ? this.todoService.getTasksByCategory(this.lastSelectedCategory)
        .filter(todo => todo.title.toLowerCase().includes(term))
    : [];

  this.todos = filteredInCategory.length > 0
    ? filteredInCategory
    : allTasks.filter(todo => todo.title.toLowerCase().includes(term));
}
    

}