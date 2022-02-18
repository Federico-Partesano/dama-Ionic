import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpClient, HttpParamsOptions, HttpHeaders } from '@angular/common/http';
import { from, Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { AuthService } from "../services/auth.service";
import { Credentials } from "src/models/credentials";

@Injectable()
export class Interceptor implements HttpInterceptor {

    basicRoutes = ['/matches', '/users','/chats'];
    basicRoutes2 = ['/users/login', '/users/signup'];

    constructor(private http: HttpClient, private auth: AuthService) { }
    

    baseHeader: ({accessToken, nickname}:{accessToken: string, nickname: string}) => HttpHeaders=({accessToken, nickname}:{accessToken: string, nickname: string}) => {
        return new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
        nickname: nickname
      })};


    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {  
        const { url, method } = req;


        return from(this.auth.getItemStorage<Credentials>('credentials')).pipe( switchMap (credentials =>{
            if(this.basicRoutes2.some(endpoint => url.includes(endpoint))) {
                return next.handle(req);
            }
            if(this.basicRoutes.some(endpoint => url.includes(endpoint))){
                console.log('interceptor')
                req = req.clone({ headers: this.baseHeader(credentials)});
            } 
            return next.handle(req);
        }))
    }
}

//   /feeds GET
// /feeds POST { message, imgUrl } auth: true
// /feeds/:id/comments POST { message } auth: true
// /feeds/:id/like POST { like: boolean } auth: true

// /signup POST (nickname, password }
// /login  POST (nickname, password } -> Bearer BEARER_ID




