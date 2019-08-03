import { TestBed } from '@angular/core/testing';

import { AboutPriceComponent } from './price.component';

describe('About Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AboutPriceComponent]});
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(AboutPriceComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('About Works!');
  });

});
