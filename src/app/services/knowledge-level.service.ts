import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeLevelService {
  private items: any[] = [];

  constructor(private httpClient: HttpClient) {
  }

  async list(): Promise<any> {
    if (this.items.length === 0) {
      this.items = await this.httpClient.get<any[]>(`${environment.server}/nivel-conocimiento`).toPromise();
    }
    return this.items.slice(0);
  }
}
