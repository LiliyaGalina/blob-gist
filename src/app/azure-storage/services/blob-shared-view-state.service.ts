import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  Subject,
  from
} from 'rxjs';
import {
  filter,
  finalize,
  map,
  scan,
  switchMap,
  debounceTime,
  mergeMap,
  startWith
} from 'rxjs/operators';
import { BlobContainerRequest,  BlobItem, Dictionary,  BlobItemUpload } from '../types/azure-storage';
import { BlobStorageService } from './blob-storage.service';
import { SasGeneratorService } from './sas-generator.service';

@Injectable(
  // {
  //   providedIn: "root"
  // }
)
export class BlobSharedViewStateService {

  private _containerName: string = null;
  set containerName(cName) {
    this._containerName = cName;
    this.getContainerItems(cName);
  }

  private _uploadQueueInner$ = new Subject<FileList>();

  scanEntries = <T extends BlobItem>(): OperatorFunction<T, T[]> => source =>
    source.pipe(
      map(item => ({
        [`${item.containerName}-${item.name}`]: item
      })),
      scan<Dictionary<T>>(
        (items, item) => ({
          ...items,
          ...item
        }),
        {}
      ),
      map(items => Object.values(items))
    );


  uploadedItems$ = this.uploadQueue$.pipe(
    mergeMap(file => this.uploadFile(file, this._containerName)),
    this.scanEntries()
  );

  get uploadQueue$() {
    return this._uploadQueueInner$
      .asObservable()
      .pipe(mergeMap(files => from(files)));
  }


  private selectedContainerInner$ = new BehaviorSubject<string>(undefined);

  itemsInContainer$ = this.selectedContainer$.pipe(
    filter(containerName => !!containerName),
    switchMap(containerName =>
      this.blobStorage.getStorageOptions().pipe(
        switchMap(options =>
          this.blobStorage.listBlobsInContainer({
            ...options,
            containerName
          })
        ),
        debounceTime(1000)
      )
    )
  );

  get selectedContainer$() {
    return this.selectedContainerInner$.asObservable();
  }

  constructor(
    private sasGenerator: SasGeneratorService,
    private blobStorage: BlobStorageService
  ) { }

  getContainerItems(containerName: string): void {
    this.selectedContainerInner$.next(containerName);
  }


  finaliseBlobChange = <T>(
    containerName: string
  ): MonoTypeOperatorFunction<T> => source =>
      source.pipe(
        finalize(
          () =>
            this.selectedContainerInner$.value === containerName &&
            this.selectedContainerInner$.next(containerName)
        )
      );


  uploadItems(files: FileList): void {
    this._uploadQueueInner$.next(files);
  }

  private uploadFile = (file: File, containerName: string) => {
    return this.blobStorage.getStorageOptionsWithContainer(containerName).pipe(
      switchMap(options =>
        this.blobStorage
          .uploadToBlobStorage(file, {
            ...options,
            filename: file.name + new Date().getTime()
          })
          .pipe(
            this.mapUploadResponse(file, options),
            this.finaliseBlobChange(options.containerName)
          )
      )
    );
  };

  private mapUploadResponse = (
    file: File,
    options: BlobContainerRequest
  ): OperatorFunction<number, BlobItemUpload> => source =>
      source.pipe(
        map(progress => ({
          name: file.name,
          containerName: options.containerName,
          progress: parseInt(((progress / file.size) * 100).toString(), 10)
        })),
        startWith({
          name: file.name,
          containerName: options.containerName,
          progress: 0
        })
      );
}
