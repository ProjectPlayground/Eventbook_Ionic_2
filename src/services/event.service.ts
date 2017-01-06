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

@Injectable()
export class EventService
{
	private eventsURL = "http://192.168.0.11:8000/api/events/events";
	private headers = new Headers( { "Content-Type": "application/json" } );
	city: string;

	constructor( private http: Http ){}

	private handleError( error: any ): Promise<any>
	{
		console.error( "An error occurred", error );
		return Promise.reject( error.message || error );
	}

	getEvents( position ): Promise<any>
	{
		let url = `${this.eventsURL}?latitude=${position.latitude}&longitude=${position.longitude}`;
		console.log( url );

		return this.http.get( url, { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}
}