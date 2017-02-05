import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from '../pages/login/login';
import {LogoutPage} from '../pages/logout/logout';
import {CaseData} from '../providers/case-data';
import {CaseSelectionPage} from '../pages/case-selection/case-selection';
import {PresentItemsPage} from '../pages/present-items/present-items';


@Component({
    templateUrl: 'app.html',
    providers: [CaseData]
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;
    precases_pages: Array<{title: string, component: any}>;
    postcases_pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform,
                public menu: MenuController) {
        this.initializeApp();

        // set our app's pages
        this.precases_pages = [
            {title: 'Luvat', component: CaseSelectionPage},
            {title: 'Kirjaudu ulos', component: LogoutPage}
        ];
        this.postcases_pages = [
            {title: 'Luvat', component: CaseSelectionPage},
            {title: 'Hakemuksen tiedot', component: PresentItemsPage},
            {title: 'Kirjaudu ulos', component: LogoutPage}
        ];
        this.menu.enable(false, "precases");
        this.menu.enable(false, "postcases")
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }
}
