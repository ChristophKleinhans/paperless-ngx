import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'pngx-tag-filter-nav',
    templateUrl: './tag-filter-nav.component.html',
    styleUrls: ['./tag-filter-nav.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TagFilterNavComponent {
    constructor() { }
}