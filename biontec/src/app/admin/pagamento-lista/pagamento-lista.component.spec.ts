import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoListaComponent } from './pagamento-lista.component';

describe('PagamentoListaComponent', () => {
  let component: PagamentoListaComponent;
  let fixture: ComponentFixture<PagamentoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagamentoListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
