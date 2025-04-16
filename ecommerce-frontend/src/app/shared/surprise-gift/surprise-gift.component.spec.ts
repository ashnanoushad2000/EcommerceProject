import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurpriseGiftComponent } from './surprise-gift.component';

describe('SurpriseGiftComponent', () => {
  let component: SurpriseGiftComponent;
  let fixture: ComponentFixture<SurpriseGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurpriseGiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurpriseGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
