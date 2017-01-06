import { Component } from "@angular/core";
import { NavController, LoadingController, AlertController } from "ionic-angular";

import { TabsPage } from "../tabs/tabs";
import { UserService } from "../../services/user.service";

@Component(
{
	selector: "page-signin",
	templateUrl: "signin.html"
} )

export class SigninPage
{
	credentials = { name: "", lastName: "", email: "", password: "", passwordVerification: "" };

	constructor( public navCtrl: NavController, 
		public loadingCtrl: LoadingController, 
		public alertCtrl: AlertController,
		private userService: UserService ){}

	public signin()
	{
		let loading = this.loadingCtrl.create(
		{
			content: "Please wait..."
		} );
		loading.present();

		this.userService.signin( this.credentials ).then( response => {
			if( response.success )
				this.navCtrl.setRoot( TabsPage );
			else
			{
				let alert = this.alertCtrl.create(
				{
					title: "Error",
					subTitle: response.description,
					buttons: ["OK"]
				} );
				alert.present();
			}
			loading.dismiss();
		} );
	}
}