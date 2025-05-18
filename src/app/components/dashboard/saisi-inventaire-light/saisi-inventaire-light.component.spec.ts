import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisiInventaireLightComponent } from './saisi-inventaire-light.component';

describe('SaisiInventaireLightComponent', () => {
  let component: SaisiInventaireLightComponent;
  let fixture: ComponentFixture<SaisiInventaireLightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisiInventaireLightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisiInventaireLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
