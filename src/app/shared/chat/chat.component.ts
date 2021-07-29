import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/firestore";
import {map} from "rxjs/operators";
import {DashboardStudentProvider} from "../../dashboard-student/dashboard-student.provider";
import {FormControl} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase/app";
import User = firebase.User;
import {NavigationProvider} from "../../providers/navigation.provider";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainerRef') messagesContainerRef: ElementRef;
  @ViewChild('newMessageRef') newMessageRef: ElementRef;
  newMessageCtrl = new FormControl('');

  messages = this.angularFirestore.collection('courses')
    .doc(this.course.id)
    .collection('messages', ref => ref.orderBy('created', 'desc'))
    .valueChanges()
    .pipe(
      map(u => {
        setTimeout(() => {
          if (this.messagesContainerRef) {
            this.messagesContainerRef.nativeElement.scrollTop = this.messagesContainerRef.nativeElement.scrollHeight;
          }
        }, 200);
        return u.reverse();
      })
    );
  currentUser: User;

  constructor(@Inject(MAT_DIALOG_DATA) public course,
              private dashboardStudentProvider: DashboardStudentProvider,
              private matDialogRef: MatDialogRef<ChatComponent>,
              private angularFirestore: AngularFirestore,
              private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider) {
  }

  async ngOnInit(): Promise<void> {
    this.navigationProvider.showLoader();
    this.currentUser = await this.angularFireAuth.currentUser;
    this.navigationProvider.hideLoader();
  }

  async sendMessage(): Promise<void> {
    const message = this.newMessageCtrl.value;
    this.newMessageCtrl.reset();
    this.newMessageRef.nativeElement.focus();
    await this.angularFirestore.collection('courses')
      .doc(this.course.id)
      .collection('messages')
      .add({
        createdBy: {
          name: this.currentUser.displayName,
          img: this.currentUser.photoURL ? this.currentUser.photoURL : this.currentUser.email,
          id: this.currentUser.uid
        },
        created: new Date().getTime(),
        message
      });
  }

}
