import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userFound!: string | null;
  adminFound!: string | null;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.getDataUser();
  }

  // récupération du nom et admin du user de la session
  getDataUser() {
    const nameUser = localStorage.getItem("name_user");
    const adminUser = localStorage.getItem("admin_user");
    this.userFound = nameUser;
    this.adminFound = adminUser;
  }

  // retour page de posts
  onContinue(): void {
    this.router.navigateByUrl('groupomania');
  }

  // page de profil
  onUserPage(): void {
    const idUser = localStorage.getItem("id_user");
    this.router.navigateByUrl(`groupomania/user/${idUser}`);
  }

  // logout user
  onLogout() {
    const idUser = localStorage.getItem("id_user");
    const userId = Number(idUser);
    this.service.logout(userId).subscribe((res) => {
      console.log('Vous venez de vous déconnecter');
      this.onLanding();
    });
  };

  // retour page d'accueil
  onLanding(): void {
    this.router.navigateByUrl('');
  }
}
