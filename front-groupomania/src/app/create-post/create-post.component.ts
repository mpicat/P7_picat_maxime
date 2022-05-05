import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  postForm: any;
  formData: any;
  url: any;
  selectedFile: any;
  postData: any;
  image: any;

  constructor(private service: ApiserviceService) {}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      content: new FormControl('')
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

  onPost(){
    const val = this.postForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const content = val.content;

    let postData = {
      userId: userId,
      content: content
    };

    let formData = new FormData();

    // case of only text
    if(content && !this.image) {
      this.service.createPost(userId, content, null).subscribe((res) => {
        this.postForm.reset();
        window.location.reload();
      });
    }
    // case of text + image
    else if(this.image) {
      formData.append('post', JSON.stringify(postData));
      formData.append('image', this.image[0]);
      this.service.createPost(null, null, formData).subscribe((res) => {
        this.postForm.reset();
        window.location.reload();
      });
    }
    else {
      alert('Tous les champs sont requis !')
      };
    }
}
