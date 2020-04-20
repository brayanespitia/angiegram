import {
  Component,
  OnInit,
  DoCheck,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { UserService } from "../../services/user.service";
import { Global } from "../../services/global";
import { Publication } from "../../models/publication";
import { PublicationService } from "../../services/publications.service";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
  providers: [UserService, PublicationService],
})
export class SidebarComponent implements OnInit, DoCheck {
  public identity;
  public token;
  public stats;
  public url;
  public status;
  public publication: Publication;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.publication = new Publication("", "", "", "", this.identity._id);
  }

  ngOnInit() {
    console.log("componente sidebar cargado :3");
  }

  onSubmit(form) {
    this._publicationService
      .addPublication(this.token, this.publication)
      .subscribe(
        (response) => {
          if (response.publication) {
            //this.publication = response.publication;
            this.status = "success";
            form.reset();
            this._router.navigate(["/timeline"]);
          } else {
            this.status = "error";
          }
        },
        (error) => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage != null) {
            this.status = "error";
          }
        }
      );
  }
  ngDoCheck() {}

  //output
  @Output() sended = new EventEmitter();

  sendPublication(event) {
    console.log(event);
    this.sended.emit({ send: "true" });
  }
}
