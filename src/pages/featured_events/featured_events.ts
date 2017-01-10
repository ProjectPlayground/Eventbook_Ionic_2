import { Component } from "@angular/core";
import { Platform, NavController } from "ionic-angular";

import { Event, EventService } from "../../services/event.service";

@Component(
{
	selector: "page-featured",
	templateUrl: "featured_events.html"
} )

export class FeaturedEventsPage
{
	private events: Array<Event>;
	
	constructor( public navCtrl: NavController, private platform: Platform,
		private eventService: EventService )
	{
		this.platform.ready().then( () => 
		{
			this.events = this.eventService.getLocalEvents();
		} );
	}
}
