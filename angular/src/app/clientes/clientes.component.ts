import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/Cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  constructor(private clienteService: ClientesService, private router: Router, public dialog: MatDialog) { }
  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  clientes: Cliente[] = []
  search !: ''
  pageSize: number = 5;
  idToRemove!: number;
  pageIndex: number = 0;
  length: number = 0;

  ngOnInit() {
    this.getAllClientes()
  }

  getAllClientes() {
    this.clienteService.getclientes('', this.pageSize, this.pageIndex).subscribe(res => {
      this.clientes = res.items;
      this.length = res.totalItems;
    })
  }

  editarCliente(id: number) {
    this.router.navigate([`clientes/${id}`])
  }

  searchCliente(value: string) {
    if (value.length == 0)
      this.getAllClientes();

    if (value.length >= 3)
      this.clienteService.getclientes(this.search, this.pageSize, 0).subscribe(res => {
        this.clientes = res.items
        this.length = res.totalItems
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.clienteService.getclientes('', this.pageSize, this.pageIndex).subscribe(res => {
      this.clientes = res.items;
      this.length = res.totalItems;
    })

    // Atualize seus dados com base no tamanho da página e no índice da página.
    // Você pode fazer uma chamada à API ou ajustar sua fonte de dados aqui.
  }

  deletarCliente(id: number){
      this.idToRemove = id;
      const dialogRef = this.dialog.open(ConfirmationAlertComponent,
        {
          width: '450px',
          height: '350px',
          hasBackdrop: false,
          data: { mensagem: "Tem certeza de que deseja excluir este item?", cor: '', subMensagem: 'Essa ação não pode ser desfeita.' }
        })
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result == 'deletar') {
          this.deletar()
  
        }
      })
    }

    deletar() {
      this.clienteService.deletecliente(this.idToRemove).subscribe(res => {
        this.getAllClientes();
      }
      );
    }
}
