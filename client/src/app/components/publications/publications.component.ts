import { Component, OnInit, Input } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Global } from "../../services/global";
import { Publication } from "../../models/publication";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PublicationService } from "../../services/publications.service";
import * as $ from "jquery";

@Component({
  selector: "publications",
  templateUrl: "./publications.component.html",

  providers: [UserService, PublicationService],
})
export class PublicationsComponent implements OnInit {
  public identity;
  public token;
  public title;
  public url;
  public status;
  public page;
  public total;
  public pages;
  public itemsPerPage;

  public publications: Publication[];

  @Input() user: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = "Publicaciones";
    this.identity = this._userService.getIdentity();
    this.page = 1;
    this.token = this._userService.getToken();
    this.url = Global.url;
  }

  ngOnInit() {
    console.log("componente tpublicaciones cargado");
    this.getPublications(this.user, this.page);
  }

  getPublications(user, page, adding = false) {
    this._publicationService
      .getPublicationsUser(this.token, user, page)
      .subscribe(
        (response) => {
          if (response.publications) {
            this.total = response.total_items;
            this.pages = response.pages;
            this.itemsPerPage = response.items_per_page;

            if (!adding) {
              this.publications = response.publications;
            } else {
              var arrayA = this.publications;
              var arrayB = response.publications;
              this.publications = arrayA.concat(arrayB);

              $("html, body").animate(
                { scrollTop: $("html").prop("scrollHeight") },
                500
              );
            }

            if (page > this.pages) {
              //this._router.navigate(['/home']);
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

  public noMore = false;
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.user, this.page, true);
  }
}
