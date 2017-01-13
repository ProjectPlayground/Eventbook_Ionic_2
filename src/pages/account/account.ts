import { Component } from "@angular/core";
import { Platform, NavController } from "ionic-angular";

import { User, UserService } from "../../services/user.service";

@Component(
{
	selector: "page-account",
	templateUrl: "account.html"
} )

export class AccountPage
{
	private user: User = this.userService.getUserInfo();

	constructor( public navCtrl: NavController, private userService: UserService )
	{
	}
}
