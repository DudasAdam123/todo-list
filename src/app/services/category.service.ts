import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../whattodo';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 
    http = inject(HttpClient);

    private cat: Category[] = [];
    private readonly localStorageKey = 'Categories';
    StartingCategories(): Observable<Category[]> {
      return this.http.get<Category[]>('categories.json').pipe(
        tap((data: Category[]) => {
          this.cat = data;
          localStorage.setItem(this.localStorageKey, JSON.stringify(this.cat)); 
        })
      );
    }

    loadCategories(): Category[] {
        const storedCats = localStorage.getItem(this.localStorageKey);
        
        if (storedCats) {

          this.cat = JSON.parse(storedCats);
        } if(this.cat.length === 0) {
         
          this.StartingCategories().subscribe((categoria) => {
            this.cat = categoria;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.cat));
          });

           
         
        }
        return this.cat
      }
  
    getAllCategories(): Category[] {
      return this.cat;
    }
  
    getCategoryByID(id: string): Category | undefined {
      return this.cat.find(b => b.id === id);
    }
  


}
