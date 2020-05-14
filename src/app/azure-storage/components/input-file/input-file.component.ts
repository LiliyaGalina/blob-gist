import { Component, ElementRef, ViewChild, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent   {


  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<
    HTMLInputElement
  >;

  @Input() blobState;
  
  onSelected(files: FileList): void {
    this.blobState.uploadItems(files);
    this.fileInput.nativeElement.value = '';
  }

  showFileDialog(): void {
    this.fileInput.nativeElement.click();
  }
}
