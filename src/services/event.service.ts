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
	cityId: number;

	constructor( event: any )
	{
		this.id = event.id;
		this.name = event.name;
		this.type = event.type;
		this.startDateTime = event.startDateTime;
		this.finishDateTime = event.finishDateTime;
		this.latitude = event.latitude;
		this.longitude = event.longitude;
		this.cityId = event.cityId;
	}
}

@Injectable()
export class EventService
{
	private eventsURL = "http://192.168.0.11:8000/api/events/events";
	private headers = new Headers( { "Content-Type": "application/json" } );
	cityId: number;
	events: Event[];
	eventsFilter: Event[];

	constructor( private http: Http ){}

	private handleError( error: any ): Promise<any>
	{
		console.error( "An error occurred", error );
		return Promise.reject( error.message || error );
	}

	getEvents( position ): Promise<any>
	{
		let url = `${this.eventsURL}?latitude=${position.latitude}&longitude=${position.longitude}`;

		return this.http.get( url, { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}
}