import { Component } from "@angular/core";

import { NavController, Platform, ModalController } from "ionic-angular";
import { Geolocation } from "ionic-native";

import { Event, EventService } from "../../services/event.service";
import { FilterPage } from "../filter_options/filter_options";

@Component(
{
	selector: "page-near",
	templateUrl: "near_events.html"
} )

export class NearEventsPage
{
	map: any;
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
		/*let markerOptions: GoogleMapsMarkerOptions = {
			position: position,
			title: "Mi posición"
		};

		this.map.addMarker( markerOptions ).then( ( marker: GoogleMapsMarker ) => {
			marker.showInfoWindow();
		} );*/
	}

	loadMap()
	{
		let mapDiv = document.getElementById( "map" );

		this.map = new google.maps.Map( mapDiv,
		{
			center: { lat: this.latLng.latitude, lng: this.latLng.longitude },
			zoom: 13
    	} );

    	google.maps.event.addListenerOnce( this.map, "idle", () => {
			mapDiv.classList.add( "show-map" );
			google.maps.event.trigger( mapDiv, "resize" );
		} );
	}

	getPosition(): any
	{
		Geolocation.getCurrentPosition().then( position => {
			let latitude = position.coords.latitude;
			let longitude = position.coords.longitude;

			this.latLng = { latitude: latitude, longitude: longitude };
			
			this.loadMap();
		} );
	}
}
