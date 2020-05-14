import { Component } from '@angular/core';
import { SasGeneratorService } from '../azure-storage/services/sas-generator.service';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar> 
      <div style="display:block;">
        Github:
        <a
          href="https://github.com/stottle-uk/stottle-angular-blob-storage"
          target="_blank"
          rel="noopener noreferrer"
        >
          stottle-angular-blob-storage
        </a>
      </div>
      <div>
      <button (click)="signOut()">Sign Out</button>
      <button (click)="signIn()">Sign In</button>
      </div>
  </mat-toolbar>
  `
})
export class HeaderComponent {

  constructor(private sasService: SasGeneratorService) { }

  signOut() {
    this.sasService.signOut();
  }

  signIn() {
    this.sasService.signIn();
  }

}
