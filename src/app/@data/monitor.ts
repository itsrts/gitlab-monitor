import { Injectable } from '@angular/core';

export interface Gitlab {
    name: String;
    url: String;
}

export interface User {
    id: Number;
    name: String;
    username: String;
    avatar_url: String;
    web_url: String;
    state: String;
    private_token: String;
    auth_code: String;
}

@Injectable({
    providedIn: 'root'
})
export class Monitor {

    gitlab: Gitlab;
    user: User;

    constructor() {
        this.gitlab = {
            url: '',
            name: ''
        };
        this.user = {
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

    public getUser(): User {
        return this.user;
    }

}

