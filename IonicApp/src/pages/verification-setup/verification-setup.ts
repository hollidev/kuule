import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {InputVerificationPage} from "../input-verification/input-verification";
import {CameraVerificationPage} from "../camera-verification/camera-verification";
import {Storage} from "@ionic/storage";

@Component({
    templateUrl: 'verification-setup.html'
})
export class VerificationSetupPage {
    method: string;
    notes: string;
    hasNotes: boolean;
    selectedHearee: any;
    heareeFirstName: string;
    heareeLastName: string;
    heareeAddr: string;
    hearees: any;
    unheardHearees: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
        this.hasNotes = false;
        this.notes = "";
        this.heareeFirstName = "";
        this.heareeLastName = "";
        this.heareeAddr = "";
        this.unheardHearees = [];

        this.storage.get("latokuja-9" + "Hearees").then((hearees) => {
            if (hearees.length > 0 && hearees != null) {
                this.hearees = hearees;

                for (var i = 0; i < hearees.length; i++) {
                    if (hearees[i].heard == false)
                        this.unheardHearees.push(hearees[i]);
                }
            }
        });
    }

    heareeSelected() {
        var hearee = this.findById(this.selectedHearee);

        this.heareeFirstName = hearee.firstName;
        this.heareeLastName = hearee.lastName;
        this.heareeAddr = hearee.address;
    }

    findById(id) {
        for (var i = 0; i < this.unheardHearees.length; i++) {
            if (this.unheardHearees[i]._id == id) {
                return this.unheardHearees[i];
            }
        }
    }

    methodSelected(value) {
        if (this.hasNotes) {
            if (this.notes.length > 0) {
                this.storage.get("comments").then((val) => {
                    var storedComments = val;
                    if (storedComments == null) {
                        storedComments = {};
                    }
                    storedComments[this.heareeFirstName + ' ' + this.heareeLastName] = this.notes;
                    this.storage.set("comments", storedComments);
                });
            }
        }
        this.method = value;

        var page;

        if (value == "signature") {
            page = InputVerificationPage;
        }
        else if (value == "photo") {
            page = CameraVerificationPage;
        }

        this.navCtrl.push(page, {
            method: this.method,
            address: this.heareeAddr,
            comments: this.notes,
            firstName: this.heareeFirstName,
            lastName: this.heareeLastName
        });
    }
}
