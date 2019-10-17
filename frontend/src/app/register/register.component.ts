import { Component, OnInit } from '@angular/core';
import {MainService} from "../main.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: any = {};
  constructor(private mainService: MainService) { }

  ngOnInit() {

  }

  onConfirmPassword() {
    console.log('password', this.user, this.user.password, this.user.confirmPassword);
    if (this.user.password !== this.user.confirmPassword) {
      alert('Confirm Password is not match');
    }
  }

  onRegister() {

  }
}
