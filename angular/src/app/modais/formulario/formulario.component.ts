import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from 'src/app/Cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { ProdutosService } from 'src/app/services/produtos.service';
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formulario!: FormGroup;
  clientes!: Cliente[];
  mensagem!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FormularioComponent>, private produtoService: ProdutosService, private clienteService: ClientesService) {
    this.formulario = new FormGroup({
      id: new FormControl(0, Validators.required),
      nomeProduto: new FormControl('', Validators.required),
      customerId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getAllClientes();
    this.validarItens()
  }

  validarItens() {
    if (this.data?.produto) {
      // this.formulario.patchValue({
      //   nome: this.data.produto.nome,
      //   customerId: this.data.produto.customerId,
      // })
      for (const campo in this.formulario.controls) {
        if (this.data.produto.hasOwnProperty(campo)) {
          this.formulario.get(campo)?.setValue(this.data.produto[campo])
        }
      }
    }

    if (this.data.mensagem)
      this.mensagem = this.data.mensagem;
  }

  salvarFormulario() {
    if (this.formulario.valid) {
      if (this.formulario.value.id != 0)
        this.produtoService.updateProduct(this.formulario.value.id, this.formulario.value).subscribe(data => console.log(data));
      else
        this.produtoService.addProduct(this.formulario.value).subscribe(data => { });

      this.dialogRef.close('ok')
    }
  }

  fechar(){
    this.dialogRef.close();
  }

  getAllClientes() {
    this.clienteService.getListOfClientes().subscribe((data => {
      this.clientes = data
    }))
  }
}
