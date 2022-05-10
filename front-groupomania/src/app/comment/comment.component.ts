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
  buttonTextLike!: string;
  buttonTextDislike!: string;
  opinionError = false;

  @Input() comment!: Comment;
  buttonTextLikeComment!: string;
  buttonTextDislikeComment!: string;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.buttonAppearanceLike();
  }

  onUser() {
    this.router.navigateByUrl(`groupomania/user/${this.comment.userId}`)
  }

  onViewComment() {
    this.router.navigateByUrl(`groupomania/comment/${this.comment.commentId}`)
  }

  // check presence of an userId in the likepost
  isPresentUser(id: number) {
    const likeComments = this.comment.likecomments;
    const disliked = "disliked";
    const liked = "liked";
    const noOpinion = "noOpinion";
    const nothing = "nothing";
    const done = "";

    if(this.comment.likecomments === undefined) {
      console.log("HERE", this.comment);
    }

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
  buttonAppearanceLike() {
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
    const commentId = this.comment.commentId;
    const objNoOpinion = { likeType: "", userId: userId };
    const objLike = { likeType: "like", userId: userId };

    if (this.isPresentUser(userId) === 'liked') {
      this.service.likeComment(commentId, userId, "").subscribe((res) => {
        // modifie le nbre de like
        this.comment.likes -= 1;
        this.buttonTextLike = "J'aime";
        this.opinionError = false;
        // récupère l'obj avec le bon userId dans l'array des likes
        const likecommentNow = this.comment.likecomments.find((obj:any) => obj.userId === userId);
        // suppression de cet objet
        let myIndex = this.comment.likecomments.indexOf(likecommentNow);
        if (myIndex !== -1) {
          this.comment.likecomments.splice(myIndex, 1);
          // puis remplacement par l'objet contenant le bon opinion
          this.comment.likecomments.push(objNoOpinion)
        }
      })
    }
    else {
      this.service.likeComment(commentId, userId, "like").subscribe((res) => {
        this.comment.likes += 1;
        this.buttonTextLike = "Changer";
        const likecommentNow = this.comment.likecomments.find((obj:any) => obj.userId === userId);
        let myIndex = this.comment.likecomments.indexOf(likecommentNow);
        if (myIndex !== -1) {
          this.comment.likecomments.splice(myIndex, 1);
          this.comment.likecomments.push(objLike)
        }
      }, err => {
        this.opinionError = true;
      })
    }
  }

  onDislike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const commentId = this.comment.commentId;
    const objNoOpinion = { likeType: "", userId: userId };
    const objDislike = { likeType: "dislike", userId: userId };

    if (this.isPresentUser(userId) === 'disliked') {
      this.service.likeComment(commentId, userId, "").subscribe((res) => {
        this.comment.dislikes -= 1;
        this.buttonTextDislike = "Je n'aime pas";
        this.opinionError = false;
        const likecommentNow = this.comment.likecomments.find((obj:any) => obj.userId === userId);
        let myIndex = this.comment.likecomments.indexOf(likecommentNow);
        if (myIndex !== -1) {
          this.comment.likecomments.splice(myIndex, 1);
          this.comment.likecomments.push(objNoOpinion)
        }
      })
    }
    else {
      this.service.likeComment(commentId, userId, "dislike").subscribe((res) => {
        this.comment.dislikes += 1;
        this.buttonTextDislike = "Changer";
        const likecommentNow = this.comment.likecomments.find((obj:any) => obj.userId === userId);
        let myIndex = this.comment.likecomments.indexOf(likecommentNow);
        if (myIndex !== -1) {
          this.comment.likecomments.splice(myIndex, 1);
          this.comment.likecomments.push(objDislike)
        }
      }, err => {
        this.opinionError = true;
      })
    }
  }
}
