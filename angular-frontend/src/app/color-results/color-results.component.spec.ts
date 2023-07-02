import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorResultsComponent } from './color-results.component';

describe('ColorResultsComponent', () => {
  let component: ColorResultsComponent;
  let fixture: ComponentFixture<ColorResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
