import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
	signinForm: FormGroup;

	constructor( public navCtrl: NavController, public loadingCtrl: LoadingController, 
		public alertCtrl: AlertController, private userService: UserService,
		public formBuilder: FormBuilder )
	{
		this.signinForm = this.createSigninForm();
	}

	private createSigninForm()
	{
		return this.formBuilder.group( 
		{
			name: ["", Validators.required],
			lastName: ["", Validators.required],
			email: ["", Validators.required],
			password: ["", Validators.required],
			passwordConfirmation: ["", Validators.required]
		} );
	}

	public signin()
	{
		let loading = this.loadingCtrl.create(
		{
			content: "Please wait..."
		} );
		loading.present();

		this.userService.signin( this.signinForm.value ).then( response => {
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
}