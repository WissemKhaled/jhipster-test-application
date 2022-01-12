import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISeason, getSeasonIdentifier } from '../season.model';

export type EntityResponseType = HttpResponse<ISeason>;
export type EntityArrayResponseType = HttpResponse<ISeason[]>;

@Injectable({ providedIn: 'root' })
export class SeasonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/seasons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(season: ISeason): Observable<EntityResponseType> {
    return this.http.post<ISeason>(this.resourceUrl, season, { observe: 'response' });
  }

  update(season: ISeason): Observable<EntityResponseType> {
    return this.http.put<ISeason>(`${this.resourceUrl}/${getSeasonIdentifier(season) as number}`, season, { observe: 'response' });
  }

  partialUpdate(season: ISeason): Observable<EntityResponseType> {
    return this.http.patch<ISeason>(`${this.resourceUrl}/${getSeasonIdentifier(season) as number}`, season, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeason>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeason[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSeasonToCollectionIfMissing(seasonCollection: ISeason[], ...seasonsToCheck: (ISeason | null | undefined)[]): ISeason[] {
    const seasons: ISeason[] = seasonsToCheck.filter(isPresent);
    if (seasons.length > 0) {
      const seasonCollectionIdentifiers = seasonCollection.map(seasonItem => getSeasonIdentifier(seasonItem)!);
      const seasonsToAdd = seasons.filter(seasonItem => {
        const seasonIdentifier = getSeasonIdentifier(seasonItem);
        if (seasonIdentifier == null || seasonCollectionIdentifiers.includes(seasonIdentifier)) {
          return false;
        }
        seasonCollectionIdentifiers.push(seasonIdentifier);
        return true;
      });
      return [...seasonsToAdd, ...seasonCollection];
    }
    return seasonCollection;
  }
}
