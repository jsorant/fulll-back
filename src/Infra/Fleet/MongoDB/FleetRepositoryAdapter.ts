import { Vehicle } from "../../../Domain/Fleet/Entities/Vehicle";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetInterface, VehicleInterface } from "./Documents/FleetDocument";

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
    return {
      id: vehicle.getId(),
      plateNumber: vehicle.getPlateNumber().value,
    };
  }

  private adaptVehiclesFromMongo(vehicles: Array<any>): Array<Vehicle> {
    return vehicles.map(this.adaptVehicleFromMongo);
  }

  private adaptVehicleFromMongo(vehicle: any): Vehicle {
    return new Vehicle(vehicle.plateNumber, vehicle.id);
  }
}
