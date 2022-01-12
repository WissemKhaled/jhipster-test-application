import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISerie, Serie } from '../serie.model';
import { SerieService } from '../service/serie.service';
import { ISeason } from 'app/entities/season/season.model';
import { SeasonService } from 'app/entities/season/service/season.service';

@Component({
  selector: 'jhi-serie-update',
  templateUrl: './serie-update.component.html',
})
export class SerieUpdateComponent implements OnInit {
  isSaving = false;

  seasonsSharedCollection: ISeason[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    priceInEuro: [],
    dateTimeAdd: [],
    season: [],
  });

  constructor(
    protected serieService: SerieService,
    protected seasonService: SeasonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serie }) => {
      if (serie.id === undefined) {
        const today = dayjs().startOf('day');
        serie.dateTimeAdd = today;
      }

      this.updateForm(serie);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serie = this.createFromForm();
    if (serie.id !== undefined) {
      this.subscribeToSaveResponse(this.serieService.update(serie));
    } else {
      this.subscribeToSaveResponse(this.serieService.create(serie));
    }
  }

  trackSeasonById(index: number, item: ISeason): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISerie>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(serie: ISerie): void {
    this.editForm.patchValue({
      id: serie.id,
      name: serie.name,
      priceInEuro: serie.priceInEuro,
      dateTimeAdd: serie.dateTimeAdd ? serie.dateTimeAdd.format(DATE_TIME_FORMAT) : null,
      season: serie.season,
    });

    this.seasonsSharedCollection = this.seasonService.addSeasonToCollectionIfMissing(this.seasonsSharedCollection, serie.season);
  }

  protected loadRelationshipsOptions(): void {
    this.seasonService
      .query()
      .pipe(map((res: HttpResponse<ISeason[]>) => res.body ?? []))
      .pipe(map((seasons: ISeason[]) => this.seasonService.addSeasonToCollectionIfMissing(seasons, this.editForm.get('season')!.value)))
      .subscribe((seasons: ISeason[]) => (this.seasonsSharedCollection = seasons));
  }

  protected createFromForm(): ISerie {
    return {
      ...new Serie(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      priceInEuro: this.editForm.get(['priceInEuro'])!.value,
      dateTimeAdd: this.editForm.get(['dateTimeAdd'])!.value
        ? dayjs(this.editForm.get(['dateTimeAdd'])!.value, DATE_TIME_FORMAT)
        : undefined,
      season: this.editForm.get(['season'])!.value,
    };
  }
}
