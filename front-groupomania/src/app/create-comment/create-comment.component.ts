import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
// allow to send a data to a parent
import { Output, EventEmitter } from '@angular/core';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {
  commentForm: any;
  url!: String | ArrayBuffer | null;
  image!: string;

  // allow to send a data to a parent
  @Output() newCommentEvent = new EventEmitter<Comment>();

  // allow to communicate with parent : way parent to child
  @Input() post!: Post;

  constructor(private service: ApiserviceService) { }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      content: new FormControl(''),
      media: new FormControl('')
    });
  }

  get content() { return this.commentForm.get('content'); }
  get media() { return this.commentForm.get('media'); }

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

  onComment(){
    const val = this.commentForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const postId = this.post.postId;
    const content = val.content;
    const userName = localStorage.getItem("name_user");

    let commentData = {
      postId: postId,
      userId: userId,
      content: content,
      userName: userName
    };

    let formData = new FormData();

    // comment only text
    if(content && !this.image) {
      this.service.createComment(postId, userId, content, userName, null).subscribe((res) => {
        this.commentForm.reset();
        this.url = "";
        this.newCommentEvent.emit(res.data);
        this.post.comments.push({ userId: userId })
      });
    }
    // comment text + image
    else {
      formData.append('comment', JSON.stringify(commentData));
      formData.append('image', this.image[0]);
      this.service.createComment(null, null, null, null, formData).subscribe((res) => {
        this.commentForm.reset();
        this.url = "";
        this.newCommentEvent.emit(res.data);
      });
    }
  }
}
