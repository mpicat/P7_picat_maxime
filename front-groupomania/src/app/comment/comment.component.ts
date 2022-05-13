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
  buttonTextLike!: string;
  buttonTextDislike!: string;
  changePossible = false;

  @Input() comment!: Comment;
  buttonTextLikeComment!: string;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.buttonAppearanceLike();
    this.okToChange();
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
    const liked = "liked";
    const noOpinion = "noOpinion";
    const nothing = "nothing";
    const done = "";

    for (let i = 0; i < likeComments.length; i++) {
      if (likeComments[i].userId === id && likeComments[i].likeType === "like") {
        return liked
      }
      else if (likeComments[i].userId === id && likeComments[i].likeType === "") {
        return noOpinion
      }
      else {
        return nothing
      }
    }
    return done
  }

  // button j'aime depends of the user online
  buttonAppearanceLike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    if (this.isPresentUser(userId) === 'liked') {
      this.buttonTextLike = "Changer";
    }
    else {
      this.buttonTextLike = "J'aime";
    }
  }
  
  async onLike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const commentId = this.comment.commentId;
    const objNoOpinion = { likeType: "", userId: userId };
    const objLike = { likeType: "like", userId: userId };

    if (this.buttonTextLike === "Changer") {
      const res = await this.service.likeComment(commentId, userId, "").subscribe();
      // modifie le nbre de like
      this.comment.likes -= 1;
      this.buttonTextLike = "J'aime";
      // récupère l'obj avec le bon userId dans l'array des likes
      const likecommentNow = this.comment.likecomments.find((obj:any) => obj.userId === userId);
      // suppression de cet objet
      let myIndex = this.comment.likecomments.indexOf(likecommentNow);
      if (myIndex !== -1) {
        this.comment.likecomments.splice(myIndex, 1);
        // puis remplacement par l'objet contenant le bon opinion
        this.comment.likecomments.push(objNoOpinion)
      }
    }
    else {
      const res = await this.service.likeComment(commentId, userId, "like").subscribe();
        this.comment.likes += 1;
        this.buttonTextLike = "Changer";
        const likecommentNow = this.comment.likecomments.find((obj:any) => obj.userId === userId);
        let myIndex = this.comment.likecomments.indexOf(likecommentNow);
        if (myIndex !== -1) {
          this.comment.likecomments.splice(myIndex, 1);
          this.comment.likecomments.push(objLike)
        } else { 
          // we make sure that we look for something that has actually been pushed in the likecomments array
            this.comment.likecomments.push(objLike);
          }
    }
  }

  // able to modify/delete if good userId in localStorage
  okToChange() {
    const isAdmin = localStorage.getItem("admin_user");
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    // ajouter si admin
    if (userId === this.comment.userId || isAdmin === 'YES') {
      this.changePossible = true;
    } else {
      this.changePossible = false;
    }
  }
}
