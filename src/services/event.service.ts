import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

export class Event
{
	private id: number;
	private name: string;
	private type: string;
	private description: string;
	private startDateTime: Date;
	private finishDateTime: Date;
	private latitude: number;
	private longitude: number;
	private cityId: number;

	constructor( event: any )
	{
		this.id = event.id;
		this.name = event.name;
		this.type = event.type;
		this.description = event.description;
		this.startDateTime = event.startDateTime;
		this.finishDateTime = event.finishDateTime;
		this.latitude = event.latitude;
		this.longitude = event.longitude;
		this.cityId = event.cityId;
	}

	public getId(): number
	{
		return this.id;
	}

	public getName(): string
	{
		return this.name;
	}

	public getType(): string
	{
		return this.type;
	}

	public getDescription(): string
	{
		return this.description;
	}

	public getStartDateTime(): Date
	{
		return this.startDateTime;
	}

	public getFinishDateTime(): Date
	{
		return this.finishDateTime;
	}

	public getLatitude(): number
	{
		return this.latitude;
	}

	public getLongitude(): number
	{
		return this.longitude;
	}

	public getCityId(): number
	{
		return this.cityId;
	}
}

@Injectable()
export class EventService
{
	private serverURL = "http://192.168.0.11:8000/";
	private eventsURL = this.serverURL + "api/events/events";
	private cityURL = this.serverURL + "api/events/city";
	private headers = new Headers( { "Content-Type": "application/json" } );
	private cityId: number;
	private city: string;
	private events: Event[];
	private eventsFilter: Event[];

	constructor( private http: Http )
	{

	}

	private handleError( error: any ): Promise<any>
	{
		console.error( "An error occurred", error );
		return Promise.reject( error.message || error );
	}

	public getEvents( position: any ): Promise<any>
	{
		let url = `${this.eventsURL}?latitude=${position.latitude}&longitude=${position.longitude}`;

		return this.http.get( url, { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public getCity( cityId: number ): Promise<any>
	{
		this.cityId = cityId;
		let url = `${this.cityURL}?id=${cityId}`;

		return this.http.get( url, { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public getLocalEvents(): Event[]
	{
		return this.events;
	}

	public getLocalEventsFilter(): Event[]
	{
		return this.eventsFilter;
	}

	public getLocalCity(): string
	{
		return this.city;
	}

	public setLocalEvents( events: Event[] ): void
	{
		this.events = events;
	}

	public setLocalEventsFilter( events: Event[] ): void
	{
		this.eventsFilter = events;
	}

	public setLocalCity( city: string ): void
	{
		this.city = city;
	}
}