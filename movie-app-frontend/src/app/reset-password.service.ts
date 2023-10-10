// reset-password.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private resetPasswordUrl = 'http://localhost:8000/auth/users/reset_password/';
  private resetPasswordConfirmUrl = 'http://localhost:8000/auth/users/reset_password_confirm/';
  constructor(private http: HttpClient) {}
  


  resetPasswordConfirm(uid: string, token: string, password: string, repeatPassword: string): Observable<any> {
    const resetData = { uid: uid, token: token, new_password: password, re_new_password:repeatPassword };
    console.log(resetData);
    return this.http.post(this.resetPasswordConfirmUrl, resetData);
  }

  resetPassword(email: string) {
    const requestBody = { email };
    console.log(requestBody);
    return this.http.post(this.resetPasswordUrl, requestBody);
  }
}
