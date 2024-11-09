export interface RaceState {
  raceId: string;
  raceName: string;
  circuitName: string;
  date: string;
  country: string;
  url: string;
}

export interface Race {
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      country: string;
      locality: string;
    };
  };
  date: string;
}
