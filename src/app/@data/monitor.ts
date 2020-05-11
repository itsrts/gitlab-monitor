import { Injectable } from '@angular/core';
import { LocalStorageService } from './storage';

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

    constructor(private localStorage: LocalStorageService) {
        this.gitlab = {
            url: 'https://motorcode.concirrusquest.com',
            name: 'QuestAutomotive'
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

    public isLoggedIn(): boolean {
        return this.getUser().auth_code.length > 0;
    }

    public save() {
        this.localStorage.storeOnLocalStorage("gitlab", this.gitlab);
    }

}

