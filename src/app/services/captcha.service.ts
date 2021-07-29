import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CaptchaService {

  constructor(private httpClient: HttpClient) {
  }

  async validate(response: string): Promise<any> {
    return this.httpClient.post(`${environment.server}/captcha`, {response}).toPromise();
  }
}
