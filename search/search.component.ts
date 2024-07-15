import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Book } from '../Book.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  books: Book[] = [];
  searchControl = new FormControl('');

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      if (searchTerm !== null) {
        this.searchBooks(searchTerm);
      }
    });
  }

  public searchBooks(searchTerm: string): void {
    if (searchTerm) {
      this.http.get<Book[]>(`https://localhost:7070/api/Again/searchbooks?searchTerm=${searchTerm}`).subscribe({
        next: (response) => {
          this.books = response;
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.getBooks();
    }
  }

  public getBooks(): void {
    this.http.get<Book[]>('https://localhost:7070/api/Again/getbooks').subscribe({
      next: (response) => {
        this.books = response;
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
