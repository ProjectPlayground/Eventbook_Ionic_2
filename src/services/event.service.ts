import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

export class Event
{
	id: number;
	name: string;
	type: string;
	startDateTime: Date;
	finishDateTime: Date;
	latitude: number;
	longitude: number;

	constructor( id: number, name: string, type: string, startDateTime: Date, finishDateTime: Date,	latitude: number, longitude: number )
	{
		this.id = id;
		this.name = name;
		this.type = type;
		this.startDateTime = startDateTime;
		this.finishDateTime = finishDateTime;
		this.latitude = latitude;
		this.longitude = longitude;
	}
}