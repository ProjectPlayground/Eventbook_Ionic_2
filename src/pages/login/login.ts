import { Component } from "@angular/core";
import { NavController, LoadingController, AlertController } from "ionic-angular";

import { TabsPage } from "../tabs/tabs";
import { UserService } from "../../services/user.service";

@Component(
{
	selector: "page-login",
	templateUrl: "login.html"
} )

export class LoginPage
{
	credentials = { email: "", password: "" };
	response: any;

	constructor( public navCtrl: NavController, 
		public loadingCtrl: LoadingController, 
		public alertCtrl: AlertController,
		private userService: UserService ){}

	public login()
	{
		let loading = this.loadingCtrl.create(
		{
			content: "Please wait..."
		} );
		loading.present();

		this.userService.login( this.credentials ).then( response => {
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