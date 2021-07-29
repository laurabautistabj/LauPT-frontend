import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../../services/course.service";
import {NavigationProvider} from "../../../../providers/navigation.provider";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  data: any[] = [];
  images: any[] = [];
  random: Number;

  constructor(private courseService: CourseService,
              private navigationProvider: NavigationProvider) {
  }

  async ngOnInit(): Promise<void> {
    this.fetchData().then();
    this.images = [
      'https://www.ceupe.com/images/easyblog_articles/2745/b2ap3_large_tecnologas-de-las-telecomunicaciones.jpg',
      'https://andinalink.com/wp-content/uploads/2018/07/TELECOMMUNICATIONS-4-785x500.jpg',
      'https://img.interempresas.net/fotos/2698915.jpeg',
      'https://www.ui1.es/sites/default/files/blog/images/derecho-usuarios-telecomunicaciones_1.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvV6SWhR-GgQ_zB31snthVe5UPHrFWSeo-tUwzDPsF1Tfg9y8BONPpP8BRICG1UJVR14&usqp=CAU',
      'https://www.ceupe.com/images/easyblog_articles/2745/b2ap3_large_tecnologas-de-las-telecomunicaciones.jpg',
      'https://andinalink.com/wp-content/uploads/2018/07/TELECOMMUNICATIONS-4-785x500.jpg',
      'https://img.interempresas.net/fotos/2698915.jpeg',
      'https://www.ui1.es/sites/default/files/blog/images/derecho-usuarios-telecomunicaciones_1.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvV6SWhR-GgQ_zB31snthVe5UPHrFWSeo-tUwzDPsF1Tfg9y8BONPpP8BRICG1UJVR14&usqp=CAU'
    ];
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.data = await this.courseService.list();
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
