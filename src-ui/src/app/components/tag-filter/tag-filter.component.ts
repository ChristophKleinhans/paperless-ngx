import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TagComponent } from '../common/tag/tag.component'
import { TagService } from 'src/app/services/rest/tag.service'
import { Tag } from 'src/app/data/tag'
import { Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'

@Component({
    selector: 'pngx-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss'],
    standalone: true,
    imports: [CommonModule, TagComponent]
})
export class TagFilterComponent implements OnInit, OnDestroy {
    tags: Tag[] = []
    private unsubscribeNotifier = new Subject()
    loading = false
    show = false

    constructor(private tagService: TagService) {
        // Store original methods
        const originalCreate = this.tagService.create.bind(this.tagService)
        const originalUpdate = this.tagService.update.bind(this.tagService)
        const originalDelete = this.tagService.delete.bind(this.tagService)

        // Override methods to add reload after each operation
        this.tagService.create = (tag: Tag) => originalCreate(tag).pipe(tap(() => this.loadTags()))
        this.tagService.update = (tag: Tag) => originalUpdate(tag).pipe(tap(() => this.loadTags()))
        this.tagService.delete = (tag: Tag) => originalDelete(tag).pipe(tap(() => this.loadTags()))
    }

    ngOnInit() {
        this.loadTags()
    }

    ngOnDestroy() {
        this.unsubscribeNotifier.next(null)
        this.unsubscribeNotifier.complete()
    }

    private loadTags() {
        this.loading = true
        this.show = false
        this.tagService.listAll().pipe(
            takeUntil(this.unsubscribeNotifier)
        ).subscribe({
            next: response => {
                this.tags = response.results
                this.show = true
                this.loading = false
            },
            error: err => {
                console.error('Error loading tags:', err)
                this.loading = false
            }
        })
    }
}