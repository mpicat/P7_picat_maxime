import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  userFound: any;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.getNameUser();
  }

  // récupération du nom du user de la session
  getNameUser() {
    const nameUser = localStorage.getItem("name_user");
    this.userFound = nameUser;
  }

  // logout user
  onLogout() {
    const idUser = localStorage.getItem("id_user");
    this.service.logout(idUser).subscribe((res) => {
      console.log('Vous venez de vous déconnecter');
      this.onLanding();
    });
  };

  // retour page d'accueil
  onLanding(): void {
    this.router.navigateByUrl('');
  }

  // page de profil
  onUserPage(): void {
    const idUser = localStorage.getItem("id_user");
    this.router.navigateByUrl(`groupomania/user/${idUser}`);
  }
}
