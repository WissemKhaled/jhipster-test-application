import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SeasonDetailComponent } from './season-detail.component';

describe('Season Management Detail Component', () => {
  let comp: SeasonDetailComponent;
  let fixture: ComponentFixture<SeasonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ season: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SeasonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SeasonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load season on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.season).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
