import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  userForm: any;
  mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = "^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$";
  createError = false;

  constructor(private service: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', Validators.pattern(this.mailPattern)),
      password: new FormControl('', Validators.pattern(this.passwordPattern)),
      passwordVerif: new FormControl('', Validators.pattern(this.passwordPattern))
    });
  };

  get name() { return this.userForm.get('name'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get passwordVerif() { return this.userForm.get('passwordVerif'); }
  

  // create new user
  userSignup() {
    if(this.userForm.valid) {
      this.service.signup(this.userForm.value).subscribe((res) => {
        this.userForm.reset();
        this.onGoodSignup();
        this.createError = false;
      }, (err) => this.createError = true);
    }
    else {
      alert('Tous les champs sont requis !')
    };
  };

  // page correctement inscrit
  onGoodSignup(): void {
    this.router.navigateByUrl('good-signup');
  }

  // retour à l'accueil
  onLanding(): void {
    this.router.navigateByUrl('');
  }
}
