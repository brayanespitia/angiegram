import { Component, OnInit } from "@angular/core";

import { UserService } from "../../services/user.service";
import { Global } from "../../services/global";
import { Publication } from "../../models/publication";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PublicationService } from "../../services/publications.service";
import * as $ from "jquery";
import { User } from "../../models/user";
import { Follow } from "../../models/follow";
import { FollowService } from "../../services/follow.service";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  providers: [UserService, FollowService],
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public followed;
  public following;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = "Perfil";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.following = false;
    this.followed = false;
  }

  ngOnInit() {
    console.log("componente perfil cargado");
    this.loadPage();
  }

  loadPage() {
    this._route.params.subscribe((params) => {
      let id = params["id"];
      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      (response) => {
        if (response.user) {
          console.log(response);
          this.user = response.user;

          if (response.following && response.following._id) {
            this.following = true;
          } else {
            this.following = false;
          }
        } else {
          this.status = "error";
        }
        if (response.followed && response.followed._id) {
          this.followed = true;
        } else {
          this.followed = false;
        }
      },
      (error) => {
        console.log(<any>error);
        this._router.navigate(["/perfil", this.identity._id]);
      }
    );
  }

  getCounters(id) {
    this._userService.getCounters(id).subscribe(
      (response) => {
        this.stats = response;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  followUser(followed) {
    var follow = new Follow("", this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      (response) => {
        this.following = true;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      (response) => {
        this.following = false;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave() {
    this.followUserOver = 0;
  }
}
