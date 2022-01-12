import { ISeason } from 'app/entities/season/season.model';

export interface IEpisode {
  id?: number;
  name?: string | null;
  season?: ISeason | null;
}

export class Episode implements IEpisode {
  constructor(public id?: number, public name?: string | null, public season?: ISeason | null) {}
}

export function getEpisodeIdentifier(episode: IEpisode): number | undefined {
  return episode.id;
}
