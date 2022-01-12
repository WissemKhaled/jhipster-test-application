import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeason } from '../season.model';
import { SeasonService } from '../service/season.service';
import { SeasonDeleteDialogComponent } from '../delete/season-delete-dialog.component';

@Component({
  selector: 'jhi-season',
  templateUrl: './season.component.html',
})
export class SeasonComponent implements OnInit {
  seasons?: ISeason[];
  isLoading = false;

  constructor(protected seasonService: SeasonService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.seasonService.query().subscribe({
      next: (res: HttpResponse<ISeason[]>) => {
        this.isLoading = false;
        this.seasons = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISeason): number {
    return item.id!;
  }

  delete(season: ISeason): void {
    const modalRef = this.modalService.open(SeasonDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.season = season;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
