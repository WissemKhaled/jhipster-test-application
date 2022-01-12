import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SeasonComponent } from '../list/season.component';
import { SeasonDetailComponent } from '../detail/season-detail.component';
import { SeasonUpdateComponent } from '../update/season-update.component';
import { SeasonRoutingResolveService } from './season-routing-resolve.service';

const seasonRoute: Routes = [
  {
    path: '',
    component: SeasonComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SeasonDetailComponent,
    resolve: {
      season: SeasonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SeasonUpdateComponent,
    resolve: {
      season: SeasonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SeasonUpdateComponent,
    resolve: {
      season: SeasonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(seasonRoute)],
  exports: [RouterModule],
})
export class SeasonRoutingModule {}
