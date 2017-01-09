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
	markers = new Array();
	latLng: any;
	modal: any;

	eventDate: string = new Date().toISOString();
	distance: number = 1;
	typeOptions = [{
		label: "Concert",
		icon: "musical-notes",
		value: "CO",
		filter: true,
	},
	{
		label: "Sport",
		icon: "bicycle",
		value: "SP",
		filter: true,
	},
	{
		label: "Cinema",
		icon: "film",
		value: "CI",
		filter: true,
	},
	{
		label: "Theater",
		icon: "body",
		value: "TH",
		filter: true,
	},
	{
		label: "Programming",
		icon: "code",
		value: "PR",
		filter: true,
	},
	{
		label: "Other",
		icon: "easel",
		value: "OT",
		filter: true,
	}];
	filterOptions = { types: true, distance: true, date: true };

	constructor( public navCtrl: NavController, private platform: Platform,
		public modalCtrl: ModalController, private eventService: EventService )
	{
		this.platform.ready().then( () => {
			this.getPosition();
		} );
	}

	drawMarkers()
	{
		this.setMapOnAll( null );
		this.markers = new Array();

		let events = this.eventService.eventsFilter;
		for( let i = 0; i < events.length; ++i ) 
		{
			let position = new google.maps.LatLng( events[i].latitude, events[i].longitude );
			this.setMarker( position );
		}

		this.setMapOnAll( this.map );
		this.setInfoWindowOnAll();
	}

	openFilterOptions()
	{
		this.modal = this.modalCtrl.create( FilterPage, { filterOptions: this.filterOptions, typeOptions: this.typeOptions, distance: this.distance, date: this.eventDate } );
		this.modal.onDidDismiss( data => {
			this.typeOptions = data.typeOptions;
			this.distance = data.distance;
			this.eventDate = data.date;
			this.filterOptions = data.filterOptions;
			
			this.eventService.eventsFilter = data.events;
			this.drawMarkers();
		} );
		this.modal.present();
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
			animation: google.maps.Animation.DROP,
			position: position
		} );

		this.markers.push( marker );
	}

	setInfoWindowOnAll()
	{
		for( let i = 0; i < this.markers.length; ++i )
		{
			let content = "<h4>Information!</h4>";          
 
			this.addInfoWindow( this.markers[i], content );
		}
	}

	setMapOnAll( map )
	{
		for( let i = 0; i < this.markers.length; ++i )
			this.markers[i].setMap( map );
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

		new google.maps.Marker(
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
				let events = new Array();

				for( let i = 0; i < response.events.length; ++i ) 
				{
					let event = new Event( response.events[i] );
					events.push( event );
					let position = new google.maps.LatLng( event.latitude, event.longitude );
					this.setMarker( position );
				}

				this.setMapOnAll( this.map );
				this.setInfoWindowOnAll();

				this.eventService.events = events;
				this.eventService.eventsFilter = events;
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
