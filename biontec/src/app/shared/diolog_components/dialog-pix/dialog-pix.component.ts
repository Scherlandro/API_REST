import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {iPagamento} from "../../../interfaces/pagamento";
import {PagamentoService} from "../../../services/pagmentos.service";
import {NotificationMgsService} from "../../../services/notification-mgs.service";
import {EfiChargeRequest} from "../../../interfaces/efi-charge-request";


@Component({
  selector: 'app-dialog-pix',
  templateUrl: './dialog-pix.component.html',
  styleUrls: ['./dialog-pix.component.css']
})
export class DialogPixComponent {


  pagamento!: EfiChargeRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EfiChargeRequest,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPixComponent>,
    public pagamentoService: PagamentoService,
    public notificationMsg: NotificationMgsService
  ) {
    this.pagamento = data;
  }

  ngOnInit() {
    this.verificarStatusPagamento();
  }

  verificarStatusPagamento() {
    // Checa a cada 5 segundos se o status no banco mudou
    const interval = setInterval(() => {
      this.pagamentoService.buscarStatusNoBanco(this.data.idPagamento).subscribe(res => {
        if (res.status === 1) { // 1 = Confirmado
          clearInterval(interval);
          this.dialogRef.close(true);
          this.notificationMsg.success("Pagamento recebido com sucesso!");
        }
      });
    }, 5000);
  }

}
