import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient: HttpClient) {
  }

  async create(body): Promise<any> {
    return this.httpClient.post(`${environment.server}/alumno`, body).toPromise();
  }

  async createSocial(): Promise<any> {
    return this.httpClient.post(`${environment.server}/alumno/social`, {}).toPromise();
  }

  async list(): Promise<any> {
    return this.httpClient.get(`${environment.server}/alumno`).toPromise();
  }

  async ownUpdate(body: any): Promise<any> {
    return this.httpClient.patch(`${environment.server}/alumno`, body).toPromise();
  }
}
