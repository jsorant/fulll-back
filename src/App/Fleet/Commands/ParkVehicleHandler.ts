import { Fleet } from "../../../Domain/Fleet/Fleet";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { ParkVehicle } from "./ParkVehicle";
import { FleetRepository } from "./Ports/FleetRepository";

export class ParkVehicleHandler implements CommandHandler<ParkVehicle> {
  private fleetRepository: FleetRepository;

  constructor(fleetRepository: FleetRepository) {
    this.fleetRepository = fleetRepository;
  }

  async execute(command: ParkVehicle): Promise<void> {
    const fleet: Fleet = await this.fleetRepository.getFleet(command.fleetId);
    fleet.parkVehicle(
      command.plateNumber,
      command.locationLatitudeDegrees,
      command.locationLongitudeDegrees,
      command.locationAltitudeMeters
    );
    this.fleetRepository.saveFleet(fleet);
  }
}
