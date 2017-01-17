import { Component } from "@angular/core";
import { App, Platform, NavController, AlertController } from "ionic-angular";

import { User, UserService } from "../../services/user.service";
import { TranslateServiceLocal } from "../../services/translate.service";
import { LoginPage } from "../login/login";

@Component(
{
	selector: "page-account",
	templateUrl: "account.html"
} )

export class AccountPage
{
	private user: User = this.userService.getUserInfo();

	constructor( private app: App, public platform: Platform, 
		public navCtrl: NavController, private alertCtrl: AlertController, 
		private userService: UserService, private translateService: TranslateServiceLocal )
	{
		this.platform.ready().then( () => 
		{
			this.user = this.userService.getUserInfo();
		} );
	}

	public logout(): void
	{
		let alert = this.alertCtrl.create(
		{
			title: this.translateService.translate( "INFO.LOGOUT" ),
			subTitle: this.translateService.translate( "INFO.LOGOUT_MESSAGE" ),
			buttons: [
			{
				text: this.translateService.translate( "INFO.CANCEL" )
			},
			{
				text: this.translateService.translate( "INFO.OK" ),
				handler: () => 
				{
					this.app.getRootNav().setRoot( LoginPage );
				}
			}]
		} );
		alert.present();
	}
}
