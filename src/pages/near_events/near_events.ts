import { Component } from "@angular/core";
import { NavController, Platform, ModalController, LoadingController, AlertController } from "ionic-angular";
import { Geolocation } from "ionic-native";

import { Event, EventService } from "../../services/event.service";
import { TranslateServiceLocal } from "../../services/translate.service";
import { FilterPage } from "../filter_options/filter_options";

@Component(
{
	selector: "page-near",
	templateUrl: "near_events.html"
} )

export class NearEventsPage
{
	map: google.maps.Map;
	markers: Array<google.maps.Marker> = [];
	currentPosition: google.maps.LatLng;
	currentPositionMarker: google.maps.Marker;
	modal: any;

	filterOptions = { types: true, distance: true, date: true };
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

	constructor( public navCtrl: NavController, private platform: Platform,
		private modalCtrl: ModalController, private loadingCtrl: LoadingController, 
		private alertCtrl: AlertController, private eventService: EventService, 
		private translateService: TranslateServiceLocal )
	{
		this.platform.ready().then( () => 
		{
			this.getPosition();
		} );
	}

	public loadMap(): void
	{
		let mapElement = document.getElementById( "map" );

		this.map = new google.maps.Map( mapElement,
		{
			center: this.currentPosition,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			tilt: 30
		} );

		this.currentPositionMarker = new google.maps.Marker(
		{
			position: this.currentPosition,
			icon: "assets/images/blue-circle.png",
			map: this.map
		} );

		google.maps.event.addListenerOnce( this.map, "idle", () => 
		{
			mapElement.classList.add( "show-map" );
			google.maps.event.trigger( mapElement, "resize" );

			let currentPosition = { latitude: this.currentPosition.lat(), longitude: this.currentPosition.lng() };
			this.eventService.getEvents( currentPosition ).then( response => 
			{
				let events = new Array();

				for( let i = 0; i < response.events.length; ++i )
				{
					let event = new Event( response.events[i] );
					events.push( event );
					
					let position = new google.maps.LatLng( event.getLatitude(), event.getLongitude() );
					this.setMarker( position );
				}

				this.setMapOnMarkers( this.map );
				this.setInfoWindowOnMarkers();

				this.eventService.setLocalEvents( events );
				this.eventService.setLocalEventsFilter( events );
			} ).catch( response =>
			{
				let alert = this.alertCtrl.create(
				{
					title: this.translateService.translate( "ERROR.TITLE" ),
					subTitle: this.translateService.translate( "ERROR.CONNECTION" ),
					buttons: [this.translateService.translate( "ERROR.OK" )]
				} );
				alert.present();
			} );
		} ); 
	}

	private drawMarkers(): void
	{
		this.setMapOnMarkers( null );
		this.markers = new Array();

		let events = this.eventService.getLocalEventsFilter();
		for( let i = 0; i < events.length; ++i ) 
		{
			let position = new google.maps.LatLng( events[i].getLatitude(), events[i].getLongitude() );
			this.setMarker( position );
		}

		this.setMapOnMarkers( this.map );
		this.setInfoWindowOnMarkers();
	}

	private setMarker( position ): void
	{
		let marker = new google.maps.Marker(
		{
			animation: google.maps.Animation.DROP,
			position: position
		} );

		this.markers.push( marker );
	}

	private setMapOnMarkers( map: google.maps.Map ): void
	{
		for( let i = 0; i < this.markers.length; ++i )
			this.markers[i].setMap( map );
	}

	private setInfoWindowOnMarkers(): void
	{
		for( let i = 0; i < this.markers.length; ++i )
		{
			let content = "<h4>Information!</h4>";          
 
			this.addInfoWindow( this.markers[i], content );
		}
	}

	private addInfoWindow( marker, content ): void
	{
		let infoWindow = new google.maps.InfoWindow(
		{
			content: content
		} );

		google.maps.event.addListener( marker, "click", () => 
		{
			infoWindow.open( this.map, marker );
		} );
	}

	private isWithinRadius( latitude: number, longitude: number ): boolean
	{
		let eventPosition = new google.maps.LatLng( latitude, longitude );
		let distance = google.maps.geometry.spherical.computeDistanceBetween( this.currentPosition, eventPosition );
		if( distance < this.distance * 1000 )
			return true;
		
		return false;
	}

	private isSameDay( eventDate: Date ): boolean
	{
		let filterDate = new Date( this.eventDate );
		if( filterDate.getDate() + 1 === eventDate.getDate() )
			if( filterDate.getMonth() === eventDate.getMonth() )
				if( filterDate.getFullYear() === eventDate.getFullYear() )
					return true;
		
		return false;
	}

	public openFilterOptions(): void
	{
		this.modal = this.modalCtrl.create( FilterPage, { filterOptions: this.filterOptions, typeOptions: this.typeOptions, distance: this.distance, date: this.eventDate } );
		this.modal.onDidDismiss( data => 
		{
			let loading = this.loadingCtrl.create(
			{
				content: this.translateService.translate( "NEAR_EVENTS.FILTERING_EVENTS" )
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

				let localEvents = this.eventService.getLocalEvents();
				for( let i = 0; i < localEvents.length; ++i )
					if( types[localEvents[i].getType()] )
						events.push( localEvents[i] );
			}
			if( this.filterOptions.distance )
			{
				if( firstTime )
				{
					let localEvents = this.eventService.getLocalEvents();
					for( let i = 0; i < localEvents.length; ++i )
						if( this.isWithinRadius( localEvents[i].getLatitude(), localEvents[i].getLongitude() ) )
							events.push( localEvents[i] );
				}
				else
				{
					for( let i = 0; i < events.length; ++i )
						if( !this.isWithinRadius( events[i].getLatitude(), events[i].getLongitude() ) )
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
					let localEvents = this.eventService.getLocalEvents();
					for( let i = 0; i < localEvents.length; ++i )
						if( this.isSameDay( new Date( localEvents[i].getStartDateTime() ) ) )
							events.push( localEvents[i] );
				}
				else
				{
					for( let i = 0; i < events.length; ++i )
						if( !this.isSameDay( new Date( events[i].getStartDateTime() ) ) )
						{
							events.splice( i, 1 );
							--i;
						}
				}
			}
			
			this.eventService.setLocalEventsFilter( events );
			this.drawMarkers();

			loading.dismiss();
		} );
		this.modal.present();
	}

	public getPosition(): void
	{
		Geolocation.getCurrentPosition().then( position => 
		{
			let latitude = position.coords.latitude;
			let longitude = position.coords.longitude;

			this.currentPosition = new google.maps.LatLng( latitude, longitude );
			
			this.loadMap();
		} ).catch( response => 
		{
			let alert = this.alertCtrl.create(
			{
				title: this.translateService.translate( "ERROR.TITLE" ),
				subTitle: this.translateService.translate( "ERROR.CONNECTION" ),
				buttons: [this.translateService.translate( "ERROR.OK" )]
			} );
			alert.present();
		} );
	}
}
