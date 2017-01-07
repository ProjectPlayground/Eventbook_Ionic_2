import { NgModule, ErrorHandler } from "@angular/core";
import { Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";

import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { SigninPage } from "../pages/signin/signin";
import { FeaturedEventsPage } from "../pages/featured_events/featured_events";
import { AccountPage } from "../pages/account/account";
import { NearEventsPage } from "../pages/near_events/near_events";
import { TabsPage } from "../pages/tabs/tabs";

import { UserService } from "../services/user.service";
import { EventService } from "../services/event.service";

export function createTranslateLoader( http: Http )
{
	return new TranslateStaticLoader( http, "assets/i18n", ".json" );
}

@NgModule(
{
	declarations: [
		MyApp,
		LoginPage,
		SigninPage,
		NearEventsPage,
		FeaturedEventsPage,
		AccountPage,
		TabsPage
	],
	imports: [
		TranslateModule.forRoot(
		{
			provide: TranslateLoader,
			useFactory: ( createTranslateLoader ),
			deps: [Http]
		} ),
		IonicModule.forRoot( MyApp )
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		SigninPage,
		NearEventsPage,
		FeaturedEventsPage,
		AccountPage,
		TabsPage
	],
	providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, UserService, EventService]
} )

export class AppModule {}
