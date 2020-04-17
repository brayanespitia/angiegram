import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { User } from "../models/user";
import { Global } from "./global";

@Injectable()
export class UserService {
  public url: string;

  constructor(public _http: HttpClient) {
    this.url = Global.url;
  }

  register(user: User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set("Content-type", "application/json");

    return this._http.post(this.url + "register", params, { headers: headers });
  }
}
