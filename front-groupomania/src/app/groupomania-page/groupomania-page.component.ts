import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-groupomania-page',
  templateUrl: './groupomania-page.component.html',
  styleUrls: ['./groupomania-page.component.scss']
})
export class GroupomaniaPageComponent implements OnInit {

  constructor(private service: ApiserviceService) {}
  readDataPosts!: Post[];
  reverseReadDataPosts: Array<any> = [];

  ngOnInit(): void {
    this.allPosts();
  }

  // tous les posts
  allPosts() {
    this.service.getAllPosts().subscribe((res) => {
      this.readDataPosts = res;
      console.log(res)
      // place les posts par ordre de création
      this.reverseReadDataPosts = this.readDataPosts.slice().reverse();
    });
  }

  // recover data from child
  addPost(newPost: Post) {
    this.reverseReadDataPosts.push(newPost);
    this.reverseReadDataPosts = this.reverseReadDataPosts.slice().reverse();
  }
}




