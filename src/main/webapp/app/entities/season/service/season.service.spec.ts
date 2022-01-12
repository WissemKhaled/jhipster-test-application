import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISeason, Season } from '../season.model';

import { SeasonService } from './season.service';

describe('Season Service', () => {
  let service: SeasonService;
  let httpMock: HttpTestingController;
  let elemDefault: ISeason;
  let expectedResult: ISeason | ISeason[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SeasonService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Season', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Season()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Season', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Season', () => {
      const patchObject = Object.assign({}, new Season());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Season', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Season', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSeasonToCollectionIfMissing', () => {
      it('should add a Season to an empty array', () => {
        const season: ISeason = { id: 123 };
        expectedResult = service.addSeasonToCollectionIfMissing([], season);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(season);
      });

      it('should not add a Season to an array that contains it', () => {
        const season: ISeason = { id: 123 };
        const seasonCollection: ISeason[] = [
          {
            ...season,
          },
          { id: 456 },
        ];
        expectedResult = service.addSeasonToCollectionIfMissing(seasonCollection, season);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Season to an array that doesn't contain it", () => {
        const season: ISeason = { id: 123 };
        const seasonCollection: ISeason[] = [{ id: 456 }];
        expectedResult = service.addSeasonToCollectionIfMissing(seasonCollection, season);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(season);
      });

      it('should add only unique Season to an array', () => {
        const seasonArray: ISeason[] = [{ id: 123 }, { id: 456 }, { id: 78456 }];
        const seasonCollection: ISeason[] = [{ id: 123 }];
        expectedResult = service.addSeasonToCollectionIfMissing(seasonCollection, ...seasonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const season: ISeason = { id: 123 };
        const season2: ISeason = { id: 456 };
        expectedResult = service.addSeasonToCollectionIfMissing([], season, season2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(season);
        expect(expectedResult).toContain(season2);
      });

      it('should accept null and undefined values', () => {
        const season: ISeason = { id: 123 };
        expectedResult = service.addSeasonToCollectionIfMissing([], null, season, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(season);
      });

      it('should return initial array if no Season is added', () => {
        const seasonCollection: ISeason[] = [{ id: 123 }];
        expectedResult = service.addSeasonToCollectionIfMissing(seasonCollection, undefined, null);
        expect(expectedResult).toEqual(seasonCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
