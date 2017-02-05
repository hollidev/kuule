import {Component} from "@angular/core";
import {UploadVerificationPage} from "../upload-verification/upload-verification";
import {NavController, NavParams} from "ionic-angular";
import {Camera} from "ionic-native";

/*
 Generated class for the CameraVerification page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'camera-verification.html'
})

export class CameraVerificationPage {
    b64image: string;
    error: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        var camOptions = {
            quality: 75,
            destinationType: 0, // 0: Base64
            saveToPhotoAlbum: false,
        };

        Camera.getPicture(camOptions).then((imageData) => {
            this.b64image = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            this.error = err;
        });
    }

    uploadVerification() {
        this.navCtrl.setRoot(UploadVerificationPage, {
            method: this.navParams.get("method"),
            firstName: this.navParams.get("firstName"),
            lastName: this.navParams.get("lastName"),
            comments: this.navParams.get("comments"),
            address: this.navParams.get("address"),
            verificationData: "placeholder"
        });
    }
}
