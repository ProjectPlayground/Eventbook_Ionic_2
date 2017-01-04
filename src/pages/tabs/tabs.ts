import { Component } from '@angular/core';

import { HomePage } from '../near_events/near_events';
import { AboutPage } from '../featured_events/featured_events';
import { ContactPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  constructor() {

  }
}
