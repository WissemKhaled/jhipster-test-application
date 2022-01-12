import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEpisode, Episode } from '../episode.model';
import { EpisodeService } from '../service/episode.service';
import { ISeason } from 'app/entities/season/season.model';
import { SeasonService } from 'app/entities/season/service/season.service';

@Component({
  selector: 'jhi-episode-update',
  templateUrl: './episode-update.component.html',
})
export class EpisodeUpdateComponent implements OnInit {
  isSaving = false;

  seasonsSharedCollection: ISeason[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    season: [],
  });

  constructor(
    protected episodeService: EpisodeService,
    protected seasonService: SeasonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ episode }) => {
      this.updateForm(episode);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const episode = this.createFromForm();
    if (episode.id !== undefined) {
      this.subscribeToSaveResponse(this.episodeService.update(episode));
    } else {
      this.subscribeToSaveResponse(this.episodeService.create(episode));
    }
  }

  trackSeasonById(index: number, item: ISeason): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEpisode>>): void {
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

  protected updateForm(episode: IEpisode): void {
    this.editForm.patchValue({
      id: episode.id,
      name: episode.name,
      season: episode.season,
    });

    this.seasonsSharedCollection = this.seasonService.addSeasonToCollectionIfMissing(this.seasonsSharedCollection, episode.season);
  }

  protected loadRelationshipsOptions(): void {
    this.seasonService
      .query()
      .pipe(map((res: HttpResponse<ISeason[]>) => res.body ?? []))
      .pipe(map((seasons: ISeason[]) => this.seasonService.addSeasonToCollectionIfMissing(seasons, this.editForm.get('season')!.value)))
      .subscribe((seasons: ISeason[]) => (this.seasonsSharedCollection = seasons));
  }

  protected createFromForm(): IEpisode {
    return {
      ...new Episode(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      season: this.editForm.get(['season'])!.value,
    };
  }
}
