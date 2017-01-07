import { Component } from "@angular/core";

import { Platform, NavParams, ViewController } from "ionic-angular";


@Component(
{
	selector: "page-filter",
	templateUrl: "filter_options.html"
} )

export class FilterPage
{
	constructor( private platform: Platform, public viewCtrl: ViewController )
	{
		
	}

	dismiss()
	{
		this.viewCtrl.dismiss();
	}
}