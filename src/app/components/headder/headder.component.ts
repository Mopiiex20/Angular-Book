import { Component, OnInit, Input, ViewChild, DoCheck } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import AuthService from '../../services/auth.service';
import * as jwt_decode from "jwt-decode";
import { LoginService, CartService, Book } from '../../services/common.servise';

import { Subscription } from 'rxjs';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/users.service';



@Component({
  selector: 'popUp',
  templateUrl: './cartPopUp.html',
})
export class CartPopUp implements OnInit {

  data: any;
  totalPrice: number = 0;

  subCart: Subscription;

  constructor(private _bottomSheetRef: MatBottomSheetRef<CartPopUp>, private cartService: CartService, ) {

    this.subCart = this.cartService.cart$.subscribe(
      cartData => {
        this.totalPrice = 0;
        const currentBooks: any[] = JSON.parse(localStorage.getItem('books'));

        if (currentBooks) {
          this.data = currentBooks;
          this.data.forEach((book: Book) => {
            this.totalPrice += book.quantity * book.price
          });
        } else {
          this.data = undefined;
        }

      });
  }

  bookIncrement(book: Book) {
    this.cartService.addToCart(book);
  }

  bookDecrement(book: Book) {
    this.cartService.decrementBook(book)
  }

  ngOnInit() {
    this.totalPrice = 0;
    const currentBooks: any[] = JSON.parse(localStorage.getItem('books'));
    if (currentBooks) {
      this.data = currentBooks;
      this.data.forEach(book => {
        this.totalPrice += book.quantity * book.price
      });
    }
  }
}

@Component({
  selector: 'app-headder',
  templateUrl: './headder.component.html',
  styleUrls: ['./headder.component.scss']
})
export class HeadderComponent implements OnInit, DoCheck {

  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;


  loginWelcome: string;
  avatar: string;
  token: string;
  cartBadge: number;
  permiss: boolean = false;


  check: boolean = false;
  subscription: Subscription;
  subCart: Subscription;
  subAvatar: Subscription;
  subName: Subscription;



  logInForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private cartService: CartService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private userService: UserService

  ) {

    let a = JSON.parse(localStorage.getItem('login'))
    if (a) {
      this.check = a.isLoggedIn
    }
    this.subscription = this.loginService.register$.subscribe(
      loginData => {
        this.logInForm.patchValue({
          username: loginData.email,
          password: loginData.password,
        })
      });

    this.subCart = this.cartService.cart$.subscribe(
      cartData => {
        const currentBooks: any[] = JSON.parse(localStorage.getItem('books'));
        let num = 0;
        if (currentBooks) {
          currentBooks.forEach((book: any) => {
            num += book.quantity;
          });
          this.cartBadge = num;
        } else this.cartBadge = undefined;

      });
    this.subAvatar = this.loginService.avatar$.subscribe(
      (avatar: string) => {
        this.avatar = `url("${avatar}")`;
      }
    )
    this.subName = this.loginService.name$.subscribe(
      (name: string) => {
        this.loginWelcome = `Welcome to book shop  - ${name} !`;
      }
    )
  }

  permissionsCheck(perm: any[]) {
    let c1 = false;
    perm.forEach(element => {
      if (element === 'user') {
        c1 = false
      } else c1 = true
    });
    return c1
  }

  openBottomSheet(): void {
    this._bottomSheet.open(CartPopUp);
  }

  logout() {
    this.trigger.openMenu();
    localStorage.clear()
    this.check = !this.check
    this.cartBadge = undefined;
    this.loginService.setLogin(false)
  }

  onSubmit() {

    const body = this.logInForm.value;
    this.authService.post('login', body).subscribe((data: any) => {
      this.token = data.token;
      const decoded = jwt_decode(this.token) as any;
      this.permiss = this.permissionsCheck(decoded.permissions);
      localStorage.setItem('token', `${this.token}`);
      this.userService.getAvatar(decoded.id).subscribe(
        (data: any) => {
          this.avatar = `url("${data.avatar}")`;
          this.loginWelcome = `Welcome to book shop  - ${decoded.firstName} !`;
        }
      )
      this.check = true;
      this.loginService.setLogin(true)
    },
      (error: any) => {
        this._snackBar.open(error.error.message);
      }
    )
  }

  ngDoCheck() {
    if (this.check) {
      const token = this.authService.getToken()
      const decoded = jwt_decode(token) as any;




    }
  }

  ngOnInit() {
    const token = this.authService.getToken()
    if (token) {
      const decoded = jwt_decode(token) as any;
      this.permiss = this.permissionsCheck(decoded.permissions);
      this.userService.getAvatar(decoded.id).subscribe(
        (data: any) => {
          this.avatar = `url("${data.avatar}")`;

        }
      )
      this.userService.getOne(`${decoded.id}`).subscribe(
        data => {
          this.loginWelcome = `Welcome to book shop  - ${data.user.firstName} !`;
        }
      )
      this.check = true;
      const currentBooks: any[] = JSON.parse(localStorage.getItem('books'));
      if (currentBooks) {
        let num = 0;
        currentBooks.forEach((book: any) => {
          num += book.quantity;
          this.cartBadge = num;
        });
      }
    }
  }
}