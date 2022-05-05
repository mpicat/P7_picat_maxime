import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {

  commentForm: any;
  image: any;
  url: any;

  constructor(private service: ApiserviceService) { }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      content: new FormControl(''),
      media: new FormControl('')
    })
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

  get content() { return this.commentForm.get('content'); }
  get media() { return this.commentForm.get('media'); }

  onComment(){
    const val = this.commentForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const content = val.content;

    let commentData = {
      userId: userId,
      content: content
    };

    let formData = new FormData();

    // case of only text
    if(content && !this.image) {
      this.service.createComment(userId, content, null).subscribe((res) => {
        this.commentForm.reset();
        window.location.reload();
      });
    }
    // case of text + image
    else if(this.image) {
      formData.append('post', JSON.stringify(commentData));
      formData.append('image', this.image[0]);
      this.service.createPost(null, null, formData).subscribe((res) => {
        this.commentForm.reset();
        window.location.reload();
      });
    }
    else {
      alert('Au moins un champ est requis !')
      };
    }

}
