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
  readDataComments!: Comment[];
  reverseReadDataComments: Array<any> = [];
  numberOfComment: any;
  i: any;
  buttonTextLike!: string;
  buttonTextDislike!: string;
  opinionError = false;
  buttonTextComments!: string;
  comments = true;

  @Input() post!: Post;

  constructor(private service: ApiserviceService, private router: Router) {}
  

  ngOnInit(): void {
    this.buttonAppearanceLike();
    this.buttonTextComments = `Voir le(s) ${this.post.comments.length} commentaire(s)`;
  }

  onViewPost() {
    this.router.navigateByUrl(`groupomania/post/${this.post.postId}`)
  }

  onUser() {
    this.router.navigateByUrl(`groupomania/user/${this.post.userId}`)
  }


  // check presence of an userId in the likepost
  isPresentUser(id: number) {
    const likePosts = this.post.likeposts;
    const disliked = "disliked";
    const liked = "liked";
    const noOpinion = "noOpinion";
    const nothing = "nothing";
    const done = "";

    if(this.post.likeposts === undefined) {
      console.log("HERE", this.post);
    }

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
    const postId = this.post.postId;
    const objNoOpinion = { likeType: "", userId: userId };
    const objLike = { likeType: "like", userId: userId };

    if (this.isPresentUser(userId) === 'liked') {
      this.service.likePost(postId, userId, "").subscribe((res) => {
        // modifie le nbre de like
        this.post.likes -= 1;
        this.buttonTextLike = "J'aime";
        this.opinionError = false;
        // récupère l'obj avec le bon userId dans l'array des likes
        const likepostNow = this.post.likeposts.find((obj:any) => obj.userId === userId);
        // suppression de cet objet
        let myIndex = this.post.likeposts.indexOf(likepostNow);
        if (myIndex !== -1) {
          this.post.likeposts.splice(myIndex, 1);
          // puis remplacement par l'objet contenant le bon opinion
          this.post.likeposts.push(objNoOpinion)
        }
      })
    }
    else {
      this.service.likePost(postId, userId, "like").subscribe((res) => {
        this.post.likes += 1;
        this.buttonTextLike = "Changer";
        const likepostNow = this.post.likeposts.find((obj:any) => obj.userId === userId);
        let myIndex = this.post.likeposts.indexOf(likepostNow);
        if (myIndex !== -1) {
          this.post.likeposts.splice(myIndex, 1);
          this.post.likeposts.push(objLike)
        }
      }, err => {
        this.opinionError = true;
      })
    }
  }

  onDislike() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const postId = this.post.postId;
    const objNoOpinion = { likeType: "", userId: userId };
    const objDislike = { likeType: "dislike", userId: userId };

    if (this.isPresentUser(userId) === 'disliked') {
      this.service.likePost(postId, userId, "").subscribe((res) => {
        this.post.dislikes -= 1;
        this.buttonTextDislike = "Je n'aime pas";
        this.opinionError = false;
        const likepostNow = this.post.likeposts.find((obj:any) => obj.userId === userId);
        let myIndex = this.post.likeposts.indexOf(likepostNow);
        if (myIndex !== -1) {
          this.post.likeposts.splice(myIndex, 1);
          this.post.likeposts.push(objNoOpinion)
        }
      })
    }
    else {
      this.service.likePost(postId, userId, "dislike").subscribe((res) => {
        this.post.dislikes += 1;
        this.buttonTextDislike = "Changer";
        const likepostNow = this.post.likeposts.find((obj:any) => obj.userId === userId);
        let myIndex = this.post.likeposts.indexOf(likepostNow);
        if (myIndex !== -1) {
          this.post.likeposts.splice(myIndex, 1);
          this.post.likeposts.push(objDislike)
        }
      }, err => {
        this.opinionError = true;
      })
    }
  }

  // tous les comments
  allCommentsPost() {
    const postId = this.post.postId;

    if (this.buttonTextComments === `Voir le(s) ${this.post.comments.length} commentaire(s)`) {
      this.service.getAllCommentsPost(postId).subscribe((res) => {
        this.readDataComments = res;
        console.log(res);
        // place les posts par ordre de création
        this.reverseReadDataComments = this.readDataComments.slice().reverse();
        this.comments = true;
        this.buttonTextComments = "Cacher";
      });
    }
    else {
      this.comments = false;
      this.buttonTextComments = `Voir le(s) ${this.post.comments.length} commentaire(s)`;
    }
  }

  // recover data from child
  addComment(newComment: Comment) {
    this.reverseReadDataComments.push(newComment);
    this.reverseReadDataComments = this.reverseReadDataComments.slice().reverse();
  }
}
