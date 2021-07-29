import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardStudentProvider {
  learningStyle = new BehaviorSubject<any>(null);
  studentData = new BehaviorSubject<any>(null);
}
