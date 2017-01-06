import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, LoadingController, AlertController, ToastController } from "ionic-angular";

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
		public toastCtrl: ToastController, public formBuilder: FormBuilder )
	{
		this.loginForm = this.createLoginForm();
	}
	
	private createLoginForm()
	{
		return this.formBuilder.group( 
		{
			email: ["", [Validators.required, Validators.pattern( /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ )]],
			password: ["", [Validators.required, Validators.minLength( 6 )]]
		} );
	}

	private showToast( message: string )
	{
		let toast = this.toastCtrl.create(
		{
    		message: message,
      		duration: 3000,
      		position: "top"
    	} );
    	toast.present();
	}

	public login()
	{
		if( this.loginForm.valid )
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
		else if( this.loginForm.get( "email" ).invalid )
		{
			if( this.loginForm.get( "email" ).hasError( "required" ) )
				this.showToast( "The field Email is required" );
			else if( this.loginForm.get( "email" ).hasError( "pattern" ) )
				this.showToast( "The Email is invalid" );
		}
		else if( this.loginForm.get( "password" ).invalid )
		{
			if( this.loginForm.get( "password" ).hasError( "required" ) )
				this.showToast( "The field Password is required" );
			else if( this.loginForm.get( "password" ).hasError( "minlength" ) )
				this.showToast( "The minimum length Password is 6 characters" );
		}
	}

	public goSignIn()
	{
		this.navCtrl.push( SigninPage );
	}
}