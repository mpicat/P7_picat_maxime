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
  reverseReadDataComments: Array<Comment> = [];
  numberOfComment!: number;
  buttonTextLike!: string;
  buttonTextComments!: string;
  comments = true;
  changePossible = false;

  @Input() post!: Post;

  constructor(private service: ApiserviceService, private router: Router) {}
  
  ngOnInit(): void {
    this.buttonAppearanceLike();
    this.okToChange();
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
    const liked = "liked";
    const noOpinion = "noOpinion";
    const nothing = "nothing";
    const done = "";

    for (let i = 0; i < likePosts.length; i++) {
      if (likePosts[i].userId === id && likePosts[i].likeType === "like") {
        return liked
      }
      else if (likePosts[i].userId === id && likePosts[i].likeType === "") {
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
    const postId = this.post.postId;
    const objNoOpinion = { likeType: "", userId: userId };
    const objLike = { likeType: "like", userId: userId };

    if (this.isPresentUser(userId) === 'liked') {
      const res = await this.service.likePost(postId, userId, "").subscribe();
      // modifie le nbre de like
      this.post.likes -= 1;
      this.buttonTextLike = "J'aime";
      // récupère l'obj avec le bon userId dans l'array des likes
      const likepostNow = this.post.likeposts.find((obj: { likeType: string, userId: number }) => obj.userId === userId);
      // suppression de cet objet
      let myIndex = this.post.likeposts.indexOf(likepostNow);
      if (myIndex !== -1) {
        this.post.likeposts.splice(myIndex, 1);
        // puis remplacement par l'objet contenant le bon opinion
        this.post.likeposts.push(objNoOpinion)
      }
    }
    else {
      const res = await this.service.likePost(postId, userId, "like").subscribe();
      this.post.likes += 1;
      this.buttonTextLike = "Changer";
      const likepostNow = this.post.likeposts.find((obj: { likeType: string, userId: number }) => obj.userId === userId);
      let myIndex = this.post.likeposts.indexOf(likepostNow);
      if (myIndex !== -1) {
        this.post.likeposts.splice(myIndex, 1);
        this.post.likeposts.push(objLike);
      } else { 
      // we make sure that we look for something that has actually been pushed in the likeposts array
        this.post.likeposts.push(objLike);
      }
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
        this.buttonTextComments = "Cacher les commentaires";
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

  // able to modify/delete if good userId in localStorage
  okToChange() {
    const isAdmin = localStorage.getItem("admin_user");
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    // ajouter si admin
    if (userId === this.post.userId || isAdmin === 'YES') {
      this.changePossible = true;
    } else {
      this.changePossible = false;
    }
  }
}
