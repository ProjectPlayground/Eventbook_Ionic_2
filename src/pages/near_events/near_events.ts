import { Component } from "@angular/core";

import { NavController, Platform } from "ionic-angular";
import { Geolocation, GoogleMapsEvent, GoogleMapsLatLng, GoogleMap } from "ionic-native";

@Component(
{
	selector: "page-near",
	templateUrl: "near_events.html"
} )

export class NearEventsPage
{
	map: any;

	constructor( public navCtrl: NavController, private platform: Platform )
	{
		this.platform.ready().then( () => {
			this.getPosition();
		} );
	}

	loadMap( coordinate: any[] )
	{
		let longitude = coordinate[0]["longitude"];
		let latitude = coordinate[0]["latitude"];
		
		let location = new GoogleMapsLatLng( latitude, longitude );
		this.map = new GoogleMap( "map", {
			"backgroundColor": "white",
			"controls": {
				"compass": true,
				"myLocationButton": true,
				"indoorPicker": true,
				"zoom": true,
			},
			"gestures": {
				"scroll": true,
				"tilt": true,
				"rotate": true,
				"zoom": true
			},
			"camera": {
				"latLng": location,
				"tilt": 30,
				"zoom": 13,
				"bearing": 50
			}
  		} );
		
		this.map.on( GoogleMapsEvent.MAP_READY ).subscribe( () => {
			console.log( "Map is ready!" );
		} );
	}

	getPosition(): any
	{
		Geolocation.getCurrentPosition().then( response => {
			let coordinate = [{
				"longitude": response.coords.longitude,
				"latitude": response.coords.latitude
			}];
			
			this.loadMap( coordinate );
		} );
	}
}
