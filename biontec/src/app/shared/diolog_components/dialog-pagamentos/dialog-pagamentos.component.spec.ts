import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPagamentosComponent } from './dialog-pagamentos.component';

describe('DialogPagamentosComponent', () => {
  let component: DialogPagamentosComponent;
  let fixture: ComponentFixture<DialogPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPagamentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
