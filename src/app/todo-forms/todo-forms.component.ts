import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Todo } from '../whattodo';
import { TodoService } from '../services/todo.service';
import { CategoryService } from '../services/category.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-todo-forms',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './todo-forms.component.html',
  styleUrl: './todo-forms.component.css'
})
export class TodoFormsComponent {
  form!: FormGroup;
  isEdit = false;
  taskId?: string;


  constructor(
    private fb: FormBuilder,
    private toddoSeervice: TodoService,
    private categoryService: CategoryService,
    public router: Router,
    private route: ActivatedRoute
  ) {}


     categories: Category[] = [];

  ngOnInit(): void {
    this.categories = this.categoryService.loadCategories();

    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      status: ['active', Validators.required],
      priority: ['medium', Validators.required],
      ToBeCompleted: ['', Validators.required]
    });

    this.taskId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.taskId) {
      const task = this.toddoSeervice.getTaskbyID(this.taskId);
      if (task) {
        this.isEdit = true;
        this.form.patchValue({
          ...task,
          ToBeCompleted: this.formatDate(task.ToBeCompleted)
        });
      } else {
        alert('Nem létezik ilyen teendő.');
        this.router.navigate(['/']);
      }
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const task: Todo = {
      id: this.isEdit && this.taskId ? this.taskId : uuidv4(),
      title: formValue.title,
      category: formValue.category,
      status: formValue.status,
      priority: formValue.priority,
      ToBeCompleted: new Date(formValue.ToBeCompleted)
    };

    if (this.isEdit) {
      this.toddoSeervice.updateTask(task);
    } else {
      this.toddoSeervice.addTask(task);
    }

    this.router.navigate(['/']);
  }
}