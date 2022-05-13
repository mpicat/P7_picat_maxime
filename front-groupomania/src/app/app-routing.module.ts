import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodSignupComponent } from './good-signup/good-signup.component';
import { GroupomaniaPageComponent } from './groupomania-page/groupomania-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { SingleCommentComponent } from './single-comment/single-comment.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { UserPageComponent } from './user-page/user-page.component';
import { VerifyMailComponent } from './verify-mail/verify-mail.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'groupomania', component: GroupomaniaPageComponent },
  { path: 'signup', component: SignupPageComponent},
  { path: 'groupomania/post/:id', component: SinglePostComponent},
  { path: 'groupomania/user/:id', component: UserPageComponent},
  { path: 'groupomania/comment/:id', component: SingleCommentComponent},
  { path: 'good-signup', component: GoodSignupComponent},
  { path: 'api/auth/verify/:confirmationToken', component: VerifyMailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
