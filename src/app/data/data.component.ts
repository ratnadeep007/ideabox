import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Detail {
  detail: string;
}

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  @Input() message: any;
  detailCol: AngularFirestoreCollection<Comment>;
  details: any;
  editBool: boolean;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    console.log(this.message.id);
    this.detailCol =this.afs.collection('details', ref => ref.where('ideaId', '==', this.message.id));
    this.details = this.detailCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Detail;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });

    console.log(this.details)
  }

}
