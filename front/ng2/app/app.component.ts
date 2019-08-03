import { Component } from '@angular/core';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
})

export class AppComponent {
  
    title: string;
    
    menu : any[] = [
        { id:'about', name: 'Apie Gecar', active:true },
        { id:'pricing', name: 'Kainodara'}, 
        { id:'sources', name: 'Skelbimų puslapiai'}
    ]  

    constructor() {

    }

    changeTab(item: any){
        
        for(let mitem of this.menu){
            mitem.active = false;
        }

        item.active = true;

    }  
}

