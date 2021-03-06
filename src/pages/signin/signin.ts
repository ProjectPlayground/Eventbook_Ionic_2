import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, LoadingController, AlertController, ToastController } from "ionic-angular";

import { TabsPage } from "../tabs/tabs";
import { UserService } from "../../services/user.service";
import { TranslateServiceLocal } from "../../services/translate.service";

@Component(
{
	selector: "page-signin",
	templateUrl: "signin.html"
} )

export class SigninPage
{
	signinForm: FormGroup;

	constructor( public navCtrl: NavController, private loadingCtrl: LoadingController, 
		private alertCtrl: AlertController, private toastCtrl: ToastController, 
		private userService: UserService, private formBuilder: FormBuilder,
		private translateService: TranslateServiceLocal )
	{
		this.signinForm = this.createSigninForm();
	}

	private showToast( messageToTranslate: string ): void
	{
		let message = this.translateService.translate( messageToTranslate );

		let toast = this.toastCtrl.create(
		{
			message: message,
			duration: 3000,
			position: "top"
		} );
		toast.present();
	}

	private createSigninForm(): FormGroup
	{
		return this.formBuilder.group( 
		{
			name: ["", [Validators.required]],
			lastName: ["", [Validators.required]],
			email: ["", [Validators.required, Validators.pattern( /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ )]],
			password: ["", [Validators.required, Validators.minLength( 6 )]],
			passwordConfirmation: ["", [Validators.required, Validators.minLength( 6 )]]
		} );
	}

	private checkForm(): boolean
	{
		if( this.signinForm.valid )
			return true;
		else if( this.signinForm.get( "name" ).invalid )
		{
			if( this.signinForm.get( "name" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_NAME" );
		}
		else if( this.signinForm.get( "lastName" ).invalid )
		{
			if( this.signinForm.get( "lastName" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_LASTNAME" );
		}
		else if( this.signinForm.get( "email" ).invalid )
		{
			if( this.signinForm.get( "email" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_EMAIL" );
			else if( this.signinForm.get( "email" ).hasError( "pattern" ) )
				this.showToast( "WARNING.INVALID_EMAIL" );
		}
		else if( this.signinForm.get( "password" ).invalid )
		{
			if( this.signinForm.get( "password" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_PASSWORD" );
			else if( this.signinForm.get( "password" ).hasError( "minlength" ) )
				this.showToast( "WARNING.MINLENGTH_PASSWORD" );
		}
		else if( this.signinForm.get( "passwordConfirmation" ).invalid )
		{
			if( this.signinForm.get( "passwordConfirmation" ).hasError( "required" ) )
				this.showToast( "WARNING.REQUIRED_PASSWORD" );
			else if( this.signinForm.get( "passwordConfirmation" ).hasError( "minlength" ) )
				this.showToast( "WARNING.MINLENGTH_PASSWORD" );
		}

		return false;
	}

	public signin(): void
	{
		if( this.checkForm() )
		{
			if( this.signinForm.value.password === this.signinForm.value.passwordConfirmation )
			{
				let loading = this.loadingCtrl.create(
				{
					content: this.translateService.translate( "SIGNIN.ADDING_INFORMATION" )
				} );
				loading.present();

				this.userService.signin( this.signinForm.value ).then( response => 
				{
					if( response.success )
						this.navCtrl.setRoot( TabsPage );
					else
					{
						let alert = this.alertCtrl.create(
						{
							title: this.translateService.translate( "ERROR.TITLE" ),
							subTitle: this.translateService.translate( response.translation ),
							buttons: [this.translateService.translate( "ERROR.OK" )]
						} );
						alert.present();
					}
					loading.dismiss();
				} ).catch( response =>
				{
					let alert = this.alertCtrl.create(
					{
						title: this.translateService.translate( "ERROR.TITLE" ),
						subTitle: this.translateService.translate( "ERROR.CONNECTION" ),
						buttons: [this.translateService.translate( "ERROR.OK" )]
					} );
					alert.present();
					loading.dismiss();
				} );
			}
			else
				this.showToast( "WARNING.PASSWORDS_DO_NOT_MATCH" );
		}
	}
}