import { Vehicle } from "../../../Domain/Fleet/Entities/Vehicle";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { Location } from "../../../Domain/Fleet/ValueObjects/Location";
import {
  FleetInterface,
  LocationInterface,
  VehicleInterface,
} from "./Documents/FleetDocument";

export class MongoDBFleetAdapter {
  adaptToMongo(fleet: Fleet): FleetInterface {
    return {
      id: fleet.getId(),
      userId: fleet.getUserId(),
      vehicles: this.adaptVehiclesToMongo(fleet.getVehicles()),
    };
  }

  adaptFromMongo(object: any): Fleet {
    return Fleet.createFleet(
      object.id,
      object.userId,
      this.adaptVehiclesFromMongo(object.vehicles)
    );
  }

  private adaptVehiclesToMongo(
    vehicles: Array<Vehicle>
  ): Array<VehicleInterface> {
    return vehicles.map(this.adaptVehicleToMongo);
  }

  private adaptVehicleToMongo(vehicle: Vehicle): VehicleInterface {
    const location: Location | undefined = vehicle.getLocation();
    if (location === undefined) {
      return {
        id: vehicle.getId(),
        plateNumber: vehicle.getPlateNumber().value,
      };
    } else {
      return {
        id: vehicle.getId(),
        plateNumber: vehicle.getPlateNumber().value,
        location: {
          latitudeDegrees: location.latitudeDegrees,
          longitudeDegrees: location.longitudeDegrees,
          altitudeMeters: location.altitudeMeters,
        },
      };
    }
  }

  private adaptVehiclesFromMongo(vehicles: Array<any>): Array<Vehicle> {
    return vehicles.map(this.adaptVehicleFromMongo);
  }

  private adaptVehicleFromMongo(vehicle: any): Vehicle {
    const location: any = vehicle.location;
    if (location === undefined) {
      return new Vehicle(vehicle.plateNumber, vehicle.id);
    } else {
      return new Vehicle(
        vehicle.plateNumber,
        vehicle.id,
        new Location(
          location.latitudeDegrees,
          location.longitudeDegrees,
          location.altitudeMeters
        )
      );
    }
  }
}
