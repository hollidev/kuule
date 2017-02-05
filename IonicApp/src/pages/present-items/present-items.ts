import {Component, ViewChild, ApplicationRef} from "@angular/core";
import {VerificationSetupPage} from "../verification-setup/verification-setup";
import {NavController, NavParams, Platform, Slides, MenuController} from "ionic-angular";
import {CaseData} from "../../providers/case-data";
import {ItemDetailsPage} from "../item-details/item-details";
import {SendEmailPage} from "../send-email/send-email";
import {UserAttachmentsPage} from "../user-attachments/user-attachments";
import {Storage} from "@ionic/storage";
import {File, FileChooser, FileOpener} from "ionic-native";

declare var cordova: any

@Component({
    templateUrl: 'present-items.html',
})
export class PresentItemsPage {
    selectedItem: any;
    icons: string[];
    items: Array<{ title: string, icon: string, shown: boolean, data?: any }>;
    attachments: Array<{ title: string, url: string, icon?: string, shown: boolean }>;
    localAttachments: Array<string>;
    caseData: any;
    allItems: Array<{ title: string, icon: string, shown: boolean, data?: any }>;
    // allItems: any;
    iconDict: any;
    humanTitles: any;
    kommentit: any;
    pickedFile: any;
    isAndroid: boolean;
    @ViewChild('attachmentSlider') attachmentSlider: Slides;
    @ViewChild('localAttachmentSlider') localSlider: Slides;

    attachmentsFirst: boolean;
    attachmentsLast: boolean;
    localFirst: boolean;
    localLast: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public permitCase: CaseData, public storage: Storage, platform: Platform, private appRef: ApplicationRef, public menuCtrl: MenuController) {
        this.iconDict = {
            'hankkeen-kuvaus-rakennuslupa': 'lupicon-circle-info',
            'rakennuspaikka': 'lupicon-location',
            'paasuunnittelija': 'lupicon-user',
            'uusi-rakennus-ei-huoneistoa': 'lupicon-house',
            'hakija-r': 'lupicon-helmet'
        }
        this.humanTitles = {
            'hankkeen-kuvaus-rakennuslupa': 'Hankkeen kuvaus',
            'rakennuspaikka': 'Rakennuspaikka',
            'paasuunnittelija': 'Pääsuunnittelija',
            'uusi-rakennus-ei-huoneistoa': 'Uusi rakennus',
            'hakija-r': 'Hakija'
        }
        this.items = [];
        this.attachments = [];
        this.allItems = [];
        this.localAttachments = [];
        this.localLast = true;
        this.storage.get('latokuja-9.attachments').then((val) => {
            if (val != null) {
                this.localAttachments = val;
                if (this.localAttachments.length > 1) {
                    this.localLast = false;
                }
            }
        });
        this.isAndroid = platform.is('android');

        this.attachmentsFirst = true;
        this.attachmentsLast = false;
        this.localFirst = true;
    }

    nextView() {
        this.navCtrl.push(VerificationSetupPage);
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false, "precases");
        this.menuCtrl.enable(true, "postcases");
        var quickSwitch = this.permitCase.getSwitchTo();
        if (quickSwitch !== -1) {
            this.allItems.forEach(function (e) {
                if (e.data['schema-info'].name == quickSwitch['schema-info'].name) {
                    this.itemTapped(null, e);
                }
            }, this);
        }
        else {
            this.caseData = this.permitCase.getData();

            if (this.allItems.length == 0) {
                this.caseData.application.documents.forEach(function (e) {
                    this.items.push({
                        title: this.humanTitles[e['schema-info'].name],
                        data: parseData(this.title, e),
                        icon: this.iconDict[e['schema-info'].name],
                        shown: false
                    });
                }, this);

                this.items.forEach(function (e, idx, arr) {
                    var clearedData = {};
                    for (var x in e.data) {
                        for (var y in e.data[x]) {
                            if (e.data[x][y] != null) {
                                clearedData[x] = e.data[x];
                            }
                        }
                    }
                    arr[idx].data = clearedData;
                });

                this.items = this.items.filter(function (e) {
                    for (var p in e.data) {
                        if (e.data.hasOwnProperty(p)) {
                            return true;
                        }
                    }
                    return false;
                });

                this.attachments.push({
                    title: 'Pääpiirustus',
                    url: "assets/doc/paapiirrustus.pdf",
                    icon: "",
                    shown: false
                });
                this.attachments.push({
                    title: 'Energiaselvitys',
                    url: "assets/doc/energiaselvitys.pdf",
                    icon: "",
                    shown: false
                });

                this.attachments.push({
                    title: 'Logo',
                    url: "assets/icon/lupapiste.svg",
                    icon: "",
                    shown: false
                });

                this.attachments.forEach(function (e, idx, arr) {
                    if (e.url.substr(-3) == "pdf") {
                        arr[idx].icon = "pdf";
                    }
                });


            }
        }
    }

    ionViewDidEnter() {
        var swiper: any = this.attachmentSlider.getSlider();
        swiper.prevButton = ".lupicon-documents";
        swiper.nextButton = "lupicon-documents"

        var locSwiper: any = this.localSlider.getSlider();

        this.onSlideChanged() // Show/hide next/prev buttons for sliders.
    }

    itemTapped(e, item) {
        this.navCtrl.push(ItemDetailsPage, {
            item: item
        });
        var seen = this.allItems.filter(function (filterItem) {
            return item.title == filterItem.title;
        });

        seen[0].shown = true;

        if (this.allItemsShown()) {
            (<HTMLButtonElement>document.getElementById('continueButton')).disabled = false;
        }
    }

    allItemsShown() {
        var allShown = true;

        this.allItems.forEach(function (item) {
            if (!item.shown)
                allShown = false;
        });

        return allShown;
    }

    sposti() {
        this.navCtrl.push(SendEmailPage);
    }

    userAttachments() {
        this.navCtrl.push(UserAttachmentsPage);
    }

    commentAttachment() {
        FileChooser.open().then((uri) => {
            this.pickedFile = uri
        })
            .catch(e => console.log(e))
    }

    openUrl(url) {
        if (this.isAndroid == false) {
            window.open(url, '_system', 'location=no');
            return;
        }
        url = "www/" + url
        var fname = url.substr(url.lastIndexOf("/") + 1);
        var source = cordova.file.applicationDirectory;
        var destination = cordova.file.externalDataDirectory;
        Promise.all([source, destination]).then((values) => {
            var src = values[0];
            var dst = values[1];
            return File.copyFile(src, url, dst, fname);
        }).catch((err) => {
            console.log("Err" + err.code);
        }).then((val) => {
            return FileOpener.open(destination + fname, 'application/pdf');
        })
    }

    onSlideChanged() {
        this.attachmentsFirst = this.attachmentSlider.isBeginning();
        this.attachmentsLast = this.attachmentSlider.isEnd();

        if (this.localSlider !== undefined) {
            this.localFirst = this.localSlider.isBeginning();
            this.localLast = this.localSlider.isEnd();
        }
        this.appRef.tick();
    }

    nextSlide(slider: string) {
        if (slider == "attachments") {
            this.attachmentSlider.slideNext();
        }
        if (slider == "locals") {
            this.localSlider.slideNext();
        }
    }

    prevSlide(slider: string) {
        if (slider == "attachments") {
            this.attachmentSlider.slidePrev();
        }
        if (slider == "locals") {
            this.localSlider.slidePrev();
        }
    }

}

