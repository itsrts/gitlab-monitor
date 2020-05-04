import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'

export class PendingRequest {
    url: string;
    method: string;
    options: any;
    subscription: Subject<any>;

    constructor(url: string, method: string, options: any, subscription: Subject<any>) {
        this.url = url;
        this.method = method;
        this.options = options;
        this.subscription = subscription;
    }
}

let PARALLELISM = 20;

@Injectable()
export class BackendService {
    private requests$ = new Subject<any>();
    private queue: PendingRequest[] = [];

    constructor(private httpClient: HttpClient) {
        this.requests$.subscribe(request => this.execute(request));
    }

    /** Call this method to add your http request to queue */
    invoke(url, method, params, options) {
        return this.addRequestToQueue(url, method, params, options);
    }

    private execute(requestData: PendingRequest) {
        //One can enhance below method to fire post/put as well. (somehow .finally is not working for me)
        const req = this.httpClient.get(requestData.url, requestData.options)
            .subscribe(res => {
                const sub = requestData.subscription;
                sub.next(res);
                this.startNextRequest();
            });
    }

    private addRequestToQueue(url, method, params, options) {
        const sub = new Subject<any>();
        const request = new PendingRequest(url, method, options, sub);

        this.queue.push(request);
        if (this.queue.length <= PARALLELISM) {
            this.startNextRequest();
        }
        return sub;
    }

    private startNextRequest() {
        // get next request, if any.
        if (this.queue.length > 0) {
            this.execute(this.queue.shift());
        }
    }
}
