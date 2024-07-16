import { Component, EventEmitter, Output } from '@angular/core';;
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Form, FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../Book.model'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-books',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './display-books.component.html',
  styleUrl: './display-books.component.css'
})
export class DisplayBooksComponent {
  books: Book[] = [];

  public inputForm = new FormGroup({
    Id: new FormControl<string>(""),
    Title: new FormControl<string>(""),
    AuthorName: new FormControl<string>(""),
    PubYear: new FormControl<number>(1900),
    Genre: new FormControl<string>(""),
  })

  @Output() editBookEvent = new EventEmitter<Book>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getBooks();
  }

  public getBooks(): void {
    let url = "";
    this.http.get<Book[]>('https://localhost:7070/api/Home/getbooks').subscribe({
      next: (response) => {
        this.books = response,
          console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  public populateForm() {

  }

  public editBookEmit(book: Book): void {
    this.editBookEvent.emit(book);
  }

  public deleteBook(book: Book): void {

    let id = book.id;

    console.log("in delemp");

    const url = `https://localhost:7070/api/Home/deletebook?id=${id}`;

    this.http.delete(url).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

}
