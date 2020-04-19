import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { UploadService } from "../../services/upload.service";
import { Global } from "../../services/global";
@Component({
  selector: "user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.css"],
  providers: [UserService, UploadService],
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ) {
    this.title = "Acutalizar mis datos";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = Global.url;
  }

  ngOnInit() {
    console.log(this.user);
    console.log("componente user edit componente se ha cargado");
  }

  onSubmit() {
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      (response) => {
        if (!response) {
          this.status = "error"; //mensaje de error en la vista
        } else {
          this.status = "success";
          localStorage.setItem("identity", JSON.stringify(this.user)); //act user en el localStorage
          this.identity = this.user; //actualizar user a nivel de la clase

          //SUBIDA DE IMAGEN DE USUARIO
          this._uploadService
            .makeFileRequest(
              this.url + "upload-image-user/" + this.user._id,
              [],
              this.filesToUpload,
              this.token,
              "image"
            )
            .then((result: any) => {
              this.user.image = result.image;
              localStorage.setItem("identity", JSON.stringify(this.user));
            });
        }
      },
      (error) => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        //esto es para poder mostrar un mensaje de error en la vista:
        //gracias a lavariable status
        if (errorMessage != null) {
          this.status = "error";
        }
      }
    );
  }
  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }
}
