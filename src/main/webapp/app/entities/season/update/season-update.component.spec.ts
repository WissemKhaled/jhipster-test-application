import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SeasonService } from '../service/season.service';
import { ISeason, Season } from '../season.model';
import { ISerie } from 'app/entities/serie/serie.model';
import { SerieService } from 'app/entities/serie/service/serie.service';

import { SeasonUpdateComponent } from './season-update.component';

describe('Season Management Update Component', () => {
  let comp: SeasonUpdateComponent;
  let fixture: ComponentFixture<SeasonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let seasonService: SeasonService;
  let serieService: SerieService;

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
    serieService = TestBed.inject(SerieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Serie query and add missing value', () => {
      const season: ISeason = { id: 456 };
      const serie: ISerie = { id: 69732 };
      season.serie = serie;

      const serieCollection: ISerie[] = [{ id: 17459 }];
      jest.spyOn(serieService, 'query').mockReturnValue(of(new HttpResponse({ body: serieCollection })));
      const additionalSeries = [serie];
      const expectedCollection: ISerie[] = [...additionalSeries, ...serieCollection];
      jest.spyOn(serieService, 'addSerieToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ season });
      comp.ngOnInit();

      expect(serieService.query).toHaveBeenCalled();
      expect(serieService.addSerieToCollectionIfMissing).toHaveBeenCalledWith(serieCollection, ...additionalSeries);
      expect(comp.seriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const season: ISeason = { id: 456 };
      const serie: ISerie = { id: 7537 };
      season.serie = serie;

      activatedRoute.data = of({ season });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(season));
      expect(comp.seriesSharedCollection).toContain(serie);
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
    describe('trackSerieById', () => {
      it('Should return tracked Serie primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSerieById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
