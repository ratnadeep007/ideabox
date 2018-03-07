import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  username: string = '';
  password: string = '';
  reppassword: string = '';
  showReg: boolean = false;
  loginstatus: boolean;

  @ViewChild('form') public form:ModalDirective;

  constructor(public authservice: AuthService) { }

  ngOnInit() {
    console.log(this.authservice.isLoggedIn());
    this.loginstatus = this.authservice.isLoggedIn();
  }

  toggleReg() {
    this.showReg = !this.showReg;
  }

  signGoogle() {
    this.authservice.signInWithGoogle()
    .then(res => {
      console.log('okay');
      this.form.hide();
    })
    .catch((err) => console.log(err));
  }

  signFacebook() {
    this.authservice.signInWithFacebook()
    .then(res => {
      console.log(res);
      this.form.hide();
    })
    .catch( err => console.log(err));
  }

  signup() {
    this.authservice.signup(this.username, this.password);
    this.showReg = !this.showReg;
  }

  signin() {
    this.authservice.login(this.username, this.password)
    .then(val => {
      this.username = this.password = '';
      this.loginstatus = this.authservice.isLoggedIn();
      this.form.hide();
    })
    .catch( err => console.log(err));
  }

  logout() {
    this.authservice.logout();
    this.loginstatus = this.authservice.isLoggedIn();
  }

  showmodal() {
    this.form.show()
  }
}
