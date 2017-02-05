import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

/*
   Generated class for the CaseData provider.

   See https://angular.io/docs/ts/latest/guide/dependency-injection.html
   for more info on providers and Angular 2 DI.
 */
@Injectable()
export class CaseData {
    caseData: any;
    switchTo: any;
    heareeData: any;

    constructor(public http: Http, public storage: Storage) {
        this.switchTo = -1;
    }

    fetchData(casename: string) {
        if(Network.connection === "none") {
            return this.storage.get(casename).then((val) => {
                this.caseData = val;
                return 1;
            }).catch((err) => {
                alert("Oispa internet");
                return -1;
            });
        }
        else {
            var url = 'http://solita.then.fi/json/'+casename+".json";
            return this.http.get(url).toPromise().then((res) => {
                this.caseData = res.json();
                this.storage.set(casename, res.json());
                return 1; // Need to return _something_
            })
            .catch((err) => {
                alert("Lataus epäonnistui");
                return -1;
            });

        }
    }

    fetchHeareeData(casename: string) {
        if(Network.connection === "none") {
            return this.storage.get(casename + 'Hearees').then((val) => {
                this.heareeData = val;
                return 1;
            }).catch((err) => {
                alert("Oispa internet");
                return -1;
            });
        }
        else {
            var url = 'http://holli.kapsi.fi/api/case-data/demo/hearees';
            return this.http.get(url).toPromise().then((res) => {
                this.heareeData = res.json();
                this.storage.set(casename + 'Hearees', res.json());
                return 1; // Need to return _something_
            })
            .catch((err) => {
                alert("Lataus epäonnistui");
                return -1;
            });

        }
    }

    getData() {
        return this.caseData;
    }

    getHearees() {
        return this.heareeData;
    }

    getSwitchTo() {
        var ret = this.switchTo;
        this.switchTo = -1;
        return ret;
    }

    setSwitchTo(item) {
        this.switchTo = item;
    }

}
