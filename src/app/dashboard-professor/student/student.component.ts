import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseService} from "../../services/course.service";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {NavigationProvider} from "../../providers/navigation.provider";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.sass']
})
export class StudentComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  courseCtrl = new FormControl('');
  courses: any[] = [];
  students: any[] = [];
  studentDetail: any;

  constructor(private courseService: CourseService,
              private navigationProvider: NavigationProvider) {
  }

  async ngOnInit(): Promise<void> {
    await this.initSubscription();
    await this.fetchInitialData();
  }

  private async initSubscription(): Promise<void> {
    const courseSub = this.courseCtrl.valueChanges.subscribe(value => {
      console.log(value);
      this.fetchStudentsInfo(value);
    });
    this.subscription.add(courseSub);
  }

  private async fetchStudentsInfo(courseId: string): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.students = await this.courseService.students(courseId);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  private async fetchInitialData(): Promise<void> {
    this.navigationProvider.showLoader();
    this.courses = await this.courseService.list();
    if (this.courses.length > 0) {
      this.courseCtrl.setValue(this.courses[0].id);
    }
    this.navigationProvider.hideLoader();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
