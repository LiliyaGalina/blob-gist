import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemInfoComponent } from '../components/item-info/item-info.component';

@Injectable({
    providedIn: 'root'
})
export class ItemInfoService {

    constructor(public dialog: MatDialog) { }

    public show(item) {

        const dialogRef = this.dialog.open(ItemInfoComponent, {
            width: '80%',
            height: '80%',
        });

        dialogRef.componentInstance.itemData = item;

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            // this.animal = result;
        });

    }
}
