import { Component } from "@angular/core";

import { NavController, Platform } from "ionic-angular";
import { Geolocation, GoogleMapsEvent, GoogleMapsLatLng, GoogleMap, GoogleMapsMarkerOptions, GoogleMapsMarker } from "ionic-native";

import { Event } from "../../services/event.service";

@Component(
{
	selector: "page-near",
	templateUrl: "near_events.html"
} )

export class NearEventsPage
{
	map: GoogleMap;
	latLng: any;

	constructor( public navCtrl: NavController, private platform: Platform )
	{
		this.platform.ready().then( () => {
			this.getPosition();
		} );
	}

	setMarker( coordinate: any, event: Event )
	{
		let markerOptions: GoogleMapsMarkerOptions = {
			position: coordinate,
			title: "Mi posición"
		};

		this.map.addMarker( markerOptions ).then( ( marker: GoogleMapsMarker ) => {
			marker.showInfoWindow();
		} );
	}

	loadMap()
	{
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
				"latLng": this.latLng,
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
		Geolocation.getCurrentPosition().then( position => {
			let latitude = position.coords.latitude;
			let longitude = position.coords.longitude;

			this.latLng = new GoogleMapsLatLng( latitude, longitude );
			
			this.loadMap();
		} );
	}
}
