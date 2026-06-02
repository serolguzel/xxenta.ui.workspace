export interface CreateFlights {
    id: number | null;
    code: string;
    flightNumber: number | null;
    fromAirport: string;
    toAirport: string;
    direction: Direction;
    departureTime: Date;
    arrivalTime: Date;
    terminalCode: string;
    airlineCode: string;
    airlineIcaoCode: string;
    icaoCode: string;
    provider: string;

    isDefault: boolean;
}
export enum Direction {
    Arrival = 'Arrival',
    Departure = 'Departure',
    Intermediate = "Intermediate"
}

export interface FlightsModel extends CreateFlights {

}