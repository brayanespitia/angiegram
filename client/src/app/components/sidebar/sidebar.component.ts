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
import { UploadService } from "../../services/upload.service";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
  providers: [UserService, PublicationService, UploadService],
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
    private _uploadService: UploadService,
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

  onSubmit(form, $event) {
    this._publicationService
      .addPublication(this.token, this.publication)
      .subscribe(
        (response) => {
          if (response.publication) {
            //this.publication = response.publication;
            if (this.filesToUpload && this.filesToUpload.length) {
              //subir imagen

              this._uploadService
                .makeFileRequest(
                  this.url + "upload-image-pub/" + response.publication._id,
                  [],
                  this.filesToUpload,
                  this.token,
                  "image"
                )
                .then((result: any) => {
                  this.publication.file = result.image;
                  this.status = "success";
                  form.reset();
                  this._router.navigate(["/timeline"]);
                  this.sended.emit({ send: "true" });
                });
            } else {
              this.status = "success";
              form.reset();
              this._router.navigate(["/timeline"]);
              this.sended.emit({ send: "true" });
            }
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

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  //output
  @Output() sended = new EventEmitter();

  sendPublication(event) {
    console.log(event);
    this.sended.emit({ send: "true" });
  }
}
