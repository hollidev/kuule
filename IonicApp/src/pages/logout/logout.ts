import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {LoginPage} from "../login/login";
@Component({
    templateUrl: 'logout.html'
})
export class LogoutPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    backToLogin() {
        this.navCtrl.setRoot(LoginPage);
    }

}
