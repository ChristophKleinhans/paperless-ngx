import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TagComponent } from '../common/tag/tag.component'
import { TagService } from 'src/app/services/rest/tag.service'
import { Tag } from 'src/app/data/tag'

@Component({
    selector: 'pngx-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss'],
    standalone: true,
    imports: [CommonModule, TagComponent]
})
export class TagFilterComponent implements OnInit {
    tags: Tag[] = []

    constructor(private tagService: TagService) { }

    ngOnInit() {
        this.tagService.listAll().subscribe(response => {
            this.tags = response.results
        })
    }
}