import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JsonContentTypeInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     console.log(req);
     if(req.url.indexOf('/api/') > -1){
        req = req.clone({
            setHeaders: {
                'Content-type': 'application/json'
            }
        });
     }
    return next.handle(req);
    }
}