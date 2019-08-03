import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class AboutPriceComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello About');
  }

}
