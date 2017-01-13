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
	private eventDate: string;
	private distance: number;
	private typeOptions: Array<any> = [];
	private filterOptions: any;

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
		this.viewCtrl.dismiss( { filterOptions: this.filterOptions, typeOptions: this.typeOptions, distance: this.distance, date: this.eventDate } );
	}
}