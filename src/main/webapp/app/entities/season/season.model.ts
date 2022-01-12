import { ISerie } from 'app/entities/serie/serie.model';
import { IEpisode } from 'app/entities/episode/episode.model';

export interface ISeason {
  id?: number;
  name?: string | null;
  series?: ISerie[] | null;
  episode?: IEpisode | null;
}

export class Season implements ISeason {
  constructor(public id?: number, public name?: string | null, public series?: ISerie[] | null, public episode?: IEpisode | null) {}
}

export function getSeasonIdentifier(season: ISeason): number | undefined {
  return season.id;
}
