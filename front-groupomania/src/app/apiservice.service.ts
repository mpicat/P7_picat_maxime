import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

  // connect front and back
  apiUrl = 'http://localhost:3000/api';

  // TODO fill jwt at service-level
  jwt = '';

  setJwt(token: string): void {
    this.jwt = token;
  }
  getJwt(): string {
    return this.jwt;
  }

  // ROUTES USER

  // signup User
  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, data);
  }

  // verify mail User
  verify(confirmToken: any): Observable<any> {
    let confirmationToken = confirmToken;
    return this.http.get(`${this.apiUrl}/auth/verify/${confirmationToken}`)
  }

  // login User
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  // delete User
  deleteUser(id: any): Observable<any> {
    let ids = id;
    return this.http.delete(`${this.apiUrl}/auth/delete${ids}`);
  }

  // modify User
  modifyUser(data: any, id: any): Observable<any> {
    let ids = id;
    return this.http.put(`${this.apiUrl}/auth/modify/${ids}`, data);
  }

  // logout User
  logout(id: any): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/auth/logout/${ids}`);
  }


  // ROUTES POSTS

  // récupération de tous les posts
  // TODO use headers to pass the jwt => google "angular http client pass jwt token"
  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  // récupération d'un post
  getOnePost(id: any): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/posts/${ids}`);
  }

  // création d'un post
  createPost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, data);
  }

  // suppression d'un post
  deletePost(id: any): Observable<any> {
    let ids = id;
    return this.http.delete(`${this.apiUrl}/posts/${ids}`);
  }

  // modification d'un post
  // adapt the header if there is a pic
  modifyPost(data: any, id: any): Observable<any> {
    let ids = id;
    return this.http.put(`${this.apiUrl}/posts/${ids}`, data);
  }

  // like et dislike d'un post
  likePost(data: any, id:any): Observable<any> {
    let ids = id;
    return this.http.post(`${this.apiUrl}/posts/${ids}/like`, data);
  }

  // ROUTES COMMENT

  // récupération de tous les comments
  getAllComments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments`);
  }

  // récupération d'un comment
  getOneComment(id: any): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/comments/${ids}`);
  }

  // création d'un comment
  createComment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, data);
  }

  // suppression d'un comment
  deleteComment(id: any): Observable<any> {
    let ids = id;
    return this.http.delete(`${this.apiUrl}/comments/${ids}`);
  }

  // modification d'un comment
  modifyComment(data: any, id: any): Observable<any> {
    let ids = id;
    return this.http.put(`${this.apiUrl}/comments/${ids}`, data);
  }

  // like et dislike d'un comment
  likeComment(data: any, id:any): Observable<any> {
    let ids = id;
    return this.http.post(`${this.apiUrl}/comments/${ids}/like`, data);
  }

}
