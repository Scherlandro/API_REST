import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechamentoCaixaComponent } from './fechamento-caixa.component';

describe('FechamentoCaixaComponent', () => {
  let component: FechamentoCaixaComponent;
  let fixture: ComponentFixture<FechamentoCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FechamentoCaixaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FechamentoCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
