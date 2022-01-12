import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SeasonService } from '../service/season.service';

import { SeasonComponent } from './season.component';

describe('Season Management Component', () => {
  let comp: SeasonComponent;
  let fixture: ComponentFixture<SeasonComponent>;
  let service: SeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SeasonComponent],
    })
      .overrideTemplate(SeasonComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeasonComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SeasonService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.seasons?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
