import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  post!: Post;
  modifyForm: any;
  url!: String | ArrayBuffer | null;
  image!: string;
  deleteForm: any;
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
    const postId = +this.route.snapshot.params['id'];
    this.onePost(postId);
  }

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

  get contentModify() { return this.modifyForm.get('contentModify'); }
  get mediaModify() { return this.modifyForm.get('mediaModify'); }
  get deleteName() { return this.deleteForm.get('deleteName'); }

  // One post
  onePost(id: any) {
    this.service.getOnePost(id).subscribe((res) => {
      this.post = res;
      console.log(res);
      return this.post;
    });
  }

  // retour à l'accueil
  onContinue(): void {
    this.router.navigateByUrl('groupomania');
  }

  // modifier le post
  onModify() {
    const val = this.modifyForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const content = val.contentModify;
    const postId = this.post.postId;

    let modifyDataImg = {
      userId: userId,
      content: this.post.content
    };

    let modifyDataImgTxt = {
      userId: userId,
      content: content
    };

    let formData = new FormData();
    
    // case of only text
    if(content && !this.image) {
      this.service.modifyPost(postId, userId, content, null).subscribe((res) => {
        this.post.content = content;
        this.modifyForm.reset();
      });
    }
    // case of only image
    else if(!content && this.image) {
      formData.append('post', JSON.stringify(modifyDataImg));
      formData.append('image', this.image[0]);
      this.service.modifyPost(postId, null, null, formData).subscribe((res) => {
        this.modifyForm.reset();
        this.router.navigateByUrl('groupomania');
      });
    }
    // case of text + image
    else {
      formData.append('post', JSON.stringify(modifyDataImgTxt));
      formData.append('image', this.image[0]);
      this.service.modifyPost(postId, null, null, formData).subscribe((res) => {
        this.modifyForm.reset();
        this.router.navigateByUrl('groupomania');
      });
    }
  }

  // supprimer le post
  onDelete(postId: any) {
    const val = this.deleteForm.value;
    const nameUser = localStorage.getItem("name_user");

    this.service.deletePost(postId).subscribe((res) => {
      console.log(`Post supprimé`);
      this.onContinue();
    })
  }
}