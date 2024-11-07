export interface Season {
  season: string;
  url: string;
}

export interface FetchData {
  MRData: {
    SeasonTable: {
      Seasons: Season[];
    };
    total: string;
  };
}
