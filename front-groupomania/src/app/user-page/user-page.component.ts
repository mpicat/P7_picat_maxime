import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private service: ApiserviceService, private router: Router, private route: ActivatedRoute) { }

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
      return this.user;
    });
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
        this.modifyForm.reset();
        window.location.reload();
      });
    }
    // garder valeur name origine
    else if(!name && email) {
      this.service.modifyUser(userId, this.user.name, email).subscribe((res) => {
        this.modifyForm.reset();
        window.location.reload();
      });
    }
    else {
      this.service.modifyUser(userId, name, email).subscribe((res) => {
        this.modifyForm.reset();
        window.location.reload();
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

}
