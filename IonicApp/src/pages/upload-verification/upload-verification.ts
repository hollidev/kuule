import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {PresentItemsPage} from "../present-items/present-items";
import {Http} from "@angular/http";

@Component({
    templateUrl: 'upload-verification.html'
})
export class UploadVerificationPage {
    data: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        this.data = {};
        this.http = http;

        if (this.navParams.get('method') == "email")
            this.sendEmail();
        else
            this.uploadData();

    }

    backToPresentItems() {
        this.navCtrl.setRoot(PresentItemsPage);
    }

    uploadData() {
        var hearee = {
            firstName: this.navParams.get('firstName'),
            lastName: this.navParams.get('lastName'),
            address: this.navParams.get('address'),
            caseId: "demo"
        };

        var data = JSON.stringify({
            hearee: JSON.stringify(hearee),
            method: this.navParams.get('method'),
            comments: this.navParams.get('comments'),
            data: this.navParams.get('verificationData'),
            caseId: "demo"
        });

        var url = 'http://holli.kapsi.fi/api/verification-data';

        this.http.post(url, data)
            .subscribe(data => {
                this.data.response = data.toString();
            }, error => {
                console.error(error);
            });
    }

    sendEmail() {
        var hearee = {
            firstName: this.navParams.get('firstName'),
            lastName: this.navParams.get('lastName'),
            address: this.navParams.get('address'),
            caseId: "demo"
        };

        var data = JSON.stringify({
            hearee: JSON.stringify(hearee),
            emailAddress: this.navParams.get('email')
        });

        var url = 'http://holli.kapsi.fi/api/send-email';

        this.http.post(url, data)
            .subscribe(data => {
                this.data.response = data.toString();
            }, error => {
                console.error(error);
            });
    }

}
