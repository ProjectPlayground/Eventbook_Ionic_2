import { Component } from "@angular/core";

import { Platform, NavParams, ViewController } from "ionic-angular";


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
		filter: true,
	},
	{
		label: "Sport",
		filter: true,
	},
	{
		label: "Cinema",
		filter: true,
	},
	{
		label: "Theater",
		filter: true,
	},
	{
		label: "Programming",
		filter: true,
	},
	{
		label: "Other",
		filter: true,
	}];

	constructor( private platform: Platform, public viewCtrl: ViewController )
	{}

	dismiss()
	{
		console.log( this.typeOptions );
		console.log( this.distance );
		console.log( new Date( this.eventDate ) );
		this.viewCtrl.dismiss();
	}
}