import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, LoadingController, AlertController } from "ionic-angular";

import { TabsPage } from "../tabs/tabs";
import { SigninPage } from "../signin/signin";
import { UserService } from "../../services/user.service";

@Component(
{
	selector: "page-login",
	templateUrl: "login.html"
} )

export class LoginPage
{
	loginForm: FormGroup;

	constructor( public navCtrl: NavController, public loadingCtrl: LoadingController, 
		public alertCtrl: AlertController, private userService: UserService,
		public formBuilder: FormBuilder )
	{
		this.loginForm = this.createLoginForm();
	}
	
	private createLoginForm()
	{
		return this.formBuilder.group( 
		{
			email: ["", Validators.required],
			password: ["", Validators.required]
		} );
	}

	public login()
	{
		let loading = this.loadingCtrl.create(
		{
			content: "Please wait..."
		} );
		loading.present();

		this.userService.login( this.loginForm.value ).then( response => {
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
		} ).catch( response =>
		{
			let alert = this.alertCtrl.create(
			{
				title: "Error",
				subTitle: "Connection error",
				buttons: ["OK"]
			} );
			alert.present();
			loading.dismiss();
		} );
	}

	public goSignIn()
	{
		this.navCtrl.push( SigninPage );
	}
}