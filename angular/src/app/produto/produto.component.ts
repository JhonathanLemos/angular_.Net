import { Component, OnChanges, OnInit } from '@angular/core';
import { ProdutosService } from 'src/app/services/produtos.service';
import { FormularioComponent } from 'src/app/modais/formulario/formulario.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/Cliente';
import { Produto } from 'src/app/Produto';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
  idToRemove!: number;
  mensagemPersonalizada!: 'Teste';
  corPersonalizada!: 'primary';
  mostrarAlerta: boolean = false;
  produto!: Produto;
  search !: ''
  produtos: any[] = [];
  displayedColumns: string[] = ['id', 'nome', 'customerId', 'acoes'];
  pageSize: number = 1;
  pageIndex: number = 0;
  length: number = 0;

  constructor(private produtoService: ProdutosService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllProdutos();
    
  }


  abrirModal() {
    const dialogRef = this.dialog.open(FormularioComponent,
      {
        width: '600px',
        hasBackdrop: false,
        data: { mensagem: 'Cadastrar produto' }
      })

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok')
        this.getAllProdutos()
    })
  }

  getAllProdutos() {
    this.produtoService.getProducts('', this.pageSize, this.pageIndex).subscribe((data => {
      this.produtos = data.items;
      this.length = data.totalItems;
    }))
  }

  searchProduto(value: string) {
    if (value.length == 0)
      this.getAllProdutos();

    if (value.length >= 3)
      this.produtoService.getProducts(this.search, this.pageSize, this.pageIndex).subscribe(res => {
        this.produtos = res.items
        this.length = res.totalItems
      });
  }

  editarItem(id: number) {
    this.produtoService.getProductById(id).subscribe(data => {
      this.produto = data;
      const dialogRef = this.dialog.open(FormularioComponent,
        {
          width: '600px',
          data: { produto: this.produto, mensagem: 'Editar Produto' },
          hasBackdrop: false,
        })

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'ok')
          this.getAllProdutos()
      })
    })
  }

  deletarItem(id: number) {
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
    this.produtoService.deleteProduct(this.idToRemove).subscribe(res => {
      this.getAllProdutos();
    }
    );
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.produtoService.getProducts('', this.pageSize, this.pageIndex).subscribe(res => {
      this.produtos = res.items;
      this.length = res.totalItems;
    })

    // Atualize seus dados com base no tamanho da página e no índice da página.
    // Você pode fazer uma chamada à API ou ajustar sua fonte de dados aqui.
  }
}
