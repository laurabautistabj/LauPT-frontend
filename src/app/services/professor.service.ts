import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  constructor(private httpClient: HttpClient) {
  }

  async create(body): Promise<any> {
    return this.httpClient.post(`${environment.server}/profesor`, body).toPromise();
  }

  async list(): Promise<any> {
    return this.httpClient.get(`${environment.server}/profesor`).toPromise();
  }

  async ownUpdate(body: any): Promise<any> {
    return this.httpClient.patch(`${environment.server}/profesor`, body).toPromise();
  }
}
