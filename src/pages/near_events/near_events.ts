import { Component, ViewChild, ElementRef } from "@angular/core";

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

	addInfoWindow( marker, content )
	{
		let infoWindow = new google.maps.InfoWindow(
		{
			content: content
		} );

		google.maps.event.addListener( marker, "click", () => {
			infoWindow.open( this.map, marker );
		} );
	}

	setMarker( position )
	{
		let marker = new google.maps.Marker(
		{
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: position
		} );
 
		let content = "<h4>Information!</h4>";          
 
		this.addInfoWindow( marker, content );
	}

	loadMap()
	{
		let mapElement = document.getElementById( "map" );

		this.map = new google.maps.Map( mapElement,
		{
			center: this.latLng,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			tilt: 30
		} );

		let marker = new google.maps.Marker(
		{
			position: this.latLng,
			icon: "assets/images/blue-circle.png",
			map: this.map
		} );

		google.maps.event.addListenerOnce( this.map, "idle", () => { 
			mapElement.classList.add( "show-map" );
			google.maps.event.trigger( mapElement, "resize" );

			let positionCoords = { latitude: this.latLng.lat(), longitude: this.latLng.lng() };
			this.eventService.getEvents( positionCoords ).then( response => { 
				for( let i = 0; i < response.events.length; ++i ) 
				{ 
					let position = new google.maps.LatLng( response.events[i].latitude, response.events[i].longitude ); 
					this.setMarker( position ); 
				} 
			} ).catch( response =>
			{

			} );
		} ); 
	}

	getPosition(): any
	{
		Geolocation.getCurrentPosition().then( position => {
			let latitude = position.coords.latitude;
			let longitude = position.coords.longitude;

			this.latLng = new google.maps.LatLng( latitude, longitude );
			
			this.loadMap();
		} ).catch( response => {

		} );
	}
}
