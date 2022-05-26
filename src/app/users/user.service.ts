import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput, of, share, switchMap, throwError, timer } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API:string = 'https://jsonplaceholder.typicode.com/users'
  
  private $users: Observable<User[]>

  constructor(private httpClient: HttpClient) {
    this.$users = timer(2000, 1000).pipe(
      switchMap(() => this.getUsers()),
      share()
    )
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API).pipe(
      catchError(this.handleError)
    )
  }

  getUserStream(): Observable<User[]> {
    return this.$users
  }

  handleError(error: HttpErrorResponse, caught: Observable<User[]>): Observable<User[]>{
    if (error.status === 0) {
      // Client side error
      console.log('Client side error occured', error.error)
    } else {
      // Server side error
      console.log('Server side error occured', error.status, 'Error message:', error.error)
    }
    return throwError(() => new Error(error.error))
  }

}
