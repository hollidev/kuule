import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Camera} from "ionic-native";
import {Storage} from "@ionic/storage";

/*
 Generated class for the UserAttachments page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-user-attachments',
    templateUrl: 'user-attachments.html'
})
export class UserAttachmentsPage {

    attachments: Array<string>; // B64-encoded images, mostly jpegs?
    error: string;

    constructor(public navCtrl: NavController, public storage: Storage) {
        this.error = "";
        this.attachments = [];
        this.storage.get("latokuja-9.attachments").then((val) => {
            if (val != null) {
                this.attachments = val;
            }
        });
    }

    addAttachment() {
        var camOptions = {
            sourceType: 0, // Photo library
            destinationType: 0, // 0: Base64, 1: FileURL, 2: Native URL
            saveToPhotoAlbum: false,
        };
        Camera.getPicture(camOptions).then((imageData) => {
            var b64image = 'data:image/jpeg;base64,' + imageData;
            this.storage.set("latokuja-9.attachments", this.attachments);
        }, (err) => {
            alert(err);
            this.error = err;
        });
    }

    deleteAttachment(idx: number) {
        this.attachments.splice(idx, 1);
        this.storage.set("latokuja-9.attachments", this.attachments);
    }
}
