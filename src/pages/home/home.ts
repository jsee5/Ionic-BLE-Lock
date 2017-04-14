import { Component, NgZone } from '@angular/core';
import { NavController, ModalController, Platform, AlertController, ToastController, LoadingController } from 'ionic-angular';
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
    unlockIt: string = "Bryton is pretty";
    lockIt: string = "Bryton is ugly";
    isAndroid: boolean = false;

    constructor(private navCtrl: NavController,
        private modalCtrl: ModalController,
        private platform: Platform,
        private zone: NgZone,
        private ble: BLE,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public loadCtrl: LoadingController
    ) {
        this.isAndroid = platform.is('android');
        if(this.lock!= null){
            this.connect(this.lock.deviceId);
        }
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



    stringToBytes(string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    connect(lockId) {
        this.ble.connect(lockId).subscribe((newLock) => {

            this.lock.deviceId = lockId;
            this.lock.characteristicUUID = 0xFFE1;
            this.lock.serviceUUID = 0xBBBB;
            this.lock.isLocked = true;
            this.ble.writeWithoutResponse(this.lock.deviceId, this.lock.serviceUUID.toString(16), this.lock.characteristicUUID.toString(16), this.stringToBytes("Mobile device connected")).then(() => {
            // this.getStatus(this.lock);
                let toast = this.toastCtrl.create({
                    message: 'Connected to lock',
                    duration: 3000
                })
                toast.present();
                
            });

        }, error => {
            console.error('Issue connecting to lock');
        })
    }

    ionViewCanLeave(){
        this.ble.disconnect(this.lock.deviceId).then (() => {
            console.log("disconnected");
        })
    }
    // getStatus(lock: Lock) {
    //     this.ble.read(lock.deviceId, lock.serviceUUID.tostring(16), lock.characteristicUUID.toString(16)).then(status => {
    //         if (this.bytesToString(status) == 'I am open') {
    //             this.lock.isLocked = false;
    //         }
    //         else if (this.bytesToString(status) == 'I am closed') {
    //             this.lock.isLocked = true;
    //         }
    //     }). catch(err => {
    //         let toast = this.toastCtrl.create({
    //             message: 'Failed read status',
    //             duration: 3000
    //         });
    //         toast.present();
    //     })
    // }

    toggle(lock: Lock, data: string) {

        let toggleData = this.stringToBytes(data);

        this.ble.writeWithoutResponse(lock.deviceId, lock.serviceUUID.toString(16), lock.characteristicUUID.toString(16), toggleData).then(() => {
            this.lock.isLocked = !this.lock.isLocked;
            let loading = this.loadCtrl.create({
                spinner: 'dots',
                duration: 1500
            })
            loading.present();
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
