import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.module';
import { PostsService } from './post.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null; // null treat as false value
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {

    this.errorSub = this.postsService.error.subscribe(errorMessage =>{
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts=>{
      this.isFetching = false;
      this.loadedPosts = posts;
      
    }, error=>{
      this.isFetching = false;
      this.error = error.message; 
      console.log(error);
      
    })
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content);
   
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      posts=>{
      this.isFetching = false;
      this.loadedPosts = posts;
      
    }, error=>{
      this.isFetching = false;
      this.error = error.message;
      console.log(error);
       
    } )
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(()=>{
      this.loadedPosts = [];
    });
  }

  // Pipe: funel observable data through multiple operators before they reach the subscribe method
  // map allows us get some data and return new data which is automatically rewrapped in observable

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe()
  }

}
