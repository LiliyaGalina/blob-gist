import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BlobSharedViewStateService } from '../../azure-storage/services/blob-shared-view-state.service';
import { BlobDeletesViewStateService } from '../../azure-storage/services/blob-deletes-view-state.service';
import { BlobDownloadsViewStateService } from '../../azure-storage/services/blob-downloads-view-state.service';
import { SasGeneratorService } from '../../azure-storage/services/sas-generator.service';
import { NgxMasonryComponent } from 'ngx-masonry';
import { ItemInfoService } from 'src/app/_services/item-info.service';

@Component({
  selector: 'app-filescreen',
  templateUrl: './filescreen.component.html',
  styleUrls: ['./filescreen.component.scss'],
  providers: [BlobSharedViewStateService]
})
export class FilescreenComponent implements OnInit {

  @ViewChild('masonry', { static: false }) masonry: NgxMasonryComponent;

  @Input() container: any;
  items;

  constructor(public blobState: BlobSharedViewStateService,
    private sasGeneratorService: SasGeneratorService,
    private itemInfoService: ItemInfoService) { }

  ngOnInit() {

    this.blobState.containerName = this.container.name;

    this.blobState.itemsInContainer$.subscribe(items => {
      this.items = items.sort((a, b) =>
        b.properties.createdOn.valueOf() - a.properties.createdOn.valueOf());

      this.reloadMasonry();
    });
  }


  public reloadMasonry() {
    if (this.masonry) {
      this.masonry.reloadItems();
      this.masonry.layout();
    }
  }

  showInfo(image) {
    image.url = this.getImageUrl(image.name);
    this.itemInfoService.show(image);
  }

  getImageUrl(imgName) {
    return `${this.sasGeneratorService.storageUri}${this.container.name}/${imgName}`
  }


}
