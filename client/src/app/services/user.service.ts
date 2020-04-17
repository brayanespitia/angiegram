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

  register(user_to_register) {
    console.log(user_to_register);
    console.log(this.url);
  }
}
