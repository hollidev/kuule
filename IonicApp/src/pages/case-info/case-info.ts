import {Component} from "@angular/core";
import {PresentItemsPage} from "../present-items/present-items";
import {NavController, NavParams, LoadingController, AlertController} from "ionic-angular";
import {UserAttachmentsPage} from "../user-attachments/user-attachments";
import {CaseData} from "../../providers/case-data";
import {Storage} from "@ionic/storage";

@Component({
    templateUrl: 'case-info.html'
})
export class CaseInfoPage {
    caseName: string;
    attachmentCount: number;
    notes: any;
    hearees: any;
    heardHearees: any;
    unheardHearees: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public permitCase: CaseData, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage) {

        this.caseName = "Lupa-asia " + navParams.get('case');

        this.notes = {};
        storage.get("case" + navParams.get('case')).then((val) => {
            if (val != null && val.length > 0) {
                this.caseName = val;
            }
        });

        storage.get("comments").then((val) => {
            if (val != null) {
                this.notes = val;
            }
        });

        this.heardHearees = [];
        this.unheardHearees = [];

        this.loadHearees(this.caseName);
    }

    ionViewWillEnter() {
        this.storage.get('latokuja-9.attachments').then((val) => {
            if (val != null) {
                this.attachmentCount = val.length
            }
            else {
                this.attachmentCount = 0;
            }
        });
    }

    present(caseid: string) {
        let loading = this.loadingCtrl.create({
            'content': 'Ladataan...'
        });
        loading.present()
        this.permitCase.fetchData("latokuja-9").then(() => {
            loading.dismissAll();
            this.navCtrl.push(PresentItemsPage);
        });
    }

    loadHearees(caseid: string) {
        let loading = this.loadingCtrl.create({
            'content': 'Ladataan...'
        });
        loading.present();
        this.permitCase.fetchHeareeData("latokuja-9").then(() => {
            loading.dismissAll();
            this.hearees = this.permitCase.heareeData;

            for (var hearee of this.hearees) {
                if (hearee.heard)
                    this.heardHearees.push(hearee);
                else if (hearee.heard == false)
                    this.unheardHearees.push(hearee);
            }
        });
    }

    changeName() {
        var namePrompt = this.alertCtrl.create({
            title: "Uusi nimi",
            message: "Syötä uusi nimi hankkeelle",
            inputs: [
                {name: 'name', placeholder: this.caseName},
            ],
            buttons: [
                {
                    text: 'Peruuta',
                    handler: data => {
                    }
                },
                {
                    text: 'Tallenna',
                    handler: data => {
                        console.log(data);
                        this.storage.set("case" + this.navParams.get('case'), data.name);
                        this.caseName = data.name;
                    }
                }
            ]
        });
        namePrompt.present();
    }

    userAttachments() {
        this.navCtrl.push(UserAttachmentsPage);
    }
}
