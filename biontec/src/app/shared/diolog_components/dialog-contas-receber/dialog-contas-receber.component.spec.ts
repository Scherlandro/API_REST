import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContasReceberComponent } from './dialog-contas-receber.component';

describe('DialogContasReceberComponent', () => {
  let component: DialogContasReceberComponent;
  let fixture: ComponentFixture<DialogContasReceberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContasReceberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogContasReceberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
