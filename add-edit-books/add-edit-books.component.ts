import { Component, Input } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Form, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Book, Tag, Chapter } from '../Book.model';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-add-edit-books',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule],
  templateUrl: './add-edit-books.component.html',
  styleUrl: './add-edit-books.component.css'
})
export class AddEditBooksComponent implements OnInit {
  books: Book[] = [];

  genres: string[] = ['Fiction', 'Non-Fiction', 'Biography', 'Academic', 'Poetry', 'Science Fiction', 'Fantasy'];

  inputForm: FormGroup;

  @Input() set selectedBook(book: Book | null) {
    if (book) {
      this.populateForm(book);
    }
  }

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.inputForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      authorName: ['', Validators.required],
      pubYear: ['', Validators.required],
      isbn: ['', Validators.required],
      genre: [''],
      tags: this.formBuilder.array([this.createTag()], this.tagsValidator),
      chapters: this.formBuilder.array([this.createChapter()], this.chaptersValidator),
      totalPages: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getBooks();
  }

  public getBooks(): void {
    let url = "";
    this.http.get<Book[]>('https://localhost:7070/api/Again/getbooks').subscribe({
      next: (response) => {
        this.books = response,
          console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  get chapters(): FormArray {
    return this.inputForm.get('chapters') as FormArray;
  }

  get tags(): FormArray {
    return this.inputForm.get('tags') as FormArray;
  }

  createChapter(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      pageCount: ['', Validators.required]
    });
  }

  createTag(): FormGroup {
    return this.formBuilder.group({
      text: ['', Validators.required],
    });
  }

  addChapter() {
    if (this.chapters.length < 50) {
      this.chapters.push(this.createChapter());
    }
  }

  removeChapter(index: number) {
    this.chapters.removeAt(index);
  }

  addTag() {
    if (this.tags.length < 5) {
      this.tags.push(this.createTag());
    }
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    if (this.inputForm.valid) {

      const totalPageCount = this.calculateTotalPageCount();
      const formTotalPages = +this.inputForm.get('totalPages')?.value || 0;

      if (totalPageCount !== formTotalPages) {
        console.log('Pages of Book and summation of chapter pages arent equal');
        return;
      }

      const newBook = {
        id: this.inputForm.get('id')?.value,
        title: this.inputForm.get('title')?.value,
        authorName: this.inputForm.get('authorName')?.value,
        pubYear: this.inputForm.get('pubYear')?.value,
        isbn: this.inputForm.get('isbn')?.value,
        genre: this.inputForm.get('genre')?.value,
        tags: this.getTags(),
        chapters: this.getChapters(),
        totalPages: this.inputForm.get('totalPages')?.value,
      };

      this.http.post<Book>('https://localhost:7070/api/Again/addbook', newBook).subscribe({
        next: (response) => {
          console.log('Book Added', response);
          this.inputForm.reset();
        },
        error: (error) => {
          console.error('Cant Add Book - issue found', error);
        }
      });
    }
  }

  getChapters(): Chapter[] {
    return (this.inputForm.get('chapters') as FormArray).controls.map(chapter => ({
      chapterNumber: 0,
      title: chapter.get('title')?.value,
      pageCount: chapter.get('pageCount')?.value
    }));
  }

  getTags(): Tag[] {
    return (this.inputForm.get('tags') as FormArray).controls.map(tag => ({
      text: tag.get('text')?.value
    }));
  }

  getTotalPages(): number {
    return this.getChapters().reduce((total, chapter) => total + chapter.pageCount, 0);
  }

  tagsValidator(tags: AbstractControl): { [key: string]: boolean } | null {
    const tagsArray = tags as FormArray;

    for (let i = 0; i < tagsArray.length; i++) {
      const tagControl = tagsArray.at(i).get('text');
      if (tagControl && !tagControl.value) {
        return { 'no value in tag field': true };
      }
    }

    return null;
  }

  chaptersValidator(chapters: AbstractControl): { [key: string]: boolean } | null {
    const chaptersArray = chapters as FormArray;

    for (let i = 0; i < chaptersArray.length; i++) {
      const chapterGroup = chaptersArray.at(i) as FormGroup;
      const titleControl = chapterGroup.get('title');
      const pageCountControl = chapterGroup.get('pageCount');

      if ((!titleControl || !titleControl.value) && (!pageCountControl || !pageCountControl.value)) {
        return { 'incomplete chapter data': true };
      }
    }

    return null;
  }

  populateForm(book: Book): void {
    this.inputForm.patchValue({
      id: book.id,
      title: book.title,
      authorName: book.authorName,
      pubYear: book.pubYear,
      isbn: book.isbn,
      genre: book.genre
    });

    this.tags.clear();
    book.tags.forEach(tag => this.tags.push(this.formBuilder.group({ text: tag.text })));

    this.chapters.clear();
    book.chapters.forEach(chapter => this.chapters.push(this.formBuilder.group({ title: chapter.title, pageCount: chapter.pageCount })));
  }

  public editBook(): void {
    if (this.inputForm.valid) {
      let id = this.inputForm.value.id;

      var updatedBook = {
        Title: this.inputForm.value.title,
        AuthorName: this.inputForm.value.authorName,
        PubYear: this.inputForm.value.pubYear,
        Genre: this.inputForm.value.genre,
        Isbn: this.inputForm.value.isbn,
        Tags: this.inputForm.value.tags,
        Chapters: this.inputForm.value.chapters,
        TotalPages: this.inputForm.value.totalPages
      }

      this.http.put(`https://localhost:7070/api/Again/editbook?id=${id}`, updatedBook).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  calculateTotalPageCount(): number {
    return this.chapters.controls.reduce((total, chapter) => {
      const pageCount = +chapter.get('pageCount')?.value || 0;
      return total + pageCount;
    }, 0);
  }
}