import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Monitor, Gitlab } from '../../../@data/monitor';
import { Router } from '@angular/router';

const clientSecret = '5989a393cec762bb7b505b08dc1b1f98b70cda4b97c7c2c2bb3c203023460986';
const clientId = 'e81bcadb8e976f6d22f89edd2da3a293bd868abea5864864b905b409a0ce7f40';

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

  constructor(private fb: FormBuilder, private router:Router, private monitor: Monitor) {
  }

  ngOnInit() {
    this.gitlab = this.monitor.getGitlabConfig();
    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  }

  goNow() {
    this.router.navigate(['/']);
  }

  oAuthLogin() {
    let url = `${this.gitlab.url}/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:4200/pages/register&response_type=code&state=123&scope=read_user+api+read_repository+openid+profile+email`;
    // https://motorcode.concirrusquest.com/oauth/authorize?client_id=584b597b46293f87d4e939f8031b1bbc38b29ca84f55c31f761e90ffcd7704b7&redirect_uri=http://localhost:4200/ok&response_type=code&state=123&scope=read_user+api+read_repository+write_repository+openid+profile+email
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
