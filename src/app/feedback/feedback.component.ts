import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  name: string;
  email: string;
  suggestion: string;
  allowFeedback = true;
  feedbackText = "Thanks for your feedback";

  constructor(private afs:AngularFirestore, private router: Router) { }

  ngOnInit() {
  }

  addNew() {
    this.afs.collection('feedback').add({
      'name': this.name,
      'email': this.email,
      'suggestion': this.suggestion
    }).then(() => {
      this.allowFeedback = false;
      setTimeout(() => {
        console.log('2000');
        this.feedbackText = "Redirecting to homepage..."
      }, 2000);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    });
  }
}
