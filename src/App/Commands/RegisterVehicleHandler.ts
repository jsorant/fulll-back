import { Vehicle } from "../../Domain/Fleet/Entities/Vehicle";
import { Fleet } from "../../Domain/Fleet/Fleet";
import { CommandHandler } from "../CqrsModel/CommandHandler";
import { FleetRepository } from "./Ports/FleetRepository";
import { RegisterVehicle } from "./RegisterVehicle";

export class RegisterVehicleHandler implements CommandHandler<RegisterVehicle> {
  private fleetRepository: FleetRepository;

  constructor(fleetRepository: FleetRepository) {
    this.fleetRepository = fleetRepository;
  }

  async execute(command: RegisterVehicle): Promise<void> {
    const fleet: Fleet = await this.fleetRepository.getFleet(command.fleetId);
    const vehicle: Vehicle = new Vehicle(command.plate);
    fleet.register(vehicle);
    this.fleetRepository.saveFleet(fleet);
  }
}
