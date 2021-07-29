import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationProvider} from "../../../../providers/navigation.provider";
import {CourseService} from "../../../../services/course.service";
import {CourseUnitsService} from "../../../../services/course-units.service";

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.sass']
})
export class SubjectComponent implements OnInit {

  data: { Nombre: string };

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigationProvider: NavigationProvider,
              private courseUnitsService: CourseUnitsService) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const params = this.activatedRoute.snapshot.params;
      if (!params.id) {
        await this.router.navigateByUrl('/professor');
      }
      this.data = await this.courseUnitsService.retrieve(params.id);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
