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
  verify(confirmationToken: string): Observable<any> {
    let confirmToken = confirmationToken;
    return this.http.get(`${this.apiUrl}/auth/verify/${confirmToken}`)
  }

  // login User
  login(email:string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {email, password}).pipe(
      // tap allows to do extra effects in observable
      tap((res: any) => {
        localStorage.setItem('id_token', res.token);
        localStorage.setItem('id_user', res.userId);
        localStorage.setItem('name_user', res.name);
        localStorage.setItem('admin_user', res.admin);
      })
    );
  }

  // delete User
  deleteUser(userId: number): Observable<any> {
    let ids = userId;
    return this.http.delete(`${this.apiUrl}/auth/delete/${ids}`).pipe(
      // tap allows to do extra effects in observable
      tap((res: any) => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('id_user');
        localStorage.removeItem('name_user');
        localStorage.removeItem('admin_user');
      })
    );
  }

  // modify User
  modifyUser(userId: number, name: string, email: string): Observable<any> {
    let ids = userId;
    return this.http.put(`${this.apiUrl}/auth/modify/${ids}`, {name, email});
  }

  // logout User
  logout(id: number | null): Observable<any> {
    let ids = id;
    console.log(ids);
    return this.http.get(`${this.apiUrl}/auth/logout/${ids}`).pipe(
      // tap allows to do extra effects in observable
      tap((res: any) => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('id_user');
        localStorage.removeItem('name_user');
        localStorage.removeItem('admin_user');
      })
    );
  }

  // r??cup??ration d'un user
  getOneUser(userId: number): Observable<any> {
    let ids = userId;
    return this.http.get(`${this.apiUrl}/auth/${ids}`);
  }


  // ROUTES POSTS

  // r??cup??ration de tous les posts
  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  // r??cup??ration d'un post
  getOnePost(id: number): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/posts/${ids}`);
  }

  // cr??ation d'un post
  createPost(userId: number | null, content: string | null, userName: string | null, formData: any): Observable<any> {
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
  modifyPost(postId: number, userId: number | null, content: string | null, formData: any): Observable<any> {
    let ids = postId;
    if (formData == null) {
      return this.http.put(`${this.apiUrl}/posts/${ids}`, {userId, content});
    }
    else {
      return this.http.put(`${this.apiUrl}/posts/${ids}`, formData);
    }
  }

  // modification du nom user de tous ses posts
  modifyPostsUser(userId: number, userName: string): Observable<any> {
    let ids = userId;
    return this.http.put(`${this.apiUrl}/posts/all/${ids}`, {userName});
  }

  // like d'un post
  likePost(postId: number, userId: number, like: string): Observable<any> {
    let ids = postId;
    return this.http.post(`${this.apiUrl}/posts/${ids}/like`, {userId, like});
  }

  // modification du userId de tous les posts d'un user
  modifyLikePostsUser(userId: number): Observable<any> {
    let ids = userId;
    return this.http.put(`${this.apiUrl}/posts/likeposts/${ids}`, {userId: 0});
  }

  // ROUTES COMMENT

  // r??cup??ration de tous les comments
  getAllComments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments`);
  }

  // r??cup??ration de tous les comments d'un Post
  getAllCommentsPost(postId: number): Observable<any> {
    let ids = postId;
    return this.http.get(`${this.apiUrl}/comments/all/${ids}`);
  }

  // r??cup??ration d'un comment
  getOneComment(id: number): Observable<any> {
    let ids = id;
    return this.http.get(`${this.apiUrl}/comments/${ids}`);
  }

  // cr??ation d'un comment
  createComment(postId: number | null, userId: number | null, content: string | null, userName: string | null, formData: any): Observable<any> {
    if (formData == null) {
      return this.http.post(`${this.apiUrl}/comments`, {postId, userId, content, userName});
    }
    else {
      return this.http.post(`${this.apiUrl}/comments`, formData);
    }
  }

  // suppression d'un comment
  deleteComment(id: number): Observable<any> {
    let ids = id;
    return this.http.delete(`${this.apiUrl}/comments/${ids}`);
  }

  // modification d'un comment
  modifyComment(commentId: number, userId: number | null, content: string | null, formData: any): Observable<any> {
    let ids = commentId;
    if (formData == null) {
      return this.http.put(`${this.apiUrl}/comments/${ids}`, {userId, content});
    }
    else {
      return this.http.put(`${this.apiUrl}/comments/${ids}`, formData);
    }
  }

  // modification du nom user de tous ses comments
  modifyCommentsUser(userId: number, userName: string): Observable<any> {
    let ids = userId;
    return this.http.put(`${this.apiUrl}/comments/allcomments/${ids}`, {userName});
  }

  // like d'un comment
  likeComment(commentId: number, userId: number, like: string): Observable<any> {
    let ids = commentId;
    return this.http.post(`${this.apiUrl}/comments/${ids}/like`, {userId, like});
  }

  // modification du userId de tous les comments d'un user
  modifyLikeCommentsUser(userId: number): Observable<any> {
    let ids = userId;
    return this.http.put(`${this.apiUrl}/comments/likecomments/${ids}`, {userId: 0});
  }


}
