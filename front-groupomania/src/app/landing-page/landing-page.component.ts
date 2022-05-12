import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  userForm: any;
  loginError = false;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  };

  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }


  // login user
  onLogin() {
    const val = this.userForm.value;
    if(val.email && val.password) {
      this.service.login(val.email, val.password).subscribe((res) => {
        console.log('Vous êtes correctement connecté');
        this.onContinue();
      }, err => {
        this.loginError = true;
      });
    } else {
      alert('Tous les champs sont requis !')
    }
  };

  // continuer vers l'application une fois correctement identifié
  onContinue(): void {
    this.router.navigateByUrl('groupomania');
  }
};
