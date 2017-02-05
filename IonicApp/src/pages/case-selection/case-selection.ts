import {Component} from "@angular/core";
import {PresentItemsPage} from "../present-items/present-items";
import {CaseInfoPage} from "../case-info/case-info";
import {NavController, NavParams, LoadingController, MenuController} from "ionic-angular";
import {CaseData} from "../../providers/case-data";
import {Network} from "ionic-native";
import {Storage} from "@ionic/storage";

@Component({
    templateUrl: 'case-selection.html',
})
export class CaseSelectionPage {
    conntype: string;
    caseName1: string;
    caseName2: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public permitCase: CaseData, public loadingCtrl: LoadingController, public storage: Storage, public menuCtrl: MenuController) {
        this.caseName1 = "Lupa-asia 1"
        this.caseName2 = "Lupa-asia 2"
        this.conntype = Network.connection;
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true, "precases");
        this.storage.get("case1").then((val) => {
            if (val != null && val.length > 0) {
                this.caseName1 = val;
            }
        })
        this.storage.get("case2").then((val) => {
            if (val != null && val.length > 0) {
                this.caseName2 = val;
            }
        });
    }

    info(caseid: string) {
        this.navCtrl.push(CaseInfoPage, {case: caseid});
    }

    // täältäkin voi siirtyä PresentItemsPagelle
    selectCase(caseid: string) {

        let loading = this.loadingCtrl.create({
            'content': 'Ladataan...'
        });
        loading.present()
        var l1 = this.permitCase.fetchData("latokuja-9");
        var l2 = this.permitCase.fetchHeareeData("latokuja-9");
        Promise.all([l1, l2]).then(() => {
            loading.dismissAll();
            this.navCtrl.push(PresentItemsPage);
        });
    }
}
