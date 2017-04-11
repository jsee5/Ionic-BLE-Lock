import { Component, NgZone } from '@angular/core';
import { NavController, ModalController, Platform, AlertController, ToastController } from 'ionic-angular';
import { Lock } from '../../models/lock';
import { AddLockPage } from '../addlock/addlock';
import { SettingsPage } from '../settings/settings';
import { BLE } from '@ionic-native/ble';
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    title: "Bryte-Lock"
    lock: Lock;
    unlockIt: string = "Bryton is ugly";
    lockIt: string = "Bryton is pretty";


    constructor(private navCtrl: NavController,
        private modalCtrl: ModalController,
        private platform: Platform,
        private zone: NgZone,
        private ble: BLE,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController
    ) {
    }

    goToSettingsPage() {

        let modalSettings = this.modalCtrl.create(SettingsPage);
        modalSettings.present();
    }
    goToAddLockPage() {

        let modalAddLock = this.modalCtrl.create(AddLockPage);
        modalAddLock.onDidDismiss((lock) => {
            if (lock != null) {
                this.lock = lock;
                this.connect(lock.id);
            }
        })
        modalAddLock.present();
    }

    connect(lockId) {
        this.ble.connect(lockId).subscribe((newLock) => {

            this.lock.deviceId = lockId;
            this.lock.characteristicUUID = 0xFFE1;
            this.lock.serviceUUID = 0xBBBB;

            let toast = this.toastCtrl.create({
                message: 'Connected to lock',
                duration: 3000
            });
            toast.present();
        }, error => {
            console.error("Issue connecting to lock");
        })
    }

   stringToBytes(string) {
    var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
        }
    return array.buffer;
    }

    toggle(lock: Lock, data: string) {
        var toggleData = this.stringToBytes(data);
        this.ble.write(lock.deviceId, lock.serviceUUID.toString(16), lock.characteristicUUID.toString(16), toggleData).then(() => {
            this.lock.isLocked = !this.lock.isLocked;
        }).catch(err => {
            console.error("Unable to toggle...:(");
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Failed to toggle',
                buttons: ['OK']
            });
            alert.present();
        })
    }
}
