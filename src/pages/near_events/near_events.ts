import { Component, ViewChild, ElementRef } from "@angular/core";
import { TranslateService } from "ng2-translate";
import { NavController, Platform, ModalController, LoadingController } from "ionic-angular";
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
	currentPosition: any;
	modal: any;

	eventDate: string = new Date().toISOString();
	distance: number = 10;
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
		public modalCtrl: ModalController, private eventService: EventService,
		public loadingCtrl: LoadingController, private translateService: TranslateService )
	{
		this.platform.ready().then( () => {
			this.getPosition();
		} );
	}

	private isWithinRadius( latitude: number, longitude: number )
	{
		let eventPosition = new google.maps.LatLng( latitude, longitude );
		let distance = google.maps.geometry.spherical.computeDistanceBetween( this.currentPosition, eventPosition );
		if( distance < this.distance * 1000 )
			return true;
		return false;
	}

	private isSameDay( eventDate: Date )
	{
		let filterDate = new Date( this.eventDate );
		if( filterDate.getDate() + 1 === eventDate.getDate() )
			if( filterDate.getMonth() === eventDate.getMonth() )
				if( filterDate.getFullYear() === eventDate.getFullYear() )
					return true;
		return false;
	}

	private translateMessage( messageTranslate: string )
	{
		let message: string;
		this.translateService.get( messageTranslate ).subscribe( value => 
		{
			message = value;
		} );

		return message;
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
			let loading = this.loadingCtrl.create(
			{
				content: this.translateMessage( "NEAR_EVENTS.FILTERING_EVENTS" )
			} );
			loading.present();

			this.typeOptions = data.typeOptions;
			this.distance = data.distance;
			this.eventDate = data.date;
			this.filterOptions = data.filterOptions;

			let firstTime = true;
			let events = [];
			if( this.filterOptions.types )
			{
				firstTime = false;
				let types = {};
				for( let i = 0; i < this.typeOptions.length; ++i )
					types[this.typeOptions[i].value] = this.typeOptions[i].filter;

				for( let i = 0; i < this.eventService.events.length; ++i )
					if( types[this.eventService.events[i].type] )
						events.push( this.eventService.events[i] );
			}
			if( this.filterOptions.distance )
			{
				if( firstTime )
				{
					for( let i = 0; i < this.eventService.events.length; ++i )
						if( this.isWithinRadius( this.eventService.events[i].latitude, this.eventService.events[i].longitude ) )
							events.push( this.eventService.events[i] );
				}
				else
				{
					for( let i = 0; i < events.length; ++i )
						if( !this.isWithinRadius( events[i].latitude, events[i].longitude ) )
						{
							events.splice( i, 1 );
							--i;
						}
				}

				firstTime = false;
			}
			if( this.filterOptions.date )
			{
				if( firstTime )
				{
					for( let i = 0; i < this.eventService.events.length; ++i )
						if( this.isSameDay( new Date( this.eventService.events[i].startDateTime ) ) )
							events.push( this.eventService.events[i] );
				}
				else
				{
					for( let i = 0; i < events.length; ++i )
						if( !this.isSameDay( new Date( events[i].startDateTime ) ) )
						{
							events.splice( i, 1 );
							--i;
						}
				}
			}
			
			this.eventService.eventsFilter = events;
			this.drawMarkers();

			loading.dismiss();
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
			center: this.currentPosition,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			tilt: 30
		} );

		new google.maps.Marker(
		{
			position: this.currentPosition,
			icon: "assets/images/blue-circle.png",
			map: this.map
		} );

		google.maps.event.addListenerOnce( this.map, "idle", () => { 
			mapElement.classList.add( "show-map" );
			google.maps.event.trigger( mapElement, "resize" );

			let positionCoords = { latitude: this.currentPosition.lat(), longitude: this.currentPosition.lng() };
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

			this.currentPosition = new google.maps.LatLng( latitude, longitude );
			
			this.loadMap();
		} ).catch( response => {

		} );
	}
}
