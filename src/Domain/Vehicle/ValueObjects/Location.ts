import { ValueObject } from "../../DddModel/ValueObject";
import { Altitude } from "./Altitude";
import { Latitude } from "./Latitude";
import { Longitude } from "./Longitude";

export class Location extends ValueObject {
  public readonly latitude: Latitude;
  public readonly longitude: Longitude;
  public readonly altitude?: Altitude;

  constructor(
    latitudeDegrees: number,
    longitudeDegrees: number,
    altitudeMeters?: number
  ) {
    super();
    this.latitude = Latitude.makeFromDegrees(latitudeDegrees);
    this.longitude = Longitude.makeFromDegrees(longitudeDegrees);
    this.altitude =
      altitudeMeters === undefined
        ? undefined
        : Altitude.makeFromMeters(altitudeMeters);
    Object.freeze(this);
  }
}
