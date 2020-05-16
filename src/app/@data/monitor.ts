import { Injectable } from '@angular/core';
import { LocalStorageService } from './storage';

export interface Gitlab {
    name: string;
    url: string;
}

export interface Application {
    clientId: string;
    clientSecret: string;
}

export interface User {
    id: Number;
    name: string;
    username: string;
    avatar_url: string;
    web_url: string;
    state: string;
    private_token: string;
    auth_code: string;
}

@Injectable({
    providedIn: 'root'
})
export class Monitor {

    gitlab: Gitlab;
    application: Application;
    user: User;

    constructor(private localStorage: LocalStorageService) {
        this.gitlab = localStorage.getFromLocalStorage('gitlab') || {
            name: '',
            url: ''
        };
        this.application = localStorage.getFromLocalStorage('application') || {
            clientId: '',
            clientSecret: ''
        };
        this.user = localStorage.getFromLocalStorage('user') || {
            "id": 0,
            "name": "",
            "username": "",
            "state": "active",
            "avatar_url": "",
            "web_url": "",
            "private_token": "",
            "auth_code": ""
        };
    }

    public getGitlabConfig(): Gitlab {
        return this.gitlab;
    }

    public getApplication(): Application {
        return this.application;
    }

    public getUser(): User {
        return this.user;
    }

    public logout() {
        this.localStorage.deleteFromLocalStorage('gitlab');
        this.localStorage.deleteFromLocalStorage('application');
        this.localStorage.deleteFromLocalStorage('user');
    }

    public isLoggedIn(): boolean {
        return this.user.private_token.length > 0 ||
            this.user.auth_code.length > 0;
    }

    public isValidApplication(): boolean {
        return this.application.clientSecret.length > 0 &&
            this.application.clientId.length > 0;
    }


    public save() {
        this.localStorage.storeOnLocalStorage("gitlab", this.gitlab);
        this.localStorage.storeOnLocalStorage("application", this.application);
        this.localStorage.storeOnLocalStorage("user", this.user);
    }

}

