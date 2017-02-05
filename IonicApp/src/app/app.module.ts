import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {MyApp} from './app.component';
import {ItemDetailsPage} from '../pages/item-details/item-details';
import {LoginPage} from '../pages/login/login';
import {LogoutPage} from '../pages/logout/logout';
import {InputVerificationPage} from '../pages/input-verification/input-verification';
import {CameraVerificationPage} from '../pages/camera-verification/camera-verification';
import {PresentItemsPage} from '../pages/present-items/present-items';
import {VerificationSetupPage} from '../pages/verification-setup/verification-setup';
import {UploadVerificationPage} from '../pages/upload-verification/upload-verification';
import {CaseSelectionPage} from '../pages/case-selection/case-selection';
import {CaseInfoPage} from '../pages/case-info/case-info';
import {SendEmailPage} from '../pages/send-email/send-email';
import {LoginEnPage} from '../pages/login-en/login-en';
import {UserAttachmentsPage} from '../pages/user-attachments/user-attachments';
import {KeysPipe} from '../pipes/keys-pipe';

@NgModule({
    declarations: [
        MyApp,
        ItemDetailsPage,
        LoginPage,
        LogoutPage,
        InputVerificationPage,
        CameraVerificationPage,
        PresentItemsPage,
        VerificationSetupPage,
        UploadVerificationPage,
        CaseSelectionPage,
        CaseInfoPage,
        SendEmailPage,
        LoginEnPage,
        UserAttachmentsPage,
        KeysPipe
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ItemDetailsPage,
        LoginPage,
        LogoutPage,
        InputVerificationPage,
        CameraVerificationPage,
        PresentItemsPage,
        VerificationSetupPage,
        UploadVerificationPage,
        CaseSelectionPage,
        CaseInfoPage,
        SendEmailPage,
        LoginEnPage,
        UserAttachmentsPage
    ],
    providers: [Storage]
})
export class AppModule {
}
