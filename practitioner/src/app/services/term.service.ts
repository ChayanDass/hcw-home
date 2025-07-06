import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, timestamp } from 'rxjs';

import { environment } from '../../environments/environment';
import { GetLatestTermsParams, Term ,TermAccept } from '../models/term.model';
import { ApiResponse } from '../models/apiresponse.model';
import { SnackbarService } from './snackbar/snackbar.service';
import { AuthService } from '../auth/auth.service';
import { LoginUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private readonly apiUrl = `${environment.apiUrl}/v1/term`;
  private _term = signal<Term | null>(null);
  term = this._term.asReadonly();
  isLoggedIn = computed(() => !!this._term());

  // BehaviorSubject to cache latest term
  private latestTermSubject = new BehaviorSubject<Term | null>(null);
  readonly latestTerm$ = this.latestTermSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) {
    const termJson = localStorage.getItem('LatestTerm');
    if (termJson) {
      const userObj = JSON.parse(termJson);
      console.log('[AuthService] Loaded latest term  from localStorage:', userObj);
      this._term.set(userObj);
    } else {
      console.log('[TermService] No latest found in localStorage.');
    }
   }

  /**
   * Fetch latest terms from server and update the store
   */
  getLatestTerms(query: GetLatestTermsParams): Observable<Term> {
    let params = new HttpParams();

    if (query.organizationId !== undefined) {
      params = params.set('organizationId', query.organizationId.toString());
    }
    if (query.language) {
      params = params.set('language', query.language);
    }
    if (query.country) {
      params = params.set('country', query.country);
    }

    return this.http.get<ApiResponse<Term>>(`${this.apiUrl}/latest`, { params }).pipe(
      map((res) => {
        const latestTerm = res.data;
        if (latestTerm) {
          console.log(latestTerm);
          this.storeLatestTerm(res.data)

        }
        return latestTerm;
      })
    );
  }

  acceptTerm(userId: number, termId: number):Observable<ApiResponse<TermAccept>> {
    const url = `${environment.apiUrl}/v1/practitioner/accept-term`;
    return this.http.post<ApiResponse<TermAccept>>(url, { userId, termId }).pipe(
      map((res)=>{
        if(res.success==true){

          this.updateCurrentUserTermData(res.data.termId,res.data.termVersion,res.data.acceptedAt)
          this.clearLatestTerm()
        }
        return res
      })
    );
  }

  updateCurrentUserTermData(termId: number, termVersion: number, acceptedAt: string | Date): void {
    const currentUser = this.authService.getCurrentUser();
  
    if (!currentUser) {
      console.warn('[TermService] No current user found while updating term data');
      return;
    }
    const updatedUser: LoginUser = {
      ...currentUser,
      termId,
      termVersion,
      acceptedAt
    };
    this.authService.storeCurrentUser(updatedUser);
  }
  
  
  

  
  
  

  storeLatestTerm(term: Term) {
    console.log('[TermService] Saving term to localStorage:', term);
    localStorage.setItem('LatestTerm', JSON.stringify(term));
    this._term.set(term);
  }
  /**
   * Synchronously get the cached latest term
   */
  getLatestStored(): Term | null {

    const term = this._term();
    return term;

  }

  /**
   * Clear the stored latest term
   */
  clearLatestTerm(): void {
    localStorage.removeItem('LatestTerm');
    this._term.set(null);

  }
}
