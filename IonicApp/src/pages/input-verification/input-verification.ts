import {Component} from "@angular/core";
import {UploadVerificationPage} from "../upload-verification/upload-verification";
import {NavController, NavParams} from "ionic-angular";

declare var prepareCanvas: any;
declare var canvas: any;

@Component({
    templateUrl: 'input-verification.html'
})
export class InputVerificationPage {
    heareeFirstName: string;
    heareeLastName: string;
    heareeAddr: string;
    comments: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.heareeFirstName = this.navParams.get('firstName');
        this.heareeLastName = this.navParams.get('lastName');
        this.heareeAddr = this.navParams.get('address');
        this.comments = this.navParams.get('comments');
    }

    uploadVerification() {

        this.navCtrl.setRoot(UploadVerificationPage, {
            method: "signature",
            firstName: this.heareeFirstName,
            lastName: this.heareeLastName,
            address: this.heareeAddr,
            comments: this.comments,
            verificationData: canvas.toDataURL(),
        });
    }

    ionViewWillEnter() {
        prepareCanvas();
    }
}

