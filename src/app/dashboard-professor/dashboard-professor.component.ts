import {Component, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {NavigationProvider} from '../providers/navigation.provider';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import User = firebase.User;
import {AngularFirestore} from "@angular/fire/firestore";
import {Subscription} from "rxjs";
import {CourseService} from "../services/course.service";
import {ChatComponent} from "../shared/chat/chat.component";
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogComponent} from "../shared/message-dialog/message-dialog.component";

@Component({
  selector: 'app-dashboard-professor',
  templateUrl: './dashboard-professor.component.html',
  styleUrls: ['./dashboard-professor.component.sass']
})
export class DashboardProfessorComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  isMobile = false;
  isMobile$ = this.navigationProvider.isMobile$.pipe(map(u => {
    this.isMobile = u;
    return u;
  }));
  currentUser: User;
  notificationsData: {
    unread: number;
    notifications: any[];
  } = {unread: 0, notifications: []};
  courses: any[] = [];

  constructor(private navigationProvider: NavigationProvider,
              private angularFireAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore,
              private courseService: CourseService,
              private matDialog: MatDialog,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.angularFireAuth.currentUser;
    await this.initSubscription();
    await this.fetchForCourses();
  }

  private async initSubscription(): Promise<void> {
    const notificationsDataSub = this.angularFirestore
      .collection('users')
      .doc(this.currentUser.uid)
      .collection('notifications', ref => ref.orderBy('created', 'desc').limit(15))
      .snapshotChanges()
      .pipe(
        map(u => u.map(v => ({id: v.payload.doc.id, ...v.payload.doc.data()})))
      )
      .subscribe(value => {
        this.notificationsData = {
          unread: value.filter((u: any) => !u.read).length,
          notifications: value
        };
      });
    this.subscription.add(notificationsDataSub);
  }

  async onLogout(): Promise<void> {
    this.navigationProvider.showLoader();
    await this.angularFireAuth.signOut();
    await this.router.navigateByUrl('/auth');
    this.navigationProvider.hideLoader();
  }

  private async fetchForCourses(): Promise<void> {
    try {
      this.courses = await this.courseService.list();
      const courseIds = this.courses.map(u => u.id);
      for (const courseId of courseIds) {
        const courseChatSub = this.angularFirestore.collection('courses')
          .doc(courseId)
          .collection('messages', ref => ref.orderBy('created', 'desc').limit(10))
          .valueChanges()
          .subscribe(value => {
            this.courses.find(u => u.id === courseId).lastMessages = value;
          });
        this.subscription.add(courseChatSub);
      }
    } catch (error) {

    }
  }

  async onViewNotification(notification: any): Promise<void> {
    if (!notification.read) {
      await this.angularFirestore.collection('users')
        .doc(this.currentUser.uid)
        .collection('notifications')
        .doc(notification.id)
        .update({
          read: true,
          readAt: new Date().getTime()
        });
    }
    this.matDialog.open(MessageDialogComponent, {
      data: {
        title: notification.title,
        message: notification.description
      }
    });
  }

  async onOpenChat(course: any): Promise<void> {
    this.matDialog.open(ChatComponent, {
      data: course,
      panelClass: 'custom-dialog'
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
