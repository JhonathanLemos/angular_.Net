import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from 'src/app/Produto';
import { ClientesService } from 'src/app/services/clientes.service';
import { ProdutosService } from 'src/app/services/produtos.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  formulario: FormGroup;
  produtos: Produto[] = [];
  constructor(private form: FormBuilder, private produtoService: ProdutosService, private route: ActivatedRoute, private clienteService: ClientesService, private router: Router) {
    this.formulario = this.form.group({
      id: [0, Validators.required],
      nomeCliente: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.checkFormType();
    this.getAllProdutos();
  }

  checkFormType() {
    this.route.params.subscribe(res => {
      if (res['id'] != 'add') {
        this.clienteService.getclienteById(res['id']).subscribe(response => {
          this.formulario.patchValue({
            id: response.id,
            nome: response.nomeCliente
          })
        })
      }
    })
  }

  salvarFormulario() {
    if (this.formulario.valid) {
      this.route.params.subscribe(res => {

        if (res['id'] == 'add')
          this.clienteService.addcliente(this.formulario.value).subscribe(res => {
            this.router.navigate(['/clientes'])

          })
        else
          this.clienteService.updatecliente(res['id'], this.formulario.value).subscribe(res => {
            this.router.navigate(['/clientes'])

          })
      })

    }
  }

  getAllProdutos() {
    this.produtoService.getProducts('', 10, 10).subscribe(res => {
      this.produtos = res.items;
    })
  }
}
