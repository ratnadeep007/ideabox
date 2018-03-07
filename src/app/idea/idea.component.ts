import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { NewcommentComponent } from '../newcomment/newcomment.component';
import { NewComponent } from '../new/new.component';
import { DataComponent } from '../data/data.component';
import { DetailEditComponent } from '../detail-edit/detail-edit.component';

interface Idea {
  title: string;
  author: string;
  summary: string;
  category: string;
  claps: string;
}

interface Comment {
  comment: string;
  by: string;
  ideaId: string;
}

interface CommnetId extends Comment {
  CommentId: string;
}

@Component({
  selector: 'app-idea',
  templateUrl: './idea.component.html',
  styleUrls: ['./idea.component.scss']
})
export class IdeaComponent implements OnInit {

  id: any;
  ideaDoc: AngularFirestoreDocument<Idea>;
  ideaCol: AngularFirestoreCollection<Idea>;
  idea: Observable<Idea>;
  idea$: any;
  commentCol: AngularFirestoreCollection<Comment>;
  comments: any;

  newShow: boolean = false;
  oldShow: boolean = true;
  count: number = 0;
  clapCount: number = 0;
  titleIdea: string;
  authorIdea: string
  summary: string;
  category: string;
  editVisible: boolean = false;
  message: any;
  showDetailVar: boolean = false;
  editDetailBool: boolean = false;
  detailMessage = {};
  editMessage = {};

  constructor(private route: ActivatedRoute, private afs: AngularFirestore,
              private cd: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.ideaDoc = this.afs.doc(`ideas/${this.id}`);
    this.idea = this.ideaDoc.valueChanges();
    this.idea.subscribe(val => {
      this.clapCount = +val.claps;
      this.titleIdea = val.title;
      this.authorIdea = val.author;
      this.summary = val.summary;
      this.category = val.category;
      this.message = {
        id: this.id,
        name: 'Edit idea',
        title: this.titleIdea,
        author: this.authorIdea,
        summary: this.summary,
        category: this.category
      };
      console.log(this.message);
    });
    this.commentCol =this.afs.collection('comments', ref => ref.where('ideaId', '==', this.id));
    this.comments = this.commentCol.snapshotChanges()
      .map(actions => {
        console.log('comment not present');
        console.log(actions.length);
        if(actions.length < 1) {
          this.newShow = true;
        }
        return actions.map(a => {
          const data = a.payload.doc.data() as Comment;
          const id = a.payload.doc.id;
          console.log('querying');
          return { id, data };
        });
      });
    this.detailMessage = {
      'edit': this.editDetail,
      'id': this.id
    }
    this.editMessage = {
      'id': this.id,
    }
    console.log(this.count);

  }

  deleteComment(id) {
    this.afs.doc('comments/'+id).delete();
  }

  showAdd() {

  }

  like() {
    this.clapCount = this.clapCount + 1;
    console.log(this.clapCount);
    this.ideaCol = this.afs.collection<Idea>('ideas');
    this.ideaCol.doc(this.id).update({ claps: this.clapCount})
  }

  editIdea() {
    this.editVisible = !this.editVisible;
    console.log(this.editVisible);
  }

  deleteIdea() {
    this.afs.doc('ideas/'+this.id).delete();
    this.router.navigate(['']);
  }

  receiveMessage($event) {
    this.editVisible = $event;
  }

  showDetail() {
    this.showDetailVar = !this.showDetailVar;
    console.log(this.showDetailVar);
  }
  editDetail() {
    this.editDetailBool = !this.editDetailBool;
  }
}
