import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export default class BookService {

    bookUrl = environment.url;
    constructor(private http: HttpClient) { }

    get(url: string): Observable<any> {
        return this.http.get<any>(`${this.bookUrl}${url}`)
    }

    searchBook(title: string): Observable<any> {
        return this.http.get<any>(this.bookUrl+'books/' + title).pipe(
            catchError(err => of(null))
        );
    }
} 