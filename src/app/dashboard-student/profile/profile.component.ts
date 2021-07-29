import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {DashboardStudentProvider} from '../dashboard-student.provider';
import firebase from 'firebase/app';
import User = firebase.User;
import {NavigationProvider} from '../../providers/navigation.provider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  learningStyle = this.dashboardStudentProvider.learningStyle;
  studentData = this.dashboardStudentProvider.studentData;

  constructor(private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private dashboardStudentProvider: DashboardStudentProvider) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.currentUser = await this.angularFireAuth.currentUser;
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
