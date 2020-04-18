import { Component, OnInit, DoCheck } from "@angular/core";

import { UserService } from "./services/user.service";
import { Router, ActivatedRoute, Params, Route } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [UserService],
})
export class AppComponent {
  public title: string;
  public identity: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.title = "ANGIEGRAM";
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(["/"]);
  }
}
