import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable()
export class AuthService {
  userFire: Observable<firebase.User>;
  user: Observable<User>;
  public userDetails: firebase.User = null;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router, public afs:AngularFirestore) {
    this.user = this._firebaseAuth.authState
      .switchMap(user => {
        if(user) {
          console.log(user);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      })
    this.userFire = this._firebaseAuth.authState;
    this.userFire.subscribe(
      (user) => {
        if(user) {
          this.userDetails = user;
          // console.log(this.userDetails);
        }else {
          this.userDetails = null;
        }
      }
    )
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
    .then(cred => {
      this.updateUserData(cred.user);
    })
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    ).then(cred => {
      this.updateUserData(cred.user);
    })
  }

  isLoggedIn() {
    // console.log(this.userDetails.uid);
    if(this.userDetails == null) {
      return false;
    }else{
      return true;
    }
  }

  logout() {
    this._firebaseAuth.auth.signOut();
  }

  signup(email: string, password: string) {
    this._firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        return true
      })
      .catch(err => {
        console.log("Something went wrong", err);
        return false;
      });
  }

  login(email: string, password: string) {
    return this._firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName
    }
    return userRef.set(data);
  }

}
