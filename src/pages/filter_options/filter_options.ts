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
	eventDate: string;
	distance: number;
	typeOptions = new Array();
	filterOptions: any;

	constructor( private platform: Platform, public viewCtrl: ViewController,
		private params: NavParams, private eventService: EventService )
	{
		this.filterOptions = params.get( "filterOptions" );
		this.typeOptions = params.get( "typeOptions" );
		this.distance = params.get( "distance" );
		this.eventDate = params.get( "date" );
	}

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

		this.viewCtrl.dismiss( { filterOptions: this.filterOptions, typeOptions: this.typeOptions, distance: this.distance, date: this.eventDate, events: events } );
	}
}