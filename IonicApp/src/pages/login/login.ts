import {Component} from "@angular/core";
import {CaseSelectionPage} from "../case-selection/case-selection";
import {LoginEnPage} from "../login-en/login-en";
import {NavController, NavParams} from "ionic-angular";

@Component({
    templateUrl: 'login.html'
})
export class LoginPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    login() {
        this.navCtrl.push(CaseSelectionPage);
    }

    changeLanguage() {
        this.navCtrl.push(LoginEnPage);
    }
}
