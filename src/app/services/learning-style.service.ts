import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningStyleService {

  private items: any[] = [];

  constructor(private httpClient: HttpClient) {
  }

  async list(): Promise<any> {
    if (this.items.length === 0) {
      this.items = await this.httpClient.get<any[]>(`${environment.server}/estilo-aprendizaje`).toPromise();
    }
    return this.items.slice(0);
  }

  async getQuestionnaire(): Promise<any> {
    return this.httpClient.get(`${environment.server}/cuestionario-estilo-aprendizaje`).toPromise();
  }
}
