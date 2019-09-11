import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export default class AuthService {
    providedIn: 'root'
    stUrl = environment.url;
    constructor(private http: HttpClient) { }


    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            return true
        }
        return false
    }

    post(url: string, body: any): Observable<any> {
        return this.http.post<any>(`${this.stUrl}${url}`, body)
    }

    get(url: string): Observable<any> {
        return this.http.get<any>(`${this.stUrl}${url}`)
    }

    getToken() {
        return localStorage.getItem("token");

    }

}
