import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, max } from 'rxjs';
import { Pagination } from '../Pagination';
import { Cliente } from '../Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'https://localhost:7136/api/customer';
  url = '';

  constructor(private http: HttpClient) { }

  // Listar todos os produtos
  getclientes(search: string, pageSize: number, pageIndex: number): Observable<Pagination> {
    let params = new HttpParams();

    params = params.set('search', search);

    params = params.set('pageSize', pageSize);
    params = params.set('pageIndex', pageIndex);

    return this.http.get<Pagination>(`${this.apiUrl}`, { params }).pipe(
      map(response => {
        console.log(response);
        return {
          totalItems: response.totalItems,
          items: response.items.map(cliente => ({
            id: cliente.id,
            nome: cliente.nomeCliente,
          }))
        }
      })
    );
  }

  getListOfClientes(): Observable<Cliente[]> {

    return this.http.get<Cliente[]>(`${this.apiUrl}/GetAllCustomers`).pipe(
      map(response => {
        return response
      })
    );
  }
  // Obter um produto por ID
  getclienteById(customerId: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${customerId}`);
  }

  // Adicionar um novo produto
  addcliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}`, cliente);
  }

  // Atualizar um produto existente
  updatecliente(customerId: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${customerId}`, cliente);
  }

  // Excluir um produto por ID
  deletecliente(customerId: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.apiUrl}/${customerId}`);
  }
}
