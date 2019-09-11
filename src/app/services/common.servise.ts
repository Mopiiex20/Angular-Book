import { Injectable, Optional } from '@angular/core';
import { Subject } from 'rxjs';



interface LoginRequest {
    email: string;
    password: string
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private registerSource = new Subject<LoginRequest>();
    private loginSource = new Subject<boolean>();
    private avatarSource = new Subject<string>();
    private nameSource = new Subject<string>();
    register$ = this.registerSource.asObservable();
    login$ = this.loginSource.asObservable();
    avatar$ = this.avatarSource.asObservable();
    name$ = this.nameSource.asObservable();
    setAvatar(avatar: string) {
        this.avatarSource.next(avatar);
    }
    setName(name: string) {
        this.nameSource.next(name);
    }
    setLogin(isLoggedIn: boolean) {
        this.loginSource.next(isLoggedIn);
    }
    registerToLogin(loginData: any) {
        this.registerSource.next(loginData);
    }
}


export interface Book {
    _id: number;
    title: string;
    quantity: number;
    description: string;
    price: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {

    // Observable string sources
    private cartSource = new Subject<any[]>();

    // Observable string streams
    cart$ = this.cartSource.asObservable();


    // Service message commands
    addToCart(cartData: Book) {
        let newBook: boolean = true;
        let booksArray: any[] = [];
        const currentBooks: any[] = JSON.parse(localStorage.getItem('books'));

        if (currentBooks) {
            booksArray = currentBooks;
            booksArray.forEach((book: Book) => {
                if (book._id === cartData._id) {
                    newBook = false;
                    book.quantity++
                }
            });
            cartData.quantity = 1;
            newBook ? booksArray.push(cartData) : null;
            localStorage.removeItem('books');
            localStorage.setItem('books', JSON.stringify(booksArray))
            this.cartSource.next(booksArray);
        } else {

            cartData.quantity = 1;
            booksArray.push(cartData);
            localStorage.removeItem('books');
            localStorage.setItem('books', JSON.stringify(booksArray))
            this.cartSource.next(booksArray);
        }

    }

    decrementBook(cartData: Book) {
        let booksArray: any[] = [];
        let deleteBook = -10;
        const currentBooks: any[] = JSON.parse(localStorage.getItem('books'));
        if (currentBooks) {
            booksArray = currentBooks;
            booksArray.forEach((book: Book, index) => {
                if (book._id === cartData._id) {
                    book.quantity--;
                    if (book.quantity === 0) { deleteBook = index }
                }
            });

            if (deleteBook !== -10) {
                booksArray.splice(deleteBook, 1)
            }

            localStorage.removeItem('books');
            if (booksArray.length !== 0) {
                localStorage.setItem('books', JSON.stringify(booksArray))

            }
            this.cartSource.next(booksArray);
        }

    }
}