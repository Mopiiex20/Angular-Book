import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import AuthService from '../../services/auth.service';


import { LoginService, CartService, Book } from '../../services/common.servise';

import { Subscription } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'popUp',
  templateUrl: './cartPopUp.html',
})
export class CartPopUp implements OnInit {

  data: any;
  totalPrice: number = 0;

  subCart: Subscription
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

  check: boolean = false;
  subscription: Subscription;
  subCart: Subscription;


  logInForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    public jwtHelper: JwtHelperService,
    private cartService: CartService,
    private _bottomSheet: MatBottomSheet

  ) {

    let a = JSON.parse(localStorage.getItem('login'))
    if (a) {
      this.check = a.isLoggedIn
    }
    this.subscription = this.loginService.register$.subscribe(
      loginData => {
        console.log(loginData);
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
  }

  openBottomSheet(): void {
    this._bottomSheet.open(CartPopUp);
  }

  logout() {
    this.trigger.openMenu();
    localStorage.clear()
    this.check = !this.check
    this.cartBadge = undefined;
  }

  onSubmit() {

    const body = this.logInForm.value;
    this.authService.post('login', body).subscribe((data: any) => {
      this.token = data.token;
      localStorage.setItem('token', this.token);
      this.check = true;
    })
  }

  ngDoCheck() {
    if (this.check) {
      const token = this.authService.getToken()
      const decoded = this.jwtHelper.decodeToken(token);

      this.avatar = `url("${decoded.avatar}")`;
      this.loginWelcome = `Welcome to book shop  - ${decoded.firstName} !`;

    }

  }

  ngOnInit() {
    const token = this.authService.getToken()
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.avatar = `url("${decoded.avatar}")`;
      this.check = true;
      this.loginWelcome = `Welcome to book shop  - ${decoded.firstName} !`;
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