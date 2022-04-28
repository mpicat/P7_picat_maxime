import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-groupomania-page',
  templateUrl: './groupomania-page.component.html',
  styleUrls: ['./groupomania-page.component.scss']
})
export class GroupomaniaPageComponent implements OnInit {

  constructor(private service: ApiserviceService) { }

  postForm: any;
  readData: any;
  message: any;

  ngOnInit(): void {
    this.postForm = new FormGroup({
      content: new FormControl(''),
      media: new FormControl('')
    });
    this.getNameUser();
    this.allPosts();
  }

  get content() { return this.postForm.get('content'); }
  get media() { return this.postForm.get('media'); }

  // récupération du nom du user de la session
  getNameUser() {
    const idUser = localStorage.getItem("id_user");
    this.service.getOneUser(idUser).subscribe((res: any) => {
        this.message = `Bonjour ${res}`
      }
    )
  }

  // tous les posts
  allPosts() {
    this.service.getAllPosts().subscribe((res) => {
      console.log(res, 'res ==>');
      this.readData = res;
    });
  }

  // logout user
  onLogout() {
    const idUser = localStorage.getItem("id_user");
    this.service.logout(idUser).subscribe((res) => {
      console.log('Vous venez de vous déconnecter');
      // TO DO error CORS
    });
  };
}
