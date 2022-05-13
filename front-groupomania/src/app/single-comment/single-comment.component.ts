import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../models/comment.model';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit {
  modifyForm: any;
  deleteForm: any;
  url!: String | ArrayBuffer | null;
  image!: string;
  comment!: Comment;
  changePossible = false;
  deleteError = false;

  constructor(private router: Router, private service: ApiserviceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.modifyForm = new FormGroup({
      contentModify: new FormControl(''),
      mediaModify: new FormControl('')
    });
    this.deleteForm = new FormGroup({
      deleteName: new FormControl('')
    });
    const commentId = +this.route.snapshot.params['id'];
    this.oneComment(commentId);
  }

  get contentModify() { return this.modifyForm.get('contentModify'); }
  get mediaModify() { return this.modifyForm.get('mediaModify'); }
  get deleteName() { return this.deleteForm.get('deleteName'); }

  // allow to see the pic we want to publicate
  readUrl(event: any) {
    let files = event.target.files;
    if (files.length === 0)
      return;
    let reader = new FileReader();
    this.image = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (event: ProgressEvent) => {
      this.url = reader.result;
    }
  }

  // One comment
  oneComment(id: any) {
    this.service.getOneComment(id).subscribe((res) => {
      this.comment = res;
      console.log(res);
      return this.comment;
    });
  }

  // retour à l'accueil
  onContinue(): void {
    this.router.navigateByUrl('groupomania');
  }

  // modifier le comment
  onModify() {
    const val = this.modifyForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const content = val.contentModify;
    const commentId = this.comment.commentId;

    let modifyDataImg = {
      userId: userId,
      content: this.comment.content
    };

    let modifyDataImgTxt = {
      userId: userId,
      content: content
    };

    let formData = new FormData();

    // case of only text
    if(content && !this.image) {
      this.service.modifyComment(commentId, userId, content, null).subscribe((res) => {
        this.comment.content = content;
        this.modifyForm.reset();
      });
    }
    // case of only image
    else if(!content && this.image) {
      formData.append('comment', JSON.stringify(modifyDataImg));
      formData.append('image', this.image[0]);
      this.service.modifyComment(commentId, null, null, formData).subscribe((res) => {
        this.modifyForm.reset();
        this.router.navigateByUrl('groupomania');
      });
    }
    // case of text + image
    else {
      formData.append('comment', JSON.stringify(modifyDataImgTxt));
      formData.append('image', this.image[0]);
      this.service.modifyComment(commentId, null, null, formData).subscribe((res) => {
        this.modifyForm.reset();
        this.router.navigateByUrl('groupomania');
      });
    }
  }

  // supprimer le comment
  onDelete(commentId: any) {
    const val = this.deleteForm.value;
    const nameUser = localStorage.getItem("name_user");
      this.service.deleteComment(commentId).subscribe((res) => {
        console.log(`Comment supprimé`);
        this.onContinue();
      })
    }
}
