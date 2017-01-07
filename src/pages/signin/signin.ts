import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, LoadingController, AlertController, ToastController } from "ionic-angular";

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
		public toastCtrl: ToastController, public formBuilder: FormBuilder )
	{
		this.signinForm = this.createSigninForm();
	}

	private createSigninForm()
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

	public signin()
	{
		if( this.signinForm.valid )
		{
			if( this.signinForm.value.password === this.signinForm.value.passwordConfirmation )
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
			else
				this.showToast( "The passwords do not match" );
		}
		else if( this.signinForm.get( "name" ).invalid )
		{
			if( this.signinForm.get( "name" ).hasError( "required" ) )
				this.showToast( "The field Name is required" );
		}
		else if( this.signinForm.get( "lastName" ).invalid )
		{
			if( this.signinForm.get( "lastName" ).hasError( "required" ) )
				this.showToast( "The field LastName is required" );
		}
		else if( this.signinForm.get( "email" ).invalid )
		{
			if( this.signinForm.get( "email" ).hasError( "required" ) )
				this.showToast( "The field Email is required" );
			else if( this.signinForm.get( "email" ).hasError( "pattern" ) )
				this.showToast( "The Email is invalid" );
		}
		else if( this.signinForm.get( "password" ).invalid )
		{
			if( this.signinForm.get( "password" ).hasError( "required" ) )
				this.showToast( "The field Password is required" );
			else if( this.signinForm.get( "password" ).hasError( "minlength" ) )
				this.showToast( "The minimum length Password is 6 characters" );
		}
		else if( this.signinForm.get( "passwordConfirmation" ).invalid )
		{
			if( this.signinForm.get( "passwordConfirmation" ).hasError( "required" ) )
				this.showToast( "The field Confirm Password is required" );
			else if( this.signinForm.get( "passwordConfirmation" ).hasError( "minlength" ) )
				this.showToast( "The minimum length Confirm Password is 6 characters" );
		}
	}
}