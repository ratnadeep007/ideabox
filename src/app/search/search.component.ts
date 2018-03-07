import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchterm: string;

  startAt = new Subject();
  endAt = new Subject();

  ideas;
  allIdeas;

  searchBool: boolean = false;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.getAllIdeas().subscribe((ideas) => {
      this.allIdeas = ideas;
    });
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((ideas) => {
        this.ideas = ideas;
      });
    });
  }

  search($event) {
    let q = $event.target.value;
    if(q != '') {
      this.startAt.next(q);
      this.endAt.next(q + '\uf8ff');
    }
  }

  firequery(start, end) {
    return this.afs.collection('ideas', ref => ref.limit(4).orderBy('title').startAt(start).endAt(end)).valueChanges();
  }

  getAllIdeas() {
    return this.afs.collection('ideas', ref => ref.orderBy('title')).valueChanges();
  }

}
