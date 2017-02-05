import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {UploadVerificationPage} from "../upload-verification/upload-verification";

@Component({
    selector: 'page-send-email',
    templateUrl: 'send-email.html'
})
export class SendEmailPage {
    heareeFirstName: string;
    heareeLastName: string;
    heareeAddr: string;
    heareeEmail: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.heareeFirstName = "";
        this.heareeLastName = "";
        this.heareeAddr = "";
        this.heareeEmail = "";
    }

    sendForm() {
        this.navCtrl.push(UploadVerificationPage, {
            method: "email",
            address: this.heareeAddr,
            firstName: this.heareeFirstName,
            lastName: this.heareeLastName,
            email: this.heareeEmail
        });
    }

}
