import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user;
  constructor(private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log('userrrrrrrrrrrrrrr', this.user, this.user.username);
  }

  logout() {

    localStorage.clear();

    this.router.navigate(['']);


  }

}
