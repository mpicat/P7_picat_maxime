import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
// allow to send a data to a parent
import { Output, EventEmitter } from '@angular/core';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm: any;
  url: any;
  image: any;

  // allow to send a data to a parent
  @Output() newPostEvent = new EventEmitter<Post>();

  constructor(private service: ApiserviceService) {}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      content: new FormControl(''),
      media: new FormControl('')
    });
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

  get content() { return this.postForm.get('content'); }
  get media() { return this.postForm.get('media'); }

  onPost(){
    const val = this.postForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const content = val.content;
    const userName = localStorage.getItem("name_user");

    let postData = {
      userId: userId,
      content: content,
      userName: userName
    };

    let formData = new FormData();

    // case of only text
    if(content && !this.image) {
      this.service.createPost(userId, content, userName, null).subscribe((res) => {
        this.postForm.reset();
        this.url = "";
        this.newPostEvent.emit(res.data);
      });
    }
    // case of text + image
    else {
      formData.append('post', JSON.stringify(postData));
      formData.append('image', this.image[0]);
      this.service.createPost(null, null, null, formData).subscribe((res) => {
        this.postForm.reset();
        this.url = "";
        this.newPostEvent.emit(res.data);
      });
    }
}
}
