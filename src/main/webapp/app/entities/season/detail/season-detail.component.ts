import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeason } from '../season.model';

@Component({
  selector: 'jhi-season-detail',
  templateUrl: './season-detail.component.html',
})
export class SeasonDetailComponent implements OnInit {
  season: ISeason | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ season }) => {
      this.season = season;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
