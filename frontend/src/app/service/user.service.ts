import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

const httpPostOptions =
  {
    headers:
      new HttpHeaders (
        {
          "Content-Type": "application/json"
        }),
    withCredentials: true,
  };

@Injectable({
  providedIn: 'root'
})
export class UserService {


  api = environment.api;

  constructor(private http: HttpClient) {
  }

  userLogin(data) {
    return this.http.post<any>(this.api + '/user/login', data);
  }

  userPasswordUpdate(data) {
    return this.http.post<any>(this.api + '/user/passwordupdate', data);
  }
}
