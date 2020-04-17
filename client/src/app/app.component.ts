import { Component, OnInit, DoCheck } from "@angular/core";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [UserService],
})
export class AppComponent {
  public title: string;
  public identity: string;

  constructor(private _userService: UserService) {
    this.title = "ANGIEGRAM";
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
  }
  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }
}
