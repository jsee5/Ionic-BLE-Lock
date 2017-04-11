import { Component, NgZone } from '@angular/core';
import { AlertController, Platform, ViewController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'page-addlock',
  templateUrl: 'addlock.html'
})
export class AddLockPage {
  title = 'Setup Lock';

  isLocked: boolean = false;
  isScanning: boolean = false;
  isAndroid: boolean = false;
  locks = [];
  //detects only ServiceUUID of 0xBBBB
  serviceUUID = 0xBBBB;



  constructor(private alertCtrl: AlertController,
    private zone: NgZone,
    private platform: Platform,
    public viewCtrl: ViewController,
    private ble: BLE) {

    this.isAndroid = platform.is('android');
  }
  beginScan() {
    this.locks = [];
    this.isScanning = true;
    this.enableBLE().then(() => {
      this.ble.startScan([this.serviceUUID.toString(16)]).subscribe(newLock => {
        this.zone.run(() => {
          this.locks.push(newLock);
        })
      })
    }).catch(err => {
      console.error("Bluetooth was not successfully enabled", err);
      this.isScanning = false;
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please enable Bluetooth',
        buttons: ['OK']
      })
      alert.present();
    })
  }

  stopScan() {
    this.ble.stopScan().then(() => {
      this.zone.run(() => {
        this.isScanning = false;
      })
    })
  }

  // Enabling bluetooth works only on android newLocks.
  private enableBLE() {
    if (this.isAndroid) {
      return this.ble.enable();
    }
    else {
      return Promise.resolve();
    }
  }
  addLock(lock) {
    this.stopScan();
    this.viewCtrl.dismiss(lock);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
