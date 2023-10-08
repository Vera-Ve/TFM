// reset-password.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  constructor(private http: HttpClient) {}

  resetPassword(email: string, password: string): Observable<any> {
    const resetData = { email, new_password: password };
    return this.http.post('/auth/password/reset/', resetData);
  }
}
