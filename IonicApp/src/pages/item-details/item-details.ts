import {Component} from "@angular/core";
import {CaseData} from "../../providers/case-data";
import {NavController, NavParams} from "ionic-angular";

@Component({
    templateUrl: 'item-details.html',
})

export class ItemDetailsPage {
    selectedItem: any;
    caseData: any;
    itemData: any;
    nextItem: any;
    prevItem: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public permitCase: CaseData) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        this.caseData = this.permitCase.getData();
        this.prevItem = null;
        this.nextItem = null;

        // The structure goes quite deep at times and Angular/Ionic isn't very good at nested structures
        // so we need to preprocess and flatten it to at most 2 levels.
        this.itemData = {};
        if (this.selectedItem.title == "Hankkeen kuvaus") {
            this.itemData["hanke"] = flatten(this.selectedItem.data.data);
        }
        else {
            for (var k in this.selectedItem.data.data) {
                if (k === undefined) {
                    continue;
                }
                if (k.charAt(0) == "_") { // Skip _selected
                    continue;
                }
                this.itemData[k] = flatten(this.selectedItem.data.data[k]);
            }
        }

        var i = 0;

        for (var k in this.caseData.application.documents) {

            if (this.caseData.application.documents[k]['schema-info'].name == this.selectedItem.data['schema-info'].name) {
                if (i > 0) {
                    this.prevItem = this.caseData.application.documents[i - 1];
                }
                if (i < (this.caseData.application.documents.length - 1)) {
                    this.nextItem = this.caseData.application.documents[i + 1];
                }
                break;
            }
            i = i + 1;
        }
    }

    bottomNav(e, item) {
        this.permitCase.setSwitchTo(item);
        this.navCtrl.pop();
    }
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
        if (o.hasOwnProperty(k)) {
            if (o[k] != null && typeof(o[k]) == 'object') {
                if (o[k].hasOwnProperty('value')) {
                    if (typeof(o[k].value) == "string") {
                        if (o[k].value.length == 0) {
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

