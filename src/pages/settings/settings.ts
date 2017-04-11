import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  title = "Settings";
  constructor(public viewCtrl:ViewController){
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

}
