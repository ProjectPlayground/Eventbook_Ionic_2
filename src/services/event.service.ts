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
		this.startDateTime = new Date( event.startDateTime );
		this.finishDateTime = new Date( event.finishDateTime );
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
		return this.description.substring( 0, 101 ) + "...";
	}

	public getStartDateTime(): Date
	{
		return this.startDateTime;
	}

	public getFinishDateTime(): Date
	{
		return this.finishDateTime;
	}

	public getShowStartDateTime(): string
	{
		let day = this.startDateTime.getDate().toString();
		let month = ( this.startDateTime.getMonth() + 1 ).toString();
		let year = this.startDateTime.getFullYear().toString();
		let hour = this.startDateTime.getHours().toString();
		let minutes = this.startDateTime.getMinutes().toString();
		if( this.startDateTime.getMinutes() === 0 )
			minutes += "0";
		return day + "/" + month + "/" + year + " - " + hour + ":" + minutes;
	}

	public getShowFinishDateTime(): string
	{
		let day = this.finishDateTime.getDate().toString();
		let month = ( this.finishDateTime.getMonth() + 1 ).toString();
		let year = this.finishDateTime.getFullYear().toString();
		let hour = this.finishDateTime.getHours().toString();
		let minutes = this.finishDateTime.getMinutes().toString();
		if( this.finishDateTime.getMinutes() === 0 )
			minutes += "0";
		return day + "/" + month + "/" + year + " - " + hour + ":" + minutes;
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
	private serverURL = "https://apieventbook.herokuapp.com/";
	private eventsURL = this.serverURL + "api/events/events";
	private cityURL = this.serverURL + "api/events/city";
	private headers = new Headers( { "Content-Type": "application/json" } );
	private cityId: number;
	private city: string;
	private events: Array<Event> = [];
	private eventsFilter: Array<Event> = [];

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