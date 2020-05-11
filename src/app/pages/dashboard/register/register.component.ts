import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Monitor, Gitlab, Application, User } from '../../../@data/monitor';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Server } from '../../../@data/server';

@Component({
  selector: 'ngx-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements OnInit {

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  gitlab: Gitlab;
  application: Application;
  redirectUri: string;
  token: string;

  constructor(private fb: FormBuilder, private router:Router, private monitor: Monitor, 
    private http: HttpClient, private route: ActivatedRoute, private server: Server) {
  }

  ngOnInit() {
    this.gitlab = this.monitor.getGitlabConfig();
    this.application = this.monitor.getApplication();
    this.redirectUri = `${window.location.protocol}//${window.location.host}/register`;
    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
      thirdCtrl1: ['', Validators.required],
      thirdCtrl2: ['', Validators.required],
    });

    if(this.monitor.isValidApplication()) {
      let code = this.route.snapshot.queryParamMap.get('code');
      let url = `${this.gitlab.url}/oauth/token?client_id=${this.application.clientId}&client_secret=${this.application.clientSecret}&grant_type=authorization_code&redirect_uri=${this.redirectUri}&code=${code}`;
      // TODO : CORS issue
      this.http.post(url, {}).subscribe(data => {
        console.log(data);
      });
    }
  }

  authenticateUser() {
    this.server.getAuthenticatedUser(this.token).subscribe((user: User) => {
      this.monitor.user = user;
      this.monitor.user.private_token = this.token;
      this.monitor.save();
      this.goNow();
    });
  }

  goNow() {
    this.router.navigate(['/']);
  }

  oAuthLogin() {
    let url = `${this.gitlab.url}/oauth/authorize?client_id=${this.application.clientId}&redirect_uri=${this.redirectUri}&response_type=code&state=123&scope=read_user+api+read_repository+openid+profile+email`;
    // this.monitor.save();
    window.location.href = url;
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }
}