function parseData(title: string, dataToParse: any) {
    var ret = {};

    for (var k in dataToParse.data) {
        if (k === undefined) {
            continue;
        }
        if (k.charAt(0) == "_") { // Skip _selected
            continue;
        }
        ret[k] = flatten(dataToParse.data[k]);
    }

    /*
     if (title == "Hankkeen kuvaus") {
     ret["hanke"] = flatten(dataToParse.data);
     }
     else {
     for (var k in dataToParse.data) {
     if (k === undefined) {
     continue;
     }
     if (k.charAt(0) == "_") { // Skip _selected
     continue;
     }
     ret[k] = flatten(dataToParse.data[k]);
     }
     }
     */
    return ret;
}


function flatten(o: any) {
    var ret = {};
    var flattened = {};

    for (var k in o) {
        if (k === undefined) {
            continue;
        }
        if (k.charAt(0) == "_") { // Skip _selected
            continue;
        }
        if (k.indexOf("Kytkin") > 0) {
            if (o[k].value == false) {
                continue;
            }
        }
        if (k.indexOf("UserId") >= 0) {
            continue;
        }

        if (o.hasOwnProperty(k)) {
            if (o[k] != null && typeof(o[k]) == 'object') {
                if (o[k].hasOwnProperty('value')) {
                    if (typeof(o[k].value) == "string") {
                        if (o[k].value.length == 0) {
                            continue;
                        }
                        if (o[k].value == null) {
                            continue;
                        }
                    }
                    ret[k] = o[k].value;
                }
                else {
                    flattened = flatten(o[k]);
                    for (var k2 in flattened) {
                        ret[k2] = flattened[k2];
                    }
                }
            }
        }
    }
    return ret;
}
