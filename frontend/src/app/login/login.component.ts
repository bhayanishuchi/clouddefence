import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MainService} from "../main.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {}

  constructor(private router: Router,
              private mainService: MainService) {
  }

  ngOnInit() {
  }


  onSubmit() {
    this.router.navigate(['/register']);
    // this.mainService.shareData(this.user);
   /* if (res.password === '') {
      this.router.navigate(['/register']);
    } else {
      this.router.navigate(['/dashboard']);
    }*/
    console.log('user', this.user);
  }

}
