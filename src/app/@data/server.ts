import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Gitlab, User, Monitor } from "./monitor";

@Injectable({
    providedIn: 'root'
})
export class Server {

    user: User;
    gitlab: Gitlab;

    constructor(
        private monitor: Monitor,
        private http: HttpClient) {
        this.user = monitor.getUser();
        this.gitlab = monitor.getGitlabConfig();
    }

    getApiOpts() {
        return {
            headers: {
                Authorization: `Bearer ${this.user.auth_code}`
            }
        };
    }

    getProjects(page) {
        let url = `${this.gitlab.url}/api/v4/projects?page=${page}&per_page=20`;
        return this.http.get(url, this.getApiOpts());
    }

    getUsers(page) {
        let url = `${this.gitlab.url}/api/v4/users?page=${page}&per_page=20`;
        return this.http.get(url, this.getApiOpts());
    }

    getMergeRequests(projectId) {
        let url = `${this.gitlab.url}/api/v4/projects/${projectId}/merge_requests`;
        return this.http.get(url, this.getApiOpts());
    }

    getCommits(projectId) {
        let url = `${this.gitlab.url}/api/v4/projects/${projectId}/commits`;
        return this.http.get(url, this.getApiOpts());
    }

    getDiscussions(projectId, mrId) {
        let url = `${this.gitlab.url}/api/v4/projects/${projectId}/merge_requests/${mrId}/discussions`;
        return this.http.get(url, this.getApiOpts());
    }
}

