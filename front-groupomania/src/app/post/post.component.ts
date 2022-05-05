import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent implements OnInit {
  i: any;
  opinionError = false;
  readDataComments!: Comment[];
  reverseReadDataComments: Array<any> = [];

  @Input() post!: Post;
  buttonTextLike!: string;
  buttonTextDislike!: string;

  constructor(private service: ApiserviceService, private router: Router) {}

  ngOnInit(): void {
    this.buttonAppearance();
    this.allComments();
  }

  onViewPost() {
    this.router.navigateByUrl(`groupomania/post/${this.post.postId}`)
  }

  // check presence of an userId in the likepost
  isPresentUser(id: number) {
    const likePosts = this.post.likeposts;
    const disliked = "disliked";
    const liked = "liked";
    const noOpinion = "noOpinion";
    const nothing = "nothing";
    const done = "";

    for (this.i = 0; this.i < likePosts.length; this.i++) {
      if (likePosts[this.i].userId === id && likePosts[this.i].likeType === "like") {
        return liked
      }
      else if (likePosts[this.i].userId === id && likePosts[this.i].likeType === "") {
        return noOpinion
      }
      else if (likePosts[this.i].userId === id && likePosts[this.i].likeType === "dislike") {
        return disliked
      }
      else {
        return nothing
      }
    }
    return done
  }

  // button j'aime and je n'aime pas depends of the user online
  buttonAppearance() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    if (this.isPresentUser(userId) === 'liked') {
      this.buttonTextLike = "Changer";
      this.buttonTextDislike = "Je n'aime pas";
    }
    else if (this.isPresentUser(userId) === 'disliked') {
      this.buttonTextLike = "J'aime";
      this.buttonTextDislike = "Changer";
    }
    else {
      this.buttonTextLike = "J'aime";
      this.buttonTextDislike = "Je n'aime pas";
    }
  }

  onLike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const postId = this.post.postId;

    if (this.isPresentUser(userId) === 'liked') {
      this.service.likePost(postId, userId, "").subscribe((res) => {
        window.location.reload();
      })
    }
    else {
      this.service.likePost(postId, userId, "like").subscribe((res) => {
        window.location.reload();
      }, err => {
        this.opinionError = true;
      })
    }
  }

  onDislike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const postId = this.post.postId;

    if (this.isPresentUser(userId) === 'disliked') {
      this.service.likePost(postId, userId, "").subscribe((res) => {
        window.location.reload();
      })
    }
    else {
      this.service.likePost(postId, userId, "dislike").subscribe((res) => {
        window.location.reload();
      }, err => {
        this.opinionError = true;
      })
    }
  }

  // tous les comments
  allComments() {
    this.service.getAllComments().subscribe((res) => {
      this.readDataComments = res;
      console.log(res);
      // place les posts par ordre de création
      this.reverseReadDataComments = this.readDataComments.slice().reverse();
    });
  }
}
