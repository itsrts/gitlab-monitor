import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

    public storeOnLocalStorage(key: string, value): void {

        // get array of tasks from local storage
        let obj = this.storage.get(key) || {};
        // push new task to array
        obj = Object.assign(obj, value);
        // insert updated array to local storage
        this.storage.set(key, obj);
        console.log(this.storage.get(key) || 'Local storage is empty');
    }


    public getFromLocalStorage(key: string) {
        return this.storage.get(key) || undefined;
    }
}