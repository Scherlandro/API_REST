import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogParcelamentosComponent } from './dialog-parcelamentos.component';

describe('DialogParcelamentosComponent', () => {
  let component: DialogParcelamentosComponent;
  let fixture: ComponentFixture<DialogParcelamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogParcelamentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogParcelamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
