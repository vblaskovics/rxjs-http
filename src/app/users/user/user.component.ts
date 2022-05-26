import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // users = new Array<User>()
  $users!: Observable<User[]>

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // CLASSIC HTTP FETCH
    // this.userService.getUsers().pipe(
    //   catchError((error, caught) => {
    //     return of([{
    //       id: 0,
    //       name: '',
    //       username: '',
    //       email: ''
    //     }])
    //   })
    // ).subscribe(res => {
    //   this.users = res
    // })

    // HTTP STREAM
    this.$users = this.userService.getUserStream()
  }

}
