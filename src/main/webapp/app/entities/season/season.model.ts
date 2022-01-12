import { IEpisode } from 'app/entities/episode/episode.model';
import { ISerie } from 'app/entities/serie/serie.model';

export interface ISeason {
  id?: number;
  name?: string | null;
  episodes?: IEpisode[] | null;
  serie?: ISerie | null;
}

export class Season implements ISeason {
  constructor(public id?: number, public name?: string | null, public episodes?: IEpisode[] | null, public serie?: ISerie | null) {}
}

export function getSeasonIdentifier(season: ISeason): number | undefined {
  return season.id;
}
