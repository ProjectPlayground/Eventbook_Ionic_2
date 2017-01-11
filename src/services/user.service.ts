import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { Event } from "./event.service";

export class User
{
	private id: number;
	private name: string;
	private lastName: string;
	private email: string;
	private events: Event[];

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
	private serverURL = "https://apieventbook.herokuapp.com/";
	private loginURL = this.serverURL + "api/users/user";
	private signinURL = this.serverURL + "api/users/add-user";
	private headers = new Headers( { "Content-Type": "application/json" } );
	private currentUser: User;

	constructor( private http: Http )
	{

	}

	private handleError( error: any ): Promise<any>
	{
		console.error( "An error occurred", error );
		return Promise.reject( error.message || error );
	}

	public login( credentials: any ): Promise<any>
	{
		return this.http.post( this.loginURL, JSON.stringify( { email: credentials.email, password: credentials.password } ), { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public signin( credentials: any ): Promise<any>
	{
		return this.http.post( this.signinURL, JSON.stringify( { name: credentials.name, lastName: credentials.lastName, email: credentials.email, password: credentials.password } ), { headers: this.headers } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public getUserInfo(): User
	{
		return this.currentUser;
	}

	public setUserInfo( user: User ): void
	{
		this.currentUser = user;
	}
}