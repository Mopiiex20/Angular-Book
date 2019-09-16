import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import BookService from '../../services/books.service';
import { CartService, LoginService } from 'src/app/services/common.servise';
import AuthService from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BooksModel } from 'src/app/models/books-model';

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

  results: BooksModel[];
  isLoggedIn: boolean = false;
  loading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private authService: AuthService,
    private cartServise: CartService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginService.login$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn
      }
    )
  }

  ngOnInit() {
    this.searchBook();
    this.bookService.get('books').subscribe((data: BooksModel[]) => {
      this.results = data;
      this.loading = false;
    });
    let token = this.authService.getToken();
    if (token) {
      this.isLoggedIn = true
    }
  }
  goToBookDefinition(bookId: number) {
    let caller = bookId
    this.router.navigate(["bookInfo", caller])
  }

  addToCart(book: any) {
    this.cartServise.addToCart(book);

  }
  searchBook() {
    this.bookTitle.valueChanges.pipe(
      debounceTime(1000),
      switchMap((title) => {
        return this.bookService.searchBook(title);
      })
    ).subscribe(res => this.results = res);
  }


}
