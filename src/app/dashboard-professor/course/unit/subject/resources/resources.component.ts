import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KnowledgeLevelService} from '../../../../../services/knowledge-level.service';
import {LearningStyleService} from '../../../../../services/learning-style.service';
import {NavigationProvider} from '../../../../../providers/navigation.provider';
import {UnitSubjectsService} from '../../../../../services/unit-subjects.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {ConfirmDialogComponent} from "../../../../../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.sass']
})
export class ResourcesComponent implements OnInit {
  onNewResource = false;
  resourceForm = new FormGroup({
    name: new FormControl('', Validators.required),
    url: new FormControl('', [Validators.required]),
    knowledgeLevel: new FormControl('', Validators.required),
    learningStyle: new FormControl('', Validators.required)
  });
  knowledgeLevels = [];
  learningStyles = [];

  resources = [];
  currentEditResource: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                Actualizado: string,
                Creado: string,
                Descripcion: string,
                Indice: number,
                Nombre: string,
                id: string,
                unidadCursoId: string,
              },
              private unitSubjectsService: UnitSubjectsService,
              private knowledgeLevelService: KnowledgeLevelService,
              private learningStyleService: LearningStyleService,
              private navigationProvider: NavigationProvider,
              private matSnackBar: MatSnackBar,
              private matDialog: MatDialog,
              private matDialogRef: MatDialogRef<ResourcesComponent>,
              private clipboard: Clipboard) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchResources();
    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.knowledgeLevels = await this.knowledgeLevelService.list();
      this.learningStyles = await this.learningStyleService.list();
    } catch (error) {
      this.matSnackBar.open('Algo salió mal, intente nuevamente', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this.matDialogRef.close();
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  private async fetchResources(): Promise<void> {
    this.navigationProvider.showLoader();
    this.resources = await this.unitSubjectsService.listResources(this.data.id);
    this.navigationProvider.hideLoader();
  }

  async onCreateResource(): Promise<void> {
    this.navigationProvider.showLoader();
    const body = {
      Nombre: this.resourceForm.value.name,
      URL: this.resourceForm.value.url,
      NivelConocimiento: this.resourceForm.value.knowledgeLevel,
      EstiloAprendizaje: this.resourceForm.value.learningStyle
    };
    try {
      if (this.currentEditResource) {
        await this.unitSubjectsService.deleteResource(this.currentEditResource.id);
      }
      await this.unitSubjectsService.createResource(this.data.id, body);
      this.matSnackBar.open('Recurso creado correctamente', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this.fetchResources().then();
    } catch (e) {
      this.matSnackBar.open(e.error.message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } finally {
      this.navigationProvider.hideLoader();
      await this.onCancelCreateResource();
    }
  }

  async onCancelCreateResource(): Promise<void> {
    this.currentEditResource = null;
    this.onNewResource = false;
    this.resourceForm.reset();
  }

  async copyUrl(url: string): Promise<void> {
    const hasCopied = this.clipboard.copy(url);
    if (hasCopied) {
      this.matSnackBar.open('La URL ha sido copiada al portapapeles', '', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    }
  }

  async onCreateNewResource(resource?: any): Promise<any> {
    this.onNewResource = true;
    this.currentEditResource = resource;
    if (resource) {
      this.resourceForm.patchValue({
        name: resource.Nombre,
        url: resource.Url,
        knowledgeLevel: this.knowledgeLevels.find(u => u.Nombre === resource.NivelConocimiento).id,
        learningStyle: this.learningStyles.find(u => u.Nombre === resource.EstiloAprendizaje).id
      });
    }
  }

  async onDeleteResource(resource: any): Promise<void> {
    console.log(resource);
    const confirm = await this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar recurso',
        message: '¿Confirma la eliminación del recurso?'
      }
    }).afterClosed().toPromise();

    if (!confirm) {
      return;
    }

    this.navigationProvider.showLoader();
    try {
      await this.unitSubjectsService.deleteResource(resource.id);
      this.matSnackBar.open('Recurso eliminado con éxito', '', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this.resources.splice(this.resources.findIndex(u => u.id === resource.id), 1);
    } catch (error) {
      this.matSnackBar.open(error.error.message, '', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
