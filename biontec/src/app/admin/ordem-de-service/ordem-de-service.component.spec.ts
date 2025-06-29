import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemDeServiceComponent } from './ordem-de-service.component';

describe('ListOrdemDeServiceComponent', () => {
  let component: OrdemDeServiceComponent;
  let fixture: ComponentFixture<OrdemDeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdemDeServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdemDeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
