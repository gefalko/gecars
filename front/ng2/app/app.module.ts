import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { AboutGecarComponnet } from './about/gecar/aboutGecar.component';
import { AboutPricesComponnet } from './about/prices/aboutPrices.component';
import { AboutSitesComponnet } from './about/sites/aboutSites.component';


@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
      AppComponent,
      AboutGecarComponnet,
      AboutPricesComponnet,
      AboutSitesComponnet
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

    constructor(public appRef: ApplicationRef) {}
  
}

