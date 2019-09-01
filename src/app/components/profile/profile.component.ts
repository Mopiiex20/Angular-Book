import { Component, OnInit, OnDestroy } from '@angular/core';
import AuthService from '../../services/auth.service';
import { LoginService } from '../../services/common.servise';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  results: any[];
  login: string;
  subscription: Subscription;
  avatar: any;

  constructor(private missionService: LoginService, private authService: AuthService, private userService: UserService) {
    this.subscription = this.missionService.missionAnnounced$.subscribe(
      mission => {
        this.login = mission;
      });
  }

  toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  async UploadAvatar() {
    let path: any = document.querySelector("#text-button-file") as HTMLElement;

    if (path.value !== "") {
      await this.toBase64(path.files[0]).then((json) => this.avatar = json);
      path.value = "";
      console.log(this.avatar);
      const body = {
        avatar : this.avatar
      }
      this.userService.put('users/1', body).subscribe((data:any)=> console.log(data)
      )


    } else { alert("Please pick some picture to upload") }
  }

  ngOnInit() {

    this.results = [];
    this.authService.get('users/currentUser').subscribe((data: any) => {
      this.results.push(data.user);
      console.log(this.results);
    }
    );
  }

  ngOnDestroy() {
    this.results = [];
    // this.subscription.unsubscribe();
  }

}
