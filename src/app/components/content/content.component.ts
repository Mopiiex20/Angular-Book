import { Component, OnInit } from '@angular/core';
import BooksService from '../../services/books.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import BookService from '../../services/books.service';
import { CartService } from 'src/app/services/common.servise';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  bookTitle = new FormControl();
  bookForm: FormGroup = this.formBuilder.group({
    bookTitle: this.bookTitle
  })

  results: any[];


  constructor(private formBuilder: FormBuilder, private bookService: BookService, private cartServise: CartService) { }

  ngOnInit() {
    this.searchBook();
    this.bookService.get('books').subscribe((data: any) => {
      this.results = data
    });
  }

  addToCart(book: any) {
    this.cartServise.addToCart(book);

  }
  searchBook() {
    this.bookTitle.valueChanges.pipe(
      debounceTime(1000),
      switchMap((title) => {
        console.log(title)
        return this.bookService.searchBook(title);
      })
    ).subscribe(res => this.results = res);
  }


}
