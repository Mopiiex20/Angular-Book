import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
    providedIn: 'root'
    stUrl = environment.url;
    constructor(private http: HttpClient) { }

    put(url: string, body: any): Observable<any> {
        return this.http.put<any>(`${this.stUrl}${url}`, body)
    }
}