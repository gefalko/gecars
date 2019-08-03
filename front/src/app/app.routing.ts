import { RouterModule, Routes } from '@angular/router';

import { AboutGecarComponent } from './about/gecar/gecar.component';
import { AboutPriceComponent } from './about/price/price.component';

const routes: Routes = [
  { path: '', component: AboutGecarComponent },
  { path: 'about', component: AboutPriceComponent}
];

export const routing = RouterModule.forRoot(routes);
