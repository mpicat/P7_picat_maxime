import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  user!: User;
  userFound: any;
  modifyForm: any;
  deleteForm: any;
  deleteError = false;
  mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  changePossible = false;

  constructor(private service: ApiserviceService, private router: Router, private route: ActivatedRoute) { }
  readDataPosts!: Post[];
  reverseReadDataPosts: Array<any> = [];

  ngOnInit(): void {
    this.getNameUser();
    this.modifyForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', Validators.pattern(this.mailPattern)),
    });
    this.deleteForm = new FormGroup({
      deleteName: new FormControl(''),
    });
    const userId = +this.route.snapshot.params['id'];
    this.oneUser(userId);
    this.allPosts();
  }

  get name() { return this.modifyForm.get('name'); }
  get email() { return this.modifyForm.get('email'); }
  get deleteName() { return this.deleteForm.get('deleteName'); }
  
  // récupération du nom du user de la session
  getNameUser() {
    const nameUser = localStorage.getItem("name_user");
    this.userFound = nameUser;
  }

  // One User
  oneUser(id: any) {
    this.service.getOneUser(id).subscribe((res) => {
      console.log(res);
      this.user = res;
      this.okToChange();
      return this.user;
    });
  }

  // able to modify/delete if good userId in localStorage
  okToChange() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    if (userId === this.user.user) {
      this.changePossible = true;
    } else {
      this.changePossible = false;
    }
  }

  // retour page de connexion
  onLanding(): void {
    this.router.navigateByUrl('');
  }

  // retour page d'accueil
  onContinue(): void {
    this.router.navigateByUrl('groupomania');
  }

  // modifier le user
  onModify() {
    const val = this.modifyForm.value;
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    const name = val.name;
    const email = val.email;

    if(name && !email) {
      // garder valeur email origine
      this.service.modifyUser(userId, name, this.user.email).subscribe((res) => {
        this.service.modifyPostsUser(userId, name).subscribe((res) => {
          this.modifyForm.reset();
          this.user.name = name;
          localStorage.setItem('name_user', name);
        });
      });
    }
    // garder valeur name origine
    else if(!name && email) {
      this.service.modifyUser(userId, this.user.name, email).subscribe((res) => {
        this.modifyForm.reset();
        this.user.email = email;
      });
    }
    else {
      this.service.modifyUser(userId, name, email).subscribe((res) => {
        this.service.modifyPostsUser(userId, name).subscribe((res) => {
          this.modifyForm.reset();
          this.user.name = name;
          this.user.email = email;
          localStorage.setItem('name_user', name);
        });
      });
    }
  }

  // supprimer le user
  onDelete(userId: any) {
    const val = this.deleteForm.value;
    if (val.deleteName === this.user.name) {
      this.service.deleteUser(userId).subscribe((res) => {
        console.log(`Utilisateur supprimé`);
        this.onLanding();
      })
    } else {
      this.deleteError = true;
    }
  }

  // tous les posts
  allPosts() {
    this.service.getAllPosts().subscribe((res) => {
      this.readDataPosts = res;
      console.log(res)
      // place les posts par ordre de création
      this.reverseReadDataPosts = this.readDataPosts.slice().reverse();
    });
  }

}
