import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

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
  login(email:string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {email, password}).pipe(
      // tap allows to do extra effects in observable
      tap((res: any) => {
        localStorage.setItem('id_token', res.token);
        localStorage.setItem('id_user', res.userId);
        localStorage.setItem('name_user', res.name);
      })
    );
  }

  // delete User
  deleteUser(userId: any): Observable<any> {
    let ids = userId;
    return this.http.delete(`${this.apiUrl}/auth/delete/${ids}`).pipe(
      // tap allows to do extra effects in observable
      tap((res: any) => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('id_user');
        localStorage.removeItem('name_user');
      })
    );
  }

  // modify User
  modifyUser(userId: any, name: any, email: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/modify`, {userId, name, email});
  }

  // logout User
  logout(id: any): Observable<any> {
    let ids = id;
    console.log(ids);
    return this.http.get(`${this.apiUrl}/auth/logout/${ids}`).pipe(
      // tap allows to do extra effects in observable
      tap((res: any) => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('id_user');
        localStorage.removeItem('name_user');
      })
    );
  }

  // récupération d'un user
  getOneUser(userId: any): Observable<any> {
    let ids = userId;
    return this.http.get(`${this.apiUrl}/auth/${ids}`);
  }


  // ROUTES POSTS

  // récupération de tous les posts
  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  // récupération d'un post
  getOnePost(id: any): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/posts/${ids}`);
  }

  // création d'un post
  createPost(userId: any, content: any, userName:any, formData: any): Observable<any> {
    if (formData == null) {
      return this.http.post(`${this.apiUrl}/posts`, {userId, content, userName});
    }
    else {
      return this.http.post(`${this.apiUrl}/posts`, formData);
    }
  }

  // suppression d'un post
  deletePost(postId: any): Observable<any> {
    let ids = postId;
    return this.http.delete(`${this.apiUrl}/posts/${ids}`);
  }

  // modification d'un post
  modifyPost(postId: any, userId: any, content: any, formData: any): Observable<any> {
    let ids = postId;
    if (formData == null) {
      return this.http.put(`${this.apiUrl}/posts/${ids}`, {userId, content});
    }
    else {
      return this.http.put(`${this.apiUrl}/posts/${ids}`, formData);
    }
  }

  // modification du nom user de tous ses posts
  modifyPostsUser(userId: any, userName: any): Observable<any> {
    let ids = userId;
    return this.http.put(`${this.apiUrl}/posts/all/${ids}`, {userId, userName});
  }

  // like et dislike d'un post
  likePost(postId: any, userId: any, like: any): Observable<any> {
    let ids = postId;
    return this.http.post(`${this.apiUrl}/posts/${ids}/like`, {userId, like});
  }

  // ROUTES COMMENT

  // récupération de tous les comments
  getAllComments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments`);
  }

  // récupération de tous les comments d'un Post
  getAllCommentsPost(postId: any): Observable<any> {
    let ids = postId;
    return this.http.get(`${this.apiUrl}/comments/all/${ids}`);
  }

  // récupération d'un comment
  getOneComment(id: any): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/comments/${ids}`);
  }

  // création d'un comment
  createComment(postId:any, userId: any, content: any, userName: any, formData: any): Observable<any> {
    if (formData == null) {
      return this.http.post(`${this.apiUrl}/comments`, {postId, userId, content, userName});
    }
    else {
      return this.http.post(`${this.apiUrl}/comments`, formData);
    }
  }

  // suppression d'un comment
  deleteComment(id: any): Observable<any> {
    let ids = id;
    return this.http.delete(`${this.apiUrl}/comments/${ids}`);
  }

  // modification d'un comment
  modifyComment(commentId: any, userId: any, content: any, formData: any): Observable<any> {
    let ids = commentId;
    if (formData == null) {
      return this.http.put(`${this.apiUrl}/comments/${ids}`, {userId, content});
    }
    else {
      return this.http.put(`${this.apiUrl}/comments/${ids}`, formData);
    }
  }

  // like et dislike d'un comment
  likeComment(commentId: any, userId: any, like: any): Observable<any> {
    let ids = commentId;
    return this.http.post(`${this.apiUrl}/comments/${ids}/like`, {userId, like});
  }

}
