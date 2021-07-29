import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationProvider} from "../../../../providers/navigation.provider";
import {CourseService} from "../../../../services/course.service";
import {MatDialog} from "@angular/material/dialog";
import {QuestionnaireComponent} from "../questionnaire/questionnaire.component";
import {MessageDialogComponent} from "../../../../shared/message-dialog/message-dialog.component";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  searchCtrl = new FormControl('');

  courseData: {
    Id: string,
    Descripcion: string,
    Nombre: string,
    Unidades: {
      Id: string,
      Indice: number,
      Nombre: string,
      Temas: {
        Id: string,
        Indice: number,
        Nombre: string,
        AlumnoCursa: any[],
        Finalizado: boolean,
        Aprobado: boolean,
        Activo: boolean,
        PuedeIntentar: boolean,
        TiempoVolverIntentar: number
      }[]
    }[]
  };

  private originalCourseData: {
    Id: string,
    Descripcion: string,
    Nombre: string,
    Unidades: {
      Id: string,
      Indice: number,
      Nombre: string,
      Temas: {
        Id: string,
        Indice: number,
        Nombre: string,
        AlumnoCursa: any[],
        Finalizado: boolean,
        Aprobado: boolean,
        Activo: boolean,
        PuedeIntentar: boolean,
        TiempoVolverIntentar: number
      }[]
    }[]
  };

  constructor(private activatedRoute: ActivatedRoute,
              private navigationProvider: NavigationProvider,
              private courseService: CourseService,
              private matDialog: MatDialog,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.initSubscription();
    await this.fetchData().then();
  }

  private async initSubscription(): Promise<void> {
    const searchSub = this.searchCtrl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        value = value.toString().toLocaleLowerCase();
        if (value.length > 0) {
          this.courseData.Unidades.forEach(u => {
            u.Temas = JSON.parse(JSON.stringify(this.originalCourseData.Unidades.find(v => v.Id === u.Id).Temas.filter(v => v.Nombre.toLocaleLowerCase().includes(value)).slice()));
          });
          // this.courseData.Unidades = this.originalCourseData.Unidades.filter(u => u.Nombre.toLocaleLowerCase().includes(value)).slice();
        } else {
          this.courseData.Unidades = JSON.parse(JSON.stringify(this.originalCourseData.Unidades.slice()));
        }
      });
    this.subscription.add(searchSub);
  }

  private async fetchData(): Promise<any> {
    const params = this.activatedRoute.snapshot.params;
    if (!params.id) {
      return this.router.navigateByUrl('/student');
    }
    this.navigationProvider.showLoader();
    try {
      this.originalCourseData = await this.courseService.content(params.id);
      await this.checkSubjectsAvailable();
      this.courseData = JSON.parse(JSON.stringify(this.originalCourseData));
    } catch (error) {
      console.log(error);
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async openQuestionnaire(subject: any): Promise<void> {
    console.log("Hola-subject en item",subject);
    const dialog = this.matDialog.open(QuestionnaireComponent, {
      data: subject,
      panelClass: 'responsive-full-screen-dialog'
    });

    const dialogResponse = await dialog.afterClosed().toPromise();
    if (dialogResponse && dialogResponse.finishSubject) {
      subject.Finalizado = true;
      this.matDialog.open(MessageDialogComponent, {
        data: {
          title: subject.Nombre,
          message: 'Tema finalizado'
        }
      });
      await this.fetchData();
    }
  }

  private async checkSubjectsAvailable(): Promise<any> {
    const unitIndex = this.originalCourseData.Unidades.map(u => u.Indice).sort();
    this.originalCourseData.Unidades.forEach(u => {
      const subjectIndex = u.Temas.map(v => v.Indice).sort();
      u.Temas.forEach(v => {
        if (v.Indice === Math.min(...subjectIndex) && u.Indice === Math.min(...unitIndex)) {
          v.Activo = true;
        } else if (v.Indice === Math.min(...subjectIndex) && u.Indice !== Math.min(...unitIndex)) {
          v.Activo = this.checkIfUnitHasFinished(u.Indice - 1);
        } else {
          const previousSubject = u.Temas.find(w => w.Indice === v.Indice - 1);
          if (previousSubject) {
            v.Activo = previousSubject.Aprobado;
          }
        }
      });
    });
    return;
  }

  private checkIfUnitHasFinished(unitIndex: number): boolean {
    const auxUnit = this.originalCourseData.Unidades.find(u => u.Indice === unitIndex);
    if (!auxUnit) {
      return false;
    }
    const lastSubject = auxUnit.Temas.find(u => u.Indice === Math.max(...auxUnit.Temas.map(v => v.Indice)));
    return lastSubject.Aprobado;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
