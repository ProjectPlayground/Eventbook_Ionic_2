import { Component } from "@angular/core";

import { Platform, NavParams, ViewController } from "ionic-angular";

import { EventService } from "../../services/event.service";

@Component(
{
	selector: "page-filter",
	templateUrl: "filter_options.html"
} )

export class FilterPage
{
	eventDate: string = new Date().toISOString();
	distance: number = 1;

	typeOptions = [{
		label: "Concert",
		value: "CO",
		filter: true,
	},
	{
		label: "Sport",
		value: "SP",
		filter: true,
	},
	{
		label: "Cinema",
		value: "CI",
		filter: true,
	},
	{
		label: "Theater",
		value: "TH",
		filter: true,
	},
	{
		label: "Programming",
		value: "PR",
		filter: true,
	},
	{
		label: "Other",
		value: "OT",
		filter: true,
	}];

	constructor( private platform: Platform, public viewCtrl: ViewController,
		private eventService: EventService )
	{}

	dismiss()
	{
		let types = {};
		for( let i = 0; i < this.typeOptions.length; ++i )
			types[this.typeOptions[i].value] = this.typeOptions[i].filter;

		let events = [];
		for( let i = 0; i < this.eventService.events.length; ++i )
			events.push( this.eventService.events[i] );
		for( let i = 0; i < events.length; ++i )
			if( !types[events[i].type] )
			{
				events.splice( i, 1 );
				--i;
			}

		this.viewCtrl.dismiss( events );
	}
}