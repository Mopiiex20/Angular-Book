import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/login-model';

@Injectable()
export class UserService {
    providedIn: 'root'
    stUrl = environment.url;
    constructor(private http: HttpClient) { }


    get(url: string): Observable<UserModel> {
        return this.http.get<any>(`${this.stUrl}${url}`)
    }
    getOne(url: string): Observable<any> {
        return this.http.get<any>(`${this.stUrl}users/${url}`)
    }

    getAvatar(id: string): Observable<any> {
        return this.http.get<any>(`${this.stUrl}users/avatar/${id}`)
    }

    put(url: string, body: any): Observable<any> {
        return this.http.put<any>(`${this.stUrl}users/${url}`, body)
    }
}