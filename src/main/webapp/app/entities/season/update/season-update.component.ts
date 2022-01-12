import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISeason, Season } from '../season.model';
import { SeasonService } from '../service/season.service';
import { IEpisode } from 'app/entities/episode/episode.model';
import { EpisodeService } from 'app/entities/episode/service/episode.service';

@Component({
  selector: 'jhi-season-update',
  templateUrl: './season-update.component.html',
})
export class SeasonUpdateComponent implements OnInit {
  isSaving = false;

  episodesSharedCollection: IEpisode[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    episode: [],
  });

  constructor(
    protected seasonService: SeasonService,
    protected episodeService: EpisodeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ season }) => {
      this.updateForm(season);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const season = this.createFromForm();
    if (season.id !== undefined) {
      this.subscribeToSaveResponse(this.seasonService.update(season));
    } else {
      this.subscribeToSaveResponse(this.seasonService.create(season));
    }
  }

  trackEpisodeById(index: number, item: IEpisode): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeason>>): void {
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

  protected updateForm(season: ISeason): void {
    this.editForm.patchValue({
      id: season.id,
      name: season.name,
      episode: season.episode,
    });

    this.episodesSharedCollection = this.episodeService.addEpisodeToCollectionIfMissing(this.episodesSharedCollection, season.episode);
  }

  protected loadRelationshipsOptions(): void {
    this.episodeService
      .query()
      .pipe(map((res: HttpResponse<IEpisode[]>) => res.body ?? []))
      .pipe(
        map((episodes: IEpisode[]) => this.episodeService.addEpisodeToCollectionIfMissing(episodes, this.editForm.get('episode')!.value))
      )
      .subscribe((episodes: IEpisode[]) => (this.episodesSharedCollection = episodes));
  }

  protected createFromForm(): ISeason {
    return {
      ...new Season(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      episode: this.editForm.get(['episode'])!.value,
    };
  }
}
