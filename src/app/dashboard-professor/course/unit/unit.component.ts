import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationProvider} from '../../../providers/navigation.provider';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.sass']
})
export class UnitComponent implements OnInit {

  data: { Nombre: string };

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigationProvider: NavigationProvider,
              private courseService: CourseService) {
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
      this.data = await this.courseService.retrieve(params.id);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
