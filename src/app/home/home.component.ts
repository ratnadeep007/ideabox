import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { NewComponent } from '../new/new.component';
import { SearchComponent } from '../search/search.component';

interface Idea {
  title: string;
  author: string;
  summary: string;
  category: string;
  claps: string;
}

interface IdeaId extends Idea {
  id: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  ideasCol: AngularFirestoreCollection<Idea>;
  ideas: any;
  docCount: number;

  btnText: string = "Add new idea";
  isVisible: boolean = false;
  alertBox: boolean = false;
  isActive: string = "animated slideInDown";
  ideaTitle: string;
  ideaAuthor: string;

  message = "Add new idea";

  constructor(private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.ideasCol = this.afs.collection('ideas');
    this.ideas = this.ideasCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Idea;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });
  }

  showAdd() {
    this.isVisible = !this.isVisible;
    console.log(this.isVisible);
    if(this.isVisible) {
      this.btnText = "Cancel";
      this.isActive = "animated slideInDown";
    }
    else {
      this.btnText = "Add new idea";
    }
  }

  addNew(){
    console.log(this.ideaTitle);
  }

  showIdea(ideaId) {
    this.router.navigate(['/', ideaId]);
  }

  receiveMessage($event) {
    this.isVisible = $event;
    this.alertBox = true;
    setTimeout(() => {
      this.alertBox = false
    }, 5000);
    this.btnText = "Add new idea";
  }
}
