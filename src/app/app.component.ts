import { Component } from '@angular/core';
import { firstValueFrom, forkJoin, map, of, switchMap } from 'rxjs';
import { Post } from './posts/post';
import { PostService } from './posts/post.service';
import { UserService } from './users/user.service';

type PostWithUsername = Post & { username: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'rxjs-http';

  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.getPostsWithUsername();
    this.getPostsWithUsernameStream();
  }

  async getPostsWithUsername() {
    let users = await firstValueFrom(this.userService.getUsers());
    let posts = await firstValueFrom(this.postService.getPosts());

    let newPosts: PostWithUsername[] = posts.map((p) => {
      let user = users.find((u) => u.id === p.userId);
      return { ...p, username: user ? user?.username : '' };
    });

    console.log('ASYNC///////////////////////////');
    console.log(newPosts[0].title, newPosts[0].username);
  }
  
  getPostsWithUsernameStream() {
    let $newPosts = forkJoin({
      users: this.userService.getUsers(),
      posts: this.postService.getPosts(),
    }).pipe(
      map((res) => {
        let newPosts: PostWithUsername[] = res.posts.map((p) => {
          let user = res.users.find((u) => u.id === p.userId);
          return {
            ...p,
            username: user ? user?.username : '',
          }
        });
        return newPosts;
      })
      );
      
      $newPosts.subscribe((res) => {
        console.log('STREAM ///////////////////////////');
        console.log(res[0].title, res[0].username);
      });
    }
  }
