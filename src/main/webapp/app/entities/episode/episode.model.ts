import { ISeason } from 'app/entities/season/season.model';

export interface IEpisode {
  id?: number;
  name?: string | null;
  seasons?: ISeason[] | null;
}

export class Episode implements IEpisode {
  constructor(public id?: number, public name?: string | null, public seasons?: ISeason[] | null) {}
}

export function getEpisodeIdentifier(episode: IEpisode): number | undefined {
  return episode.id;
}
