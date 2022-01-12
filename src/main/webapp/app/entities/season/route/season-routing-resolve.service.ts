import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISeason, Season } from '../season.model';
import { SeasonService } from '../service/season.service';

@Injectable({ providedIn: 'root' })
export class SeasonRoutingResolveService implements Resolve<ISeason> {
  constructor(protected service: SeasonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISeason> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((season: HttpResponse<Season>) => {
          if (season.body) {
            return of(season.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Season());
  }
}
