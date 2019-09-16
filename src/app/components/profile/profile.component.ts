import { Component, OnInit, OnDestroy } from '@angular/core';
import AuthService from '../../services/auth.service';
import { LoginService } from '../../services/common.servise';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/users.service';
import * as jwt_decode from "jwt-decode";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private results: any;
  private login: string;
  private subscription: Subscription;
  private avatar: any;
  private changingName: boolean = false;
  private permissions: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private loginService: LoginService
  ) {
  }

  private ChangeNameForm = new FormGroup({
    firstName: new FormControl(''),
  });

  public toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  private async UploadAvatar() {
    let path: any = document.querySelector("#text-button-file") as HTMLElement;

    if (path.value !== "") {
      let avatar: any;
      await this.toBase64(path.files[0]).then((json) => avatar = json);
      path.value = "";
      const body = {
        avatar
      }
      this.userService.put(`${this.results.id}`, body)
        .subscribe();
      this.avatar = `url("${avatar}")`;
      this.loginService.setAvatar(avatar);



    } else { alert("Please pick some picture to upload") }
  }

  ngOnInit() {
    this.results = undefined;
    const token = this.authService.getToken()
    const decoded = jwt_decode(token) as any;
    this.userService.getAvatar(decoded.id).subscribe(
      (data: any) => {
        this.avatar = `url("${data.avatar}")`;
        this.permissions = decoded.permissions;
      }
    )
    this.userService.getOne(`${decoded.id}`).subscribe(
      data => {
        this.results = data.user;
      }
    )
  }
  public setName() {
    this.userService.put(`${this.results.id}`, this.ChangeNameForm.value).subscribe()
    this.results.firstName = this.ChangeNameForm.value.firstName
    this.changingName = false;
    this.loginService.setName(this.ChangeNameForm.value.firstName);

  }
  private changeName() {
    this.ChangeNameForm.patchValue({
      firstName: this.results.firstName
    })
    this.changingName = true;
  }

  ngOnDestroy() {
    this.results = [];
  }

}
