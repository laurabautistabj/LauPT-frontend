import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationProvider} from '../../providers/navigation.provider';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {DashboardProfessorProvider} from '../dashboard-professor.provider';
import firebase from 'firebase/app';
import User = firebase.User;
import {ProfessorService} from '../../services/professor.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit {

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    motherLastName: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    gender: new FormControl('', [Validators.required]),
    photoURL: new FormControl(''),
    photoFile: new FormControl('')
  });

  currentUser: User;
  professorData = this.dashboardProfessorProvider.professorData;

  constructor(private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private dashboardProfessorProvider: DashboardProfessorProvider,
              private angularFireStorage: AngularFireStorage,
              private professorService: ProfessorService,
              private matSnackBar: MatSnackBar,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.profileForm.get('email').disable();
    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.currentUser = await this.angularFireAuth.currentUser;
      this.profileForm.patchValue({
        firstName: this.professorData.value.Nombre,
        lastName: this.professorData.value.ApPaterno,
        motherLastName: this.professorData.value.ApMaterno,
        email: this.professorData.value.Correo,
        address: this.professorData.value.Direccion,
        phone: this.professorData.value.Telefono,
        gender: this.professorData.value.Sexo,
        photoURL: this.professorData.value.Foto
      });
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onSubmit(): Promise<void> {
    this.navigationProvider.showLoader();
    const values = this.profileForm.value;
    try {
      if (values.photoFile) {
        const photoRef = this.angularFireStorage.storage.ref('profilePicture').child(this.currentUser.uid);
        await photoRef.put(values.photoFile);
        values.photoURL = await photoRef.getDownloadURL();
      }
      await this.currentUser.updateProfile({
        displayName: `${values.firstName} ${values.lastName}`,
        photoURL: values.photoURL
      });

      try {
        const professorData = await this.professorService.ownUpdate({
          Nombre: values.firstName,
          ApPaterno: values.lastName,
          ApMaterno: values.motherLastName,
          Direccion: values.address,
          Sexo: values.gender,
          Telefono: values.phone,
          Foto: values.photoURL,
        });
        this.dashboardProfessorProvider.professorData.next(professorData);
        this.matSnackBar.open('Los datos han sido actualizados', '', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        await this.router.navigateByUrl('/professor/profile');
      } catch (error) {
        this.matSnackBar.open(error.error.message, '', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      } finally {

      }

    } catch (e) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onSelectProfile(event): Promise<void> {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const photo = files.item(0);

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        this.profileForm.patchValue({
          photoURL: fileReader.result,
          photoFile: photo
        });
      };
      fileReader.readAsDataURL(photo);
    }
  }

}
