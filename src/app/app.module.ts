import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SettingsPage } from '../pages/settings/settings';
import { AddLockPage } from '../pages/addlock/addlock';
import { HomePage } from '../pages/home/home';
// import { LockService } from '../providers/lock-service';
import { BLE } from '@ionic-native/ble';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    AddLockPage
  ],
  imports: [ 
    BrowserModule,
    IonicModule.forRoot(MyApp),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    AddLockPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, BLE]
})
export class AppModule {}
