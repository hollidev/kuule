import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CaseSelectionPage} from "../case-selection/case-selection";
import {LoginPage} from "../login/login";

@Component({
    selector: 'page-login-en',
    templateUrl: 'login-en.html'
})
export class LoginEnPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    login() {
        this.navCtrl.push(CaseSelectionPage);
    }

    changeLanguage() {
        this.navCtrl.push(LoginPage);
    }
}
