import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Comment } from '../models/comment.model';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  readData: any;
  reverseReadData: Array<any> = [];
  i: any;
  opinionError = false;

  @Input() comment!: Comment;
  buttonTextLikeComment!: string;
  buttonTextDislikeComment!: string;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.buttonAppearance();
    console.log(this.comment.likecomments);
  }

  onViewComment() {
    this.router.navigateByUrl(`groupomania/comment/${this.comment.commentId}`)
  }

  // check presence of an userId in the comment
  isPresentUserComment(id: number) {
    const likeComments = this.comment.likecomments;
    const disliked = "disliked";
    const liked = "liked";
    const noOpinion = "noOpinion";
    const nothing = "nothing";
    const done = "";

    for (this.i = 0; this.i < likeComments.length; this.i++) {
      if (likeComments[this.i].userId === id && likeComments[this.i].likeType === "like") {
        return liked
      }
      else if (likeComments[this.i].userId === id && likeComments[this.i].likeType === "") {
        return noOpinion
      }
      else if (likeComments[this.i].userId === id && likeComments[this.i].likeType === "dislike") {
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
    if (this.isPresentUserComment(userId) === 'liked') {
      this.buttonTextLikeComment = "Changer";
      this.buttonTextDislikeComment = "Je n'aime pas";
    }
    else if (this.isPresentUserComment(userId) === 'disliked') {
      this.buttonTextLikeComment = "J'aime";
      this.buttonTextDislikeComment = "Changer";
    }
    else {
      this.buttonTextLikeComment = "J'aime";
      this.buttonTextDislikeComment = "Je n'aime pas";
    }
  }

  onLike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const commentId = this.comment.postId;

    if (this.isPresentUserComment(userId) === 'liked') {
      this.service.likeComment(commentId, userId, "").subscribe((res) => {
        window.location.reload();
      })
    }
    else {
      this.service.likeComment(commentId, userId, "like").subscribe((res) => {
        window.location.reload();
      }, err => {
        this.opinionError = true;
      })
    }
  }

  onDislike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const commentId = this.comment.postId;

    if (this.isPresentUserComment(userId) === 'disliked') {
      this.service.likeComment(commentId, userId, "").subscribe((res) => {
        window.location.reload();
      })
    }
    else {
      this.service.likeComment(commentId, userId, "dislike").subscribe((res) => {
        window.location.reload();
      }, err => {
        this.opinionError = true;
      })
    }
  }

}
