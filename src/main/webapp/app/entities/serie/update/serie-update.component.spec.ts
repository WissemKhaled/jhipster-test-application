import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SerieService } from '../service/serie.service';
import { ISerie, Serie } from '../serie.model';
import { ISeason } from 'app/entities/season/season.model';
import { SeasonService } from 'app/entities/season/service/season.service';

import { SerieUpdateComponent } from './serie-update.component';

describe('Serie Management Update Component', () => {
  let comp: SerieUpdateComponent;
  let fixture: ComponentFixture<SerieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serieService: SerieService;
  let seasonService: SeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SerieUpdateComponent],
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
      .overrideTemplate(SerieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SerieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serieService = TestBed.inject(SerieService);
    seasonService = TestBed.inject(SeasonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Season query and add missing value', () => {
      const serie: ISerie = { id: 456 };
      const season: ISeason = { id: 12903 };
      serie.season = season;

      const seasonCollection: ISeason[] = [{ id: 85193 }];
      jest.spyOn(seasonService, 'query').mockReturnValue(of(new HttpResponse({ body: seasonCollection })));
      const additionalSeasons = [season];
      const expectedCollection: ISeason[] = [...additionalSeasons, ...seasonCollection];
      jest.spyOn(seasonService, 'addSeasonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      expect(seasonService.query).toHaveBeenCalled();
      expect(seasonService.addSeasonToCollectionIfMissing).toHaveBeenCalledWith(seasonCollection, ...additionalSeasons);
      expect(comp.seasonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serie: ISerie = { id: 456 };
      const season: ISeason = { id: 30243 };
      serie.season = season;

      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serie));
      expect(comp.seasonsSharedCollection).toContain(season);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Serie>>();
      const serie = { id: 123 };
      jest.spyOn(serieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serieService.update).toHaveBeenCalledWith(serie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Serie>>();
      const serie = new Serie();
      jest.spyOn(serieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serie }));
      saveSubject.complete();

      // THEN
      expect(serieService.create).toHaveBeenCalledWith(serie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Serie>>();
      const serie = { id: 123 };
      jest.spyOn(serieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serieService.update).toHaveBeenCalledWith(serie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSeasonById', () => {
      it('Should return tracked Season primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSeasonById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
