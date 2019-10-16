import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {}

  constructor() {
  }

  ngOnInit() {
  }

  onConfirmPassword() {
    console.log('password', this.user, this.user.password, this.user.confirmPassword);
    if (this.user.password !== this.user.confirmPassword) {
      alert('Confirm Password is not match');
    }
  }

  onSubmit() {
    console.log('user', this.user);
  }

}
