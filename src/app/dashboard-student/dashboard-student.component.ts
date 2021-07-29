import {Component, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {NavigationProvider} from '../providers/navigation.provider';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import User = firebase.User;
import {StudentLearningStyleService} from "../services/student-learning-style.service";
import {DashboardStudentProvider} from "./dashboard-student.provider";
import {Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogComponent} from "../shared/message-dialog/message-dialog.component";
import {CourseService} from "../services/course.service";
import {ChatComponent} from "../shared/chat/chat.component";

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.sass']
})
export class DashboardStudentComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  isMobile = false;
  isMobile$ = this.navigationProvider.isMobile$.pipe(map(u => {
    this.isMobile = u;
    return u;
  }));
  currentUser: User;
  hasLearningStyle$ = this.dashboardStudentProvider.learningStyle;
  notificationsData: {
    unread: number;
    notifications: any[];
  } = {unread: 0, notifications: []};
  courses: any[] = [];

  constructor(private navigationProvider: NavigationProvider,
              private angularFireAuth: AngularFireAuth,
              private studentLearningStyleService: StudentLearningStyleService,
              private dashboardStudentProvider: DashboardStudentProvider,
              private router: Router,
              private angularFirestore: AngularFirestore,
              private courseService: CourseService,
              private matDialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.angularFireAuth.currentUser;
    await this.initSubscription();
    await this.fetchForCourses();
  }

  private async initSubscription(): Promise<void> {
    const learningStyleSub = this.dashboardStudentProvider.learningStyle.subscribe(value => {
      if (value) {
        // this.router.navigateByUrl('/student');
      } else {
        this.router.navigateByUrl('/student/learning-style-questionnaire');
      }
    });
    this.subscription.add(learningStyleSub);

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

  async onLogout(): Promise<void> {
    this.navigationProvider.showLoader();
    await this.angularFireAuth.signOut();
    await this.router.navigateByUrl('/auth');
    this.navigationProvider.hideLoader();
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
    this.dashboardStudentProvider.learningStyle.next({});
  }

}
