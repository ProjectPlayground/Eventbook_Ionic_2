import { Component } from "@angular/core";
import { App, Platform, NavController, AlertController } from "ionic-angular";

import { Event, EventService } from "../../services/event.service";
import { TranslateServiceLocal } from "../../services/translate.service";
import { LoginPage } from "../login/login";

@Component(
{
	selector: "page-featured",
	templateUrl: "featured_events.html"
} )

export class FeaturedEventsPage
{
	private events: Array<Event> = [];
	
	constructor( private app: App, public navCtrl: NavController, 
		private platform: Platform, private alertCtrl: AlertController, 
		private eventService: EventService, private translateService: TranslateServiceLocal )
	{
		this.platform.ready().then( () => 
		{
			this.events = this.eventService.getLocalEvents();
		} );
	}

	public logout(): void
	{
		let alert = this.alertCtrl.create(
		{
			title: this.translateService.translate( "INFO.LOGOUT" ),
			subTitle: this.translateService.translate( "INFO.LOGOUT_MESSAGE" ),
			buttons: [
			{
				text: this.translateService.translate( "INFO.CANCEL" )
			},
			{
				text: this.translateService.translate( "INFO.OK" ),
				handler: () => 
				{
					this.app.getRootNav().setRoot( LoginPage );
				}
			}]
		} );
		alert.present();
	}
}
