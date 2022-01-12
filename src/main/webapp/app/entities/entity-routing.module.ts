import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'serie',
        data: { pageTitle: 'jhipsterTestApplicationApp.serie.home.title' },
        loadChildren: () => import('./serie/serie.module').then(m => m.SerieModule),
      },
      {
        path: 'season',
        data: { pageTitle: 'jhipsterTestApplicationApp.season.home.title' },
        loadChildren: () => import('./season/season.module').then(m => m.SeasonModule),
      },
      {
        path: 'episode',
        data: { pageTitle: 'jhipsterTestApplicationApp.episode.home.title' },
        loadChildren: () => import('./episode/episode.module').then(m => m.EpisodeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
