import { Component } from "@angular/core";

import { NearEventsPage } from "../near_events/near_events";
import { FeaturedEventsPage } from "../featured_events/featured_events";
import { AccountPage } from "../account/account";

@Component(
{
	templateUrl: "tabs.html"
} )

export class TabsPage
{
	// this tells the tabs component which Pages
	// should be each tab's root Page
	tab1Root: any = NearEventsPage;
	tab2Root: any = FeaturedEventsPage;
	tab3Root: any = AccountPage;

	constructor()
	{

	}
}
