import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupomaniaPageComponent } from './groupomania-page/groupomania-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'groupomania', component: GroupomaniaPageComponent },
  { path: 'signup', component: SignupPageComponent},
  { path: 'groupomania/post/:id', component: SinglePostComponent},
  { path: 'groupomania/user/:id', component: UserPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
