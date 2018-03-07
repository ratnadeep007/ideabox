import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-newcomment',
  templateUrl: './newcomment.component.html',
  styleUrls: ['./newcomment.component.scss']
})
export class NewcommentComponent implements OnInit {

  comment: string;
  by: string;
  reminder: boolean = false;

  @Input() ideaId: string;

  constructor(private afs:AngularFirestore, public authservice: AuthService) { }

  ngOnInit() {
    console.log(this.ideaId);
  }

  addNew() {
    if(this.authservice.isLoggedIn()) {
      this.afs.collection('comments').add({
        'comment': this.comment,
        'by': this.by,
        'ideaId': this.ideaId
      }).then(() => {
        this.comment = '';
        this.by = '';
      });
    }else{
      this.reminder = true;
    }
  }

}
