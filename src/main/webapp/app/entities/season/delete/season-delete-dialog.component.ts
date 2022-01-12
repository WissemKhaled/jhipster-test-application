import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeason } from '../season.model';
import { SeasonService } from '../service/season.service';

@Component({
  templateUrl: './season-delete-dialog.component.html',
})
export class SeasonDeleteDialogComponent {
  season?: ISeason;

  constructor(protected seasonService: SeasonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.seasonService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
