import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface Produit {
  id: number;
  nom: string;
  categorie: string;
}

export interface ProduitCreatePayload {
  nom: string;
  categorie: string;
}

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/produits`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.baseUrl}/${id}`, { headers: this.buildAuthHeaders() });
  }

  create(payload: ProduitCreatePayload): Observable<Produit> {
    return this.http.post<Produit>(this.baseUrl, payload, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}