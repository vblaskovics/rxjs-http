import { Component } from '@angular/core';
import { firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
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
  $newPosts?: Observable<PostWithUsername[]>

  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {
    // this.getPostsWithUsernameSubscribe()
    // this.getPostsWithUsernameAwait();
    // this.getPostsWithUsernameStream();
    this.getPostsWithUsernameStream2();
  }

  getPostsWithUsernameSubscribe(): void {
    this.userService.getUsers().subscribe((users) => {
      this.postService.getPosts().subscribe((posts) => {
        let newPosts: PostWithUsername[] = posts.map((p) => {
          let user = users.find((u) => u.id === p.userId);
          return { ...p, username: user ? user.username : '' };
        });
        console.log(newPosts);
      });
    });
  }

  async getPostsWithUsernameAwait() {
    let users = await firstValueFrom(this.userService.getUsers());
    let posts = await firstValueFrom(this.postService.getPosts());

    let newPosts: PostWithUsername[] = posts.map((p) => {
      let user = users.find((u) => u.id === p.userId);
      return { ...p, username: user ? user.username : '' };
    });
    console.log(newPosts);
  }

  getPostsWithUsernameStream() {
    let $newPosts = forkJoin({
      users: this.userService.getUsers(),
      posts: this.postService.getPosts(),
    });

    $newPosts.subscribe((res) => {
      let users = res.users;
      let posts = res.posts;

      let newPosts: PostWithUsername[] = posts.map((p) => {
        let user = users.find((u) => u.id === p.userId);
        return { ...p, username: user ? user.username : '' };
      });
      console.log(newPosts);
    });
  }

  getPostsWithUsernameStream2() {
    this.$newPosts = forkJoin({
      users: this.userService.getUsers(),
      posts: this.postService.getPosts(),
    }).pipe(
      map((res) => {
        let users = res.users;
        let posts = res.posts;

        let newPosts: PostWithUsername[] = posts.map((p) => {
          let user = users.find((u) => u.id === p.userId);
          return { ...p, username: user ? user.username : '' };
        });

        return newPosts
      })
    );

    this.$newPosts.subscribe(res => {
      console.log(res)
    })
  }
}
