import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, LoadingController, AlertController, ToastController } from "ionic-angular";

import { TabsPage } from "../tabs/tabs";
import { SigninPage } from "../signin/signin";
import { User, UserService } from "../../services/user.service";
import { Event } from "../../services/event.service";
import { TranslateServiceLocal } from "../../services/translate.service";

@Component(
{
	selector: "page-login",
	templateUrl: "login.html"
} )

export class LoginPage
{
	loginForm: FormGroup;

	constructor( public navCtrl: NavController, private loadingCtrl: LoadingController, 
		private alertCtrl: AlertController, private toastCtrl: ToastController, 
		private formBuilder: FormBuilder, private userService: UserService,
		private translateService: TranslateServiceLocal )
	{
		this.loginForm = this.createLoginForm();
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
	
	private createLoginForm(): FormGroup
	{
		return this.formBuilder.group( 
		{
			email: ["", [Validators.required, Validators.pattern( /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ )]],
			password: ["", [Validators.required, Validators.minLength( 6 )]]
		} );
	}

	public goSignIn(): void
	{
		this.navCtrl.push( SigninPage );
	}

	private checkForm(): boolean
	{
		if( this.loginForm.valid )
			return true;
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

		return false;
	}

	public login(): void
	{
		if( this.checkForm() )
		{
			let loading = this.loadingCtrl.create(
			{
				content: this.translateService.translate( "LOGIN.VERIFYING_CREDENTIALS" )
			} );
			loading.present();

			this.userService.login( this.loginForm.value ).then( response => 
			{
				if( response.success )
				{
					let userAux = response.user;
					let events: Array<Event> = [];
					for( let i = 0; i < userAux.events.length; ++i )
					{
						let event = 
						{
							id: userAux.events[i].id,
							name: userAux.events[i].name,
							type: userAux.events[i].type,
							description: userAux.events[i].description,
							startDateTime: userAux.events[i].startDateTime,
							finishDateTime: userAux.events[i].finishDateTime,
							latitude: userAux.events[i].latitude,
							longitude: userAux.events[i].longitude,
							imageURL: userAux.events[i].imageURL,
							cityId: userAux.events[i].cityId
						};
						events.push( new Event( event ) );
					}

					let userTemp = 
					{
						id: userAux.id,
						name: userAux.name,
						lastName: userAux.lastName,
						email: userAux.email,
						events: events
					};

					this.userService.setUserInfo( new User( userTemp ) );

					this.navCtrl.setRoot( TabsPage );
				}
				else if( response.error === 2 )
				{
					let alert = this.alertCtrl.create(
					{
						title: this.translateService.translate( "ERROR.TITLE" ),
						subTitle: this.translateService.translate( response.translation ),
						buttons: [
						{
							text: this.translateService.translate( "ERROR.CANCEL" )
						},
						{
							text: this.translateService.translate( "ERROR.OK" ),
							handler: () => 
							{
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
	}
}