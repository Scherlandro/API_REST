import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPixComponent } from './dialog-pix.component';

describe('DialogPixComponent', () => {
  let component: DialogPixComponent;
  let fixture: ComponentFixture<DialogPixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
