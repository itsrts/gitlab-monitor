import { Injectable } from '@angular/core';

import { Server } from "./server";
import { Observable, Subscriber } from 'rxjs';

let projectObservers: Subscriber<{}>[] = [];
let userObservers: Subscriber<{}>[] = [];
let mrObservers: Subscriber<{}>[] = [];
let mrDiscussionObservers: Subscriber<{}>[] = [];
let commitObservers: Subscriber<{}>[] = [];

let allProjects: {} = {};
let allUsers: {} = {};
let allMRs: {} = {};
let allMrDiscussions: {} = {};
let allCommits: {} = {};

const projects = new Observable((observer:Subscriber<{}>) => {
    projectObservers.push(observer);
});

const users = new Observable((observer:Subscriber<{}>) => {
    userObservers.push(observer);
});

const mergeRequests = new Observable((observer:Subscriber<{}>) => {
    mrObservers.push(observer);
});

const mrDiscussions = new Observable((observer:Subscriber<{}>) => {
    mrDiscussionObservers.push(observer);
});

const commits = new Observable((observer:Subscriber<{}>) => {
    commitObservers.push(observer);
});

@Injectable({
    providedIn: 'root'
})
export class Events {

    projects: Observable<{}>;
    users: Observable<{}>;
    mergeRequests: Observable<{}>;
    mrDiscussions: Observable<{}>;
    commits: Observable<{}>;

    constructor(private server: Server) {
        this.projects = projects;
        this.users = users;
        this.mergeRequests = mergeRequests;
        this.mrDiscussions = mrDiscussions;
        this.commits = commits;
    }

    refreshProjects(page = 1) {
        this.server.getProjects(page).subscribe((data:[]) => {
            if(data && data.length > 0) {
                data.forEach(d => {
                    let id = d['id'];
                    allProjects[id] = d;
                    this.getMergeRequests(id);
                });
                projectObservers.forEach(o => {
                    o.next(allProjects);
                });
                this.refreshProjects(page+1);
            }
        });
    }

    getMergeRequests(projectId) {
        this.server.getMergeRequests(projectId).subscribe((data: []) => {
            allMRs[projectId] = data;
            if(data && data.length > 0) {
                mrObservers.forEach(o => {
                    o.next(allMRs);
                });
            }
        });
    }

    refreshDiscussions() {
        Object.keys(allMRs).forEach(projectId => {
            allMRs[projectId].forEach(mr => {
                this.getMergeRequestsDiscussions(projectId, mr.iid);
            });
        });
    }

    getCommits(projectId) {
        this.server.getCommits(projectId).subscribe((data: []) => {
            allCommits[projectId] = data;
            if(data && data.length > 0) {
                mrObservers.forEach(o => {
                    o.next(allCommits);
                });
            }
        });
    }

    getMergeRequestsDiscussions(projectId, mrId) {
        this.server.getDiscussions(projectId, mrId).subscribe((data: []) => {
            allMrDiscussions[mrId] = data;
            if(data && data.length > 0) {
                mrDiscussionObservers.forEach(o => {
                    o.next(allMrDiscussions);
                });
            }
        });
    }

    refreshUsers(page = 1) {
        this.server.getUsers(page).subscribe((data:[]) => {
            if(data && data.length > 0) {
                data.forEach(d => {
                    let id = d['id'];
                    if(d['state'] == 'active') allUsers[id] = d;
                });
                userObservers.forEach(o => {
                    o.next(allUsers);
                });
                this.refreshUsers(page+1);
            }
        });
    }



}

