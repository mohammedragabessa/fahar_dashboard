/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  usermail : string = ""
  userpassword : string = ""
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;
  // adminUser:{} = {'username':'admin','mobile':'123456789','email':'admin@admin.com'}

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
  }


  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    if(this.usermail == "admin" && this.userpassword == "123456789"){
    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.router.navigate(['/pages/dashboard']);
        this.messages = result.getMessages();

      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
     
      this.cd.detectChanges();
    });

    }
    else {
      this.router.navigate(['/pages/dashboard']);

      // this.submitted = false;
      // this.errors =["Credentials Not Valid"]
      this.cd.detectChanges();
    }

  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}