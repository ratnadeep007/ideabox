import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NgOption } from '@ng-select/ng-select';
import { Router } from '@angular/router';

interface Idea {
  title: string;
  author: string;
  summary: string;
  category: string;
  claps: string;
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  title: string;
  author: string;
  summary: string;
  messageTitle: string = '';
  messageAuthor: string = '';
  messageSummary: string = '';
  ideaCol: AngularFirestoreCollection<Idea>;
  categories =[
    {id: 1, name: 'Web Development'},
    {id: 2, name: 'Web Services'}
  ];
  selectedCategoryId: any;
  isVisible: boolean;

  @Output() hideEvent = new EventEmitter<boolean>();
  @Input() message: any;

  constructor(private afs:AngularFirestore, private route: Router) { }

  ngOnInit() {
    if(this.message) {
      console.log(this.message);
      this.title = this.message.title;
      this.author = this.message.author;
      this.summary = this.message.summary;
      for(var i=0; i < this.categories.length; i++) {
        if(this.categories[i].name == this.message.category)
          this.selectedCategoryId =this.categories[i].id;
      }
    }
  }

  addNew() {
    var categoryToAdd = this.categories.filter( (category) => {
      return category.id == this.selectedCategoryId.toString();
    });
    if(!this.message.title){
      this.afs.collection('ideas').add({
        'title': this.title,
        'author': this.author,
        'summary': this.summary,
        'category': categoryToAdd[0].name,
        'claps': 0
      }).then(() => {
        console.log('Successful');
        this.hideEvent.emit(this.isVisible);
      }).catch((e) => {
        console.log('Error', e);
      });
    }else{
      this.ideaCol = this.afs.collection<Idea>('ideas');
      this.ideaCol.doc(this.message.id).update({
        'title': this.title,
        'author': this.author,
        'summary': this.summary,
        'category': categoryToAdd[0].name
      }).then(() => {
        this.hideEvent.emit(this.isVisible)
      })
    }
  }
}
