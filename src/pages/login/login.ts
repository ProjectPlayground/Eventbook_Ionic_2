import { Component } from "@angular/core";
import { NavController, LoadingController } from "ionic-angular";

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

	constructor( public navCtrl: NavController, public loadingCtrl: LoadingController, private userService: UserService )
	{

	}

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
				console.log( response.description );
			loading.dismiss();
		} );
	}
}