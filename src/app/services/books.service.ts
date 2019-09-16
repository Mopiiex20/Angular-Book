import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BooksModel } from '../models/books-model';

@Injectable({
    providedIn: 'root'
})
export default class BookService {

    bookUrl = environment.url;
    constructor(private http: HttpClient) { }



    create(body: any): Observable<any> {

        return this.http.post<any>(`${this.bookUrl}books`, body)
    }

    getBookById(url: string): Observable<any> {
        return this.http.get<any>(`${this.bookUrl}books/id/${url}`)
    }

    get(url: string): Observable<BooksModel[]> {
        return this.http.get<any>(`${this.bookUrl}${url}`)
    }

    updateBook(url: string, body: any): Observable<any> {

        return this.http.put<any>(`${this.bookUrl}${url}`, body)
    }

    deleteBook(url: string): Observable<any> {
        return this.http.delete<any>(this.bookUrl + `books/${url}`)
    }

    searchBook(title: string): Observable<any> {
        return this.http.get<any>(this.bookUrl + 'books/' + title).pipe(
            catchError(err => of(null))
        );
    }
} 