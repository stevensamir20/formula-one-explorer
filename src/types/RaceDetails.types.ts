export interface RaceRow {
  driverId: string;
  driverName: string;
  nationality: string;
  team: string;
  position: string;
  laps: string;
  status: string;
}

export interface RaceResult {
  number: string;
  position: string;
  points: string;
  grid: string;
  laps: string;
  status: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
  Time: {
    millis: string;
    time: string;
  };
}
