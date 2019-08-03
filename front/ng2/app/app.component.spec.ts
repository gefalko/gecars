import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

import { AboutGecarComponnet } from './about/gecar/aboutGecar.component';
import { AboutPricesComponnet } from './about/prices/aboutPrices.component';
import { AboutSitesComponnet } from './about/sites/aboutSites.component';

import { By } from '@angular/platform-browser';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            AppComponent,
            AboutGecarComponnet,
            AboutSitesComponnet,
            AboutPricesComponnet
        ],
    });
  });

  it('menu array size should be 3.', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let com = fixture.debugElement.componentInstance;
    expect(com.menu.length).toEqual(3);
  });
    
  it('should menu elements have names.', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let com = fixture.debugElement.componentInstance;

    expect(com.menu[0].name).toEqual('Apie Gecar');
    expect(com.menu[1].name).toEqual('Kainodara');
    expect(com.menu[2].name).toEqual('Skelbimų puslapiai');
  });

  it('Should about menu item be active by default', () => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        let com = fixture.debugElement.componentInstance;
        expect(com.menu[0].active).toEqual(true);
        expect(com.menu[1].active).not.toBeDefined(); 
        expect(com.menu[2].active).not.toBeDefined(); 
   });  

    it('Should exist menu items  elements in document', () => { 
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const menuEl = fixture.debugElement.queryAll(By.css('ul#sub-menu li'));
        expect(menuEl.length).toBe(3);
        expect(menuEl[0].nativeElement.innerHTML).toBe('Apie Gecar');
    });

    it('should activate element after click', () => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const menuEl = fixture.debugElement.queryAll(By.css('ul#sub-menu li'));
        menuEl[1].nativeElement.click();
        fixture.detectChanges();
        expect(fixture.debugElement.componentInstance.menu[0].active).toEqual(false);
        expect(fixture.debugElement.componentInstance.menu[1].active).toEqual(true);
    });

    it('should hide #pricing and  #sources by default', () =>{
        
        let fixture = TestBed.createComponent(AppComponent);
        
        fixture.detectChanges();
        
        const aboutEl = fixture.debugElement.query(By.css('about-gecar')).nativeElement;
        const pricingEl = fixture.debugElement.query(By.css('about-prices'));
        const sitesEl = fixture.debugElement.query(By.css('about-sites'));

        expect(pricingEl).toBeNull();
        expect(sitesEl).toBeNull();
        expect(aboutEl).not.toBe(null);
    });

    it("should hide about-gecar element when user click on about-prices element", () => {

        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const menuEl = fixture.debugElement.queryAll(By.css('ul#sub-menu li'));

        menuEl[1].nativeElement.click(); // click on about prices
        fixture.detectChanges();


        const aboutEl = fixture.debugElement.query(By.css('about-gecar'));
        const pricingEl = fixture.debugElement.query(By.css('about-prices')).nativeElement;
        const sitesEl = fixture.debugElement.query(By.css('about-sites'));

        expect(sitesEl).toBeNull();
        expect(aboutEl).toBeNull();
        expect(pricingEl).not.toBe(null);
    });

});

