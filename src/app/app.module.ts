import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemsListComponent } from './azure-storage/components/items-list.component';
import { SelectedContainerComponent } from './azure-storage/components/selected-container.component';
import { ItemsDownloadedComponent } from './azure-storage/components/items-downloaded.component';
import { ItemsDeletedComponent } from './azure-storage/components/items-deleted.component';
import { BLOB_STORAGE_TOKEN, azureBlobStorageFactory } from './azure-storage/services/token';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FilescreenComponent } from './components/filescreen/filescreen.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { InputFileComponent } from './azure-storage/components/input-file/input-file.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    NgxMasonryModule,
    MatGridListModule,
    MatProgressBarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatToolbarModule,
    MsAdalAngular6Module.forRoot({
      tenant: 'f9092631-0875-488f-8d8a-6b7fd832220e',
      clientId: '9a044b23-30fa-4055-a2ae-480df0ed4093',
      redirectUri: 'http://localhost:4200/',
      endpoints: {
        'https://jsp.api.jetsoftpro.com/': 'be807724-1b9c-41ea-9080-5ba05f25355c',
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'localStorage',
      postLogoutRedirectUri: 'http://localhost:4200/',
    }),
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemsListComponent,
    SelectedContainerComponent,
    InputFileComponent,
    ItemsDownloadedComponent,
    ItemsDeletedComponent,
    FilescreenComponent,
    ItemInfoComponent 
  ],
  providers: [
    {
      provide: BLOB_STORAGE_TOKEN,
      useFactory: azureBlobStorageFactory
    }
  ],
  entryComponents: [
    ItemInfoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
