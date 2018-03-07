import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Detail {
  detail: string;
}

@Component({
  selector: 'app-detail-edit',
  templateUrl: './detail-edit.component.html',
  styleUrls: ['./detail-edit.component.scss']
})
export class DetailEditComponent implements OnInit {

  @Input() message: any;
  summary: string = 'No detail please add one';
  detailCol: AngularFirestoreCollection<Comment>;
  details: any;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    console.log(this.message.id);
    this.detailCol =this.afs.collection('details', ref => ref.where('ideaId', '==', this.message.id));
    this.detailCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Detail;
        const id = a.payload.doc.id;
        return { id, data };
      });
    }).subscribe((data) => {
      for(var i = 0; i < data.length; i++) {
        this.summary = data[0].data.detail;
      }
    })
    console.log(this.details);
  }

}
