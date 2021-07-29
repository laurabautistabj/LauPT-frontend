import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationProvider} from '../../providers/navigation.provider';
import firebase from 'firebase/app';
import User = firebase.User;
import {DashboardProfessorProvider} from '../dashboard-professor.provider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  professorData = this.dashboardProfessorProvider.professorData;

  constructor(private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private dashboardProfessorProvider: DashboardProfessorProvider) {
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
