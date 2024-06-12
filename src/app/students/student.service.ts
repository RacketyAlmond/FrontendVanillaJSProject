import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Student } from './student.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsUrl = 'http://localhost:8085/students';

  constructor(private http: HttpClient) { }

  /** GET students from the server */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl).pipe(
      catchError(this.handleError<Student[]>('getStudents', []))
    );
  }

  /** GET student by id. Will 404 if id not found */
  getStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }



  /** POST: add a new student to the server */
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, httpOptions).pipe(
      tap((studentAdded: Student) => this.log(`added student id=${studentAdded.id}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  /** DELETE: delete the student from the server */
  deleteStudent(student: Student | number): Observable<Student> {
    const id = typeof student === 'number' ? student : student.id;
    const url = `${this.studentsUrl}/${id}`;
    return this.http.delete<Student>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  /** DELETE: delete all the students from the server */
  deleteStudents(): Observable<Student> {
    return this.http.delete<Student>(this.studentsUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted students`)),
      catchError(this.handleError<Student>('deleteStudents'))
    );
  }

  /** PUT: update the student on the server */
  updateStudent(student: Student, id: number): Observable<Student> {
    return this.http.put<Student>(`${this.studentsUrl}/${id}`, student, httpOptions).pipe(
      tap((studentUpdated: Student) => this.log(`updated student id=${studentUpdated.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** PUT: update all the students on the server */
  updateStudents(students: Student[]): Observable<Student[]> {
    return this.http.put<Student[]>(this.studentsUrl, students, httpOptions).pipe(
      tap(_ => this.log(`updated student id=${students}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** GET number of students from the server */
  getStudentsCounter(): Observable<number> {
    const url = `${this.studentsUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of students in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

  /** Upload a file for a student */
  uploadFile(studentId: number, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const url = `${this.studentsUrl}/${studentId}/upload`;

    return this.http.post<any>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / event.total!);
          this.log(`File is ${progress}% uploaded.`);
        } else if (event.type === HttpEventType.Response) {
          this.log('File is completely uploaded!');
        }
      }),
      catchError(this.handleError<any>('uploadFile'))
    );
  }

  /** Download a file for a student */
  downloadFile(studentId: number): Observable<Blob> {
    const url = `${this.studentsUrl}/${studentId}/download`;

    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap(_ => this.log(`Downloaded file for student id=${studentId}`)),
      catchError(this.handleError<Blob>('downloadFile'))
    );
  }



  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /** Log a StudentService message with the MessageService */
  private log(message: string) {
    console.log('StudentService: ' + message);
  }
}
