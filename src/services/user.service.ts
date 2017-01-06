import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { Event } from "./event.service";

export class User
{
	id: number;
	name: string;
	lastName: string;
	email: string;
	events: Event[];

	constructor( id: number, name: string, lastName: string, email: string, events: Event[] )
	{
		this.id = id;
		this.name = name;
		this.lastName = lastName;
		this.email = email;
		this.events = events;
	}
}

@Injectable()
export class UserService
{
	private loginURL = "http://192.168.0.11:8000/api/users/user";
	private signinURL = "http://192.168.0.11:8000/api/users/add-user";
	private headers = new Headers( { "Content-Type": "application/json" } );
	currentUser: User;

	constructor( private http: Http ){}

	private handleError( error: any ): Promise<any>
	{
		console.error( "An error occurred", error );
		return Promise.reject( error.message || error );
	}

	login( credentials ): Promise<any>
	{
		return this.http.post( this.loginURL, JSON.stringify( { email: credentials.email, password: credentials.password } ), { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	signin( credentials ): Promise<any>
	{
		return this.http.post( this.signinURL, JSON.stringify( { name: credentials.name, lastName: credentials.lastName, email: credentials.email, password: credentials.password } ), { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public getUserInfo() : User
	{
		return this.currentUser;
	}
}