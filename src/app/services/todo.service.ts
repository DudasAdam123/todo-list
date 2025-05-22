import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../whattodo';


@Injectable({
  providedIn: 'root'
})

export class TodoService {

  
    http = inject(HttpClient);

    private task: Todo[] = [];
    private readonly localStorageKey = 'tasks';
    StartingTasks(): Observable<Todo[]> {
      return this.http.get<Todo[]>('todolist.json').pipe(
        tap((data: Todo[]) => {
          this.task = data;
          localStorage.setItem(this.localStorageKey, JSON.stringify(this.task)); 
        })
      );
    }

    loadTasks(): Todo[] {

        const storedTasks = localStorage.getItem(this.localStorageKey);
        
        if (storedTasks) {
      
         this.task = JSON.parse(storedTasks);
        } if(this.task.length === 0) {
       
          this.StartingTasks().subscribe((task) => {
            this.task = task;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.task));
          });
      
           
         
        }
        return this.task
      }
  
    getAllTasks(): Todo[] {
      return this.task;
    }
  
    getTaskbyID(id: string): Todo | undefined {
      return this.task.find(b => b.id === id);
    }

    getTasksByCategory(categoryId: string): Todo[] {
    return this.task.filter(task => task.category === categoryId);
}
  
    addTask(task: Todo): void {
      this.task.push(task);
      this.saveTasks();
    }
  
    updateTask(updated: Todo): void {
      const index = this.task.findIndex(b => b.id === updated.id);
      if (index !== -1) {
        this.task[index] = updated;
        this.saveTasks();
      }
    }
  
    deleteTask(id: string): void {
      this.task = this.task.filter(b => b.id !== id);
      this.saveTasks();
    }

    private saveTasks(): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.task));
      }


}
