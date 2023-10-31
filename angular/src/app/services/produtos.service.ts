import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pagination } from '../Pagination';
import { Produto } from '../Produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = 'https://localhost:7136/api/product';

  constructor(private http: HttpClient) { }

  // Listar todos os produtos
  getProducts(search: string, pageSize: number, pageIndex: number): Observable<Pagination> {
    let params = new HttpParams();

    params = params.set('search', search);

    params = params.set('pageSize', pageSize);
    params = params.set('pageIndex', pageIndex);

    return this.http.get<Pagination>(`${this.apiUrl}`, { params }).pipe(
      map(response => {
        return {
          totalItems: response.totalItems,
          items: response.items.map(produto => ({
            id: produto.id,
            nome: produto.nomeProduto,
            cliente: produto.customerNome
          }))
        }
      })
    );
  }

  // Obter um produto por ID
  getProductById(productId: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${productId}`);
  }

  // Adicionar um novo produto
  addProduct(product: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}`, product);
  }

  // Atualizar um produto existente
  updateProduct(productId: number, product: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${productId}`, product);
  }

  // Excluir um produto por ID
  deleteProduct(productId: number): Observable<Produto> {
    return this.http.delete<Produto>(`${this.apiUrl}/${productId}`);
  }
}
