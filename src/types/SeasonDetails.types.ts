export interface RaceState {
  raceId: string;
  raceName: string;
  circuitName: string;
  date: string;
  pin: boolean;
}

export interface Race {
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
  };
  date: string;
}

export interface FetchData {
  MRData: {
    RaceTable: {
      Races: Race[];
    };
    total: string;
  };
}
