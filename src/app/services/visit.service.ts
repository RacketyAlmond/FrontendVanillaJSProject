import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Visit } from 'src/app/visit/visit.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private visitsUrl = 'http://localhost:8085/api/visit';
  private usernameUrl = 'http://localhost:8085/students/username';
  private emailURL = 'http://localhost:8085/students/email';

  constructor(private http: HttpClient) { }

  getUsername(): Observable<string> {
    return this.http.get(this.usernameUrl, { responseType: 'text' }).pipe(
      catchError(this.handleError<string>('getUsername'))
    );
  }

  getEmail(): Observable<string> {
    return this.http.get(this.emailURL, { responseType: 'text' }).pipe(
      catchError(this.handleError<string>('getEmail'))
    );
  }

  getVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.visitsUrl).pipe(
      catchError(this.handleError<Visit[]>('getVisits', []))
    );
  }

  addVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(this.visitsUrl, visit, httpOptions).pipe(
      catchError(this.handleError<Visit>('addVisit'))
    );
  }

  deleteVisit(visit: Visit | number): Observable<Visit> {
    const id = typeof visit === 'number' ? visit : visit.id;
    const url = `${this.visitsUrl}/${id}`;
    return this.http.delete<Visit>(url, httpOptions).pipe(
      catchError(this.handleError<Visit>('deleteVisit'))
    );
  }

  updateVisit(visit: Visit): Observable<any> {
    return this.http.put(`${this.visitsUrl}/${visit.id}`, visit, httpOptions).pipe(
      catchError(this.handleError<any>('updateVisit'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
