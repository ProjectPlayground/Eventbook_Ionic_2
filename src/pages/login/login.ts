import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "ng2-translate";
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
		public toastCtrl: ToastController, public formBuilder: FormBuilder,
		private translateService: TranslateService )
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

	private translateMessage( messageTranslate: string )
	{
		let message: string;
		this.translateService.get( messageTranslate ).subscribe( value => 
		{
			message = value;
		} );

		return message;
	}

	private showToast( messageTranslate: string )
	{
		let message = this.translateMessage( messageTranslate );

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
		this.navCtrl.setRoot( TabsPage );
		if( this.loginForm.valid )
		{
			let loading = this.loadingCtrl.create(
			{
				content: this.translateMessage( "LOGIN.VERIFYING_CREDENTIALS" )
			} );
			loading.present();

			this.userService.login( this.loginForm.value ).then( response => {
				if( response.success )
					this.navCtrl.setRoot( TabsPage );
				else if( response.error === 2 )
				{
					let alert = this.alertCtrl.create(
					{
						title: this.translateMessage( "ERROR.TITLE" ),
						subTitle: this.translateMessage( response.translation ),
						buttons: [
						{
							text: this.translateMessage( "ERROR.CANCEL" )
						},
						{
							text: this.translateMessage( "ERROR.OK" ),
							handler: () => {
								this.goSignIn();
							}
						}]
					} );
					alert.present();
				}
				else
				{
					let alert = this.alertCtrl.create(
					{
						title: this.translateMessage( "ERROR.TITLE" ),
						subTitle: this.translateMessage( response.translation ),
						buttons: [this.translateMessage( "ERROR.OK" )]
					} );
					alert.present();
				}
				loading.dismiss();
			} ).catch( response =>
			{
				let alert = this.alertCtrl.create(
				{
					title: this.translateMessage( "ERROR.TITLE" ),
					subTitle: this.translateMessage( "ERROR.CONNECTION" ),
					buttons: [this.translateMessage( "ERROR.OK" )]
				} );
				alert.present();
				loading.dismiss();
			} );
		}
		else if( this.loginForm.get( "email" ).invalid )
		{
			if( this.loginForm.get( "email" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_EMAIL" );
			else if( this.loginForm.get( "email" ).hasError( "pattern" ) )
				this.showToast( "WARNING.INVALID_EMAIL" );
		}
		else if( this.loginForm.get( "password" ).invalid )
		{
			if( this.loginForm.get( "password" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_PASSWORD" );
			else if( this.loginForm.get( "password" ).hasError( "minlength" ) )
				this.showToast( "WARNING.MINLENGTH_PASSWORD" );
		}
	}

	public goSignIn()
	{
		this.navCtrl.push( SigninPage );
	}
}