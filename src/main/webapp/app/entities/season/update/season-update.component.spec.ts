import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SeasonService } from '../service/season.service';
import { ISeason, Season } from '../season.model';
import { IEpisode } from 'app/entities/episode/episode.model';
import { EpisodeService } from 'app/entities/episode/service/episode.service';

import { SeasonUpdateComponent } from './season-update.component';

describe('Season Management Update Component', () => {
  let comp: SeasonUpdateComponent;
  let fixture: ComponentFixture<SeasonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let seasonService: SeasonService;
  let episodeService: EpisodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SeasonUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SeasonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeasonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    seasonService = TestBed.inject(SeasonService);
    episodeService = TestBed.inject(EpisodeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Episode query and add missing value', () => {
      const season: ISeason = { id: 456 };
      const episode: IEpisode = { id: 74731 };
      season.episode = episode;

      const episodeCollection: IEpisode[] = [{ id: 7660 }];
      jest.spyOn(episodeService, 'query').mockReturnValue(of(new HttpResponse({ body: episodeCollection })));
      const additionalEpisodes = [episode];
      const expectedCollection: IEpisode[] = [...additionalEpisodes, ...episodeCollection];
      jest.spyOn(episodeService, 'addEpisodeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ season });
      comp.ngOnInit();

      expect(episodeService.query).toHaveBeenCalled();
      expect(episodeService.addEpisodeToCollectionIfMissing).toHaveBeenCalledWith(episodeCollection, ...additionalEpisodes);
      expect(comp.episodesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const season: ISeason = { id: 456 };
      const episode: IEpisode = { id: 16325 };
      season.episode = episode;

      activatedRoute.data = of({ season });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(season));
      expect(comp.episodesSharedCollection).toContain(episode);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Season>>();
      const season = { id: 123 };
      jest.spyOn(seasonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ season });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: season }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(seasonService.update).toHaveBeenCalledWith(season);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Season>>();
      const season = new Season();
      jest.spyOn(seasonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ season });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: season }));
      saveSubject.complete();

      // THEN
      expect(seasonService.create).toHaveBeenCalledWith(season);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Season>>();
      const season = { id: 123 };
      jest.spyOn(seasonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ season });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(seasonService.update).toHaveBeenCalledWith(season);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEpisodeById', () => {
      it('Should return tracked Episode primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEpisodeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
