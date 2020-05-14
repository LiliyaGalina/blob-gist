import { Component, QueryList, ViewChildren } from '@angular/core';
import { BlobSharedViewStateService } from './azure-storage/services/blob-shared-view-state.service';
import { FilescreenComponent } from 'src/app/components/filescreen/filescreen.component';
import { BlobStorageService } from './azure-storage/services/blob-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BlobSharedViewStateService]
})
export class AppComponent {

  @ViewChildren(FilescreenComponent) items: QueryList<FilescreenComponent>;

  containers$ = this.blobService.containers$;

  constructor(private blobState: BlobSharedViewStateService,
    private blobService: BlobStorageService) { }

  onTabChanged(event) {
    var component = this.items.find((x, i) => i == event.index);
    if (component) {
      component.reloadMasonry();
    }
  }

}
