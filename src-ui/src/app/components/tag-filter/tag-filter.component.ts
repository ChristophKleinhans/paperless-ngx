import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'pngx-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TagFilterComponent {
    constructor() { }
}