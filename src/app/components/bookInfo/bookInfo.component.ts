import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import BookService from 'src/app/services/books.service';
import { Book } from '../admin/admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookInfo',
  templateUrl: './bookInfo.component.html',
  styleUrls: ['./bookInfo.component.scss']
})
export class BookInfoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private _snackBar: MatSnackBar,
  ) { }
 private currentBookId: number;
 private book: Book;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.currentBookId = params['bookId']);
    console.log(this.currentBookId);
    this.bookService.getBookById(`${this.currentBookId}`).subscribe(
      (book: Book) => {
        this.book = book;
        if (this.book === null) {
          this._snackBar.open('Book not Found!');
        }
      }
    )

  }

}
