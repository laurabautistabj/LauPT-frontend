import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationProvider} from '../../providers/navigation.provider';
import {DashboardStudentProvider} from '../dashboard-student.provider';
import firebase from 'firebase/app';
import User = firebase.User;
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {StudentService} from '../../services/student.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

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
  learningStyle = this.dashboardStudentProvider.learningStyle;
  studentData = this.dashboardStudentProvider.studentData;

  constructor(private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private dashboardStudentProvider: DashboardStudentProvider,
              private angularFireStorage: AngularFireStorage,
              private studentService: StudentService,
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
        firstName: this.studentData.value.Nombre,
        lastName: this.studentData.value.ApPaterno,
        motherLastName: this.studentData.value.ApMaterno,
        email: this.studentData.value.Correo,
        address: this.studentData.value.Direccion,
        phone: this.studentData.value.Telefono,
        gender: this.studentData.value.Sexo,
        photoURL: this.studentData.value.Foto
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
        const studentData = await this.studentService.ownUpdate({
          Nombre: values.firstName,
          ApPaterno: values.lastName,
          ApMaterno: values.motherLastName,
          Direccion: values.address,
          Sexo: values.gender,
          Telefono: values.phone,
          Foto: values.photoURL,
        });
        this.dashboardStudentProvider.studentData.next(studentData);
        this.matSnackBar.open('Los datos han sido actualizados', '', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        await this.router.navigateByUrl('/student/profile');
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
