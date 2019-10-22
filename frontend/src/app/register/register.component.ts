import {Component, OnInit} from '@angular/core';
import {MainService} from "../main.service";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {ToasterService} from "../service/toaster.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: any = {};
  username;
  customerId;
  showButton = true;

  constructor(private router: Router,
              private mainService: MainService,
              private userService: UserService,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.customerId = localStorage.getItem('customer_id');
  }

  onConfirmPassword() {
    console.log('password', this.user, this.user.password, this.user.confirmPassword);
    if (this.user.password !== this.user.confirmPassword) {
      this.toasterService.showError('Confirm Password is not match');
    } else {
      this.showButton = false;
    }
  }

  onRegister() {
    if (this.showButton) {
      this.toasterService.showError('Confirm Password is not match');
    } else {
      let data = {
        username: this.username,
        customer_id: this.customerId,
        password: this.user.password
      };
      this.userService.userPasswordUpdate(data)
        .subscribe((res) => {
          console.log('res', res);
          this.toasterService.showSuccess('Login Successfully');
          localStorage.setItem('token', res.tokens.authToken);
          this.router.navigate(['/dashboard']);
        }, error => {
          console.log('error', error);
        });
    }
  }
}
