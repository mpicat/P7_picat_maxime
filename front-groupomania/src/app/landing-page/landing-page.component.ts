import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private service: ApiserviceService, private router: Router) { }

  userForm: any;

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  };

  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }

  // login user
  userLogin() {
    if(this.userForm.valid) {
    this.service.login(this.userForm.value).subscribe((res) => {
      console.log('Vous êtes correctement connecté');
      this.service.setJwt(res.token);
      this.onContinue();
    });
    } else {
      alert('Tous les champs sont requis !')
    }
  };

  // lien vers page signup
  onSignup(): void {
    this.router.navigateByUrl('signup');
  }

  // continuer vers l'application une fois correctement identifié
  onContinue(): void {
    this.router.navigateByUrl('groupomania');
  }

};
