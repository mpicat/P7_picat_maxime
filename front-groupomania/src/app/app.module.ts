import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiserviceService } from './services/apiservice.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { GroupomaniaPageComponent } from './groupomania-page/groupomania-page.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { HeaderComponent } from './header/header.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { PostComponent } from './post/post.component';
import { UserPageComponent } from './user-page/user-page.component';
import { CommentComponent } from './comment/comment.component';
import { SingleCommentComponent } from './single-comment/single-comment.component';
import { CreateCommentComponent } from './create-comment/create-comment.component'


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SignupPageComponent,
    GroupomaniaPageComponent,
    HeaderComponent,
    CreatePostComponent,
    SinglePostComponent,
    PostComponent,
    UserPageComponent,
    CommentComponent,
    SingleCommentComponent,
    CreateCommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'fr-FR'
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  },
  ApiserviceService],
  bootstrap: [AppComponent]
})
export class AppModule  { 
  constructor() {
    registerLocaleData(fr.default);
  }
}
