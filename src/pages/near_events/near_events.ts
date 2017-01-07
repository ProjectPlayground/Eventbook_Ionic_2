import { Component } from "@angular/core";

import { NavController, Platform, ModalController } from "ionic-angular";
import { Geolocation, GoogleMapsEvent, GoogleMapsLatLng, GoogleMap, GoogleMapsMarkerOptions, GoogleMapsMarker } from "ionic-native";

import { Event, EventService } from "../../services/event.service";
import { FilterPage } from "../filter_options/filter_options";

@Component(
{
	selector: "page-near",
	templateUrl: "near_events.html"
} )

export class NearEventsPage
{
	map: GoogleMap;
	latLng: any;

	constructor( public navCtrl: NavController, private platform: Platform,
		public modalCtrl: ModalController, private eventService: EventService )
	{
		this.platform.ready().then( () => {
			this.getPosition();
		} );
	}

	openFilterOptions()
	{
		let modal = this.modalCtrl.create( FilterPage );
		modal.present();
	}

	setMarker( position: any )
	{
		let markerOptions: GoogleMapsMarkerOptions = {
			position: position,
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
			let positionCoords = { latitude: this.latLng.lat, longitude: this.latLng.lng };

			this.eventService.getEvents( positionCoords ).then( response => {
				for( let i = 0; i < response.events.length; ++i )
				{
					let position = new GoogleMapsLatLng( response.events[i].latitude, response.events[i].longitude );
					this.setMarker( position );
				}
			} );
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
