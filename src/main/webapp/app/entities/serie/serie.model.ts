import dayjs from 'dayjs/esm';
import { ISeason } from 'app/entities/season/season.model';

export interface ISerie {
  id?: number;
  name?: string | null;
  priceInEuro?: number | null;
  dateTimeAdd?: dayjs.Dayjs | null;
  season?: ISeason | null;
}

export class Serie implements ISerie {
  constructor(
    public id?: number,
    public name?: string | null,
    public priceInEuro?: number | null,
    public dateTimeAdd?: dayjs.Dayjs | null,
    public season?: ISeason | null
  ) {}
}

export function getSerieIdentifier(serie: ISerie): number | undefined {
  return serie.id;
}
