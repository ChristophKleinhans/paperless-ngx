import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TagComponent } from '../common/tag/tag.component'
import { TagService } from 'src/app/services/rest/tag.service'
import { Tag } from 'src/app/data/tag'
import { Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import { DocumentListViewService } from 'src/app/services/document-list-view.service'
import { FILTER_HAS_TAGS_ALL } from 'src/app/data/filter-rule-type'
import { FilterRule } from 'src/app/data/filter-rule'

@Component({
    selector: 'pngx-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss'],
    standalone: true,
    imports: [CommonModule, TagComponent]
})
export class TagFilterComponent implements OnInit, OnDestroy {
    tags: Tag[] = []
    selectedTagIds = new Set<number>()
    loading = false
    show = false
    private destroy$ = new Subject<void>()

    constructor(
        private tagService: TagService,
        private documentListViewService: DocumentListViewService
    ) {
        // Override methods to reload tags after operations
        const originalCreate = this.tagService.create.bind(this.tagService)
        const originalUpdate = this.tagService.update.bind(this.tagService)
        const originalDelete = this.tagService.delete.bind(this.tagService)

        this.tagService.create = (tag: Tag) => originalCreate(tag).pipe(
            tap(() => this.loadTags())
        )
        this.tagService.update = (tag: Tag) => originalUpdate(tag).pipe(
            tap(() => this.loadTags())
        )
        this.tagService.delete = (tag: Tag) => originalDelete(tag).pipe(
            tap(() => this.loadTags())
        )
    }

    ngOnInit() {
        this.loadTags()
    }

    ngOnDestroy() {
        this.destroy$.next()
        this.destroy$.complete()
    }

    private loadTags() {
        this.loading = true
        this.tagService.listAll().pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: response => {
                this.tags = response.results
                this.loading = false
                this.show = true

                // Clean up any selected tags that no longer exist
                this.selectedTagIds.forEach(id => {
                    if (!this.tags.some(tag => tag.id === id)) {
                        this.selectedTagIds.delete(id)
                    }
                })
            },
            error: err => {
                console.error('Error loading tags:', err)
                this.loading = false
            }
        })
    }

    isTagSelected = (tagId: number): boolean => this.selectedTagIds.has(tagId)

    toggleTag(tagId: number) {
        this.selectedTagIds.has(tagId)
            ? this.selectedTagIds.delete(tagId)
            : this.selectedTagIds.add(tagId)

        const filterRules = this.selectedTagIds.size
            ? Array.from(this.selectedTagIds).map(id => ({
                rule_type: FILTER_HAS_TAGS_ALL,
                value: id.toString()
            }))
            : []

        this.documentListViewService.quickFilter(filterRules)
    }
}