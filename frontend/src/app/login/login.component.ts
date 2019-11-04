import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MainService} from "../main.service";
import {UserService} from "../service/user.service";
import {ToasterService} from "../service/toaster.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {}

  constructor(private router: Router,
              private mainService: MainService,
              private userService: UserService,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('token');
    console.log('accessToken', accessToken);
    if (!accessToken) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }


  onSubmit() {
    this.userService.userLogin(this.user)
      .subscribe((res) => {
        console.log('loginRes', res);
        if (res.password) {
          localStorage.setItem('token', res.tokens.authToken);
          localStorage.setItem('user_id', res.user.user_id);
          localStorage.setItem('customer_id', res.customer.customer_id);
          localStorage.setItem('customer_name', res.customer.name);
          this.toasterService.showSuccess('Login Successfully.');
          this.router.navigate(['/dashboard']);
        } else {
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('customer_id', res.user.customer_id);
          this.router.navigate(['/register']);
        }
      }, err => {
        console.log('loginRes', err);
        this.toasterService.showError(err.error.message);
      });
  }

}
