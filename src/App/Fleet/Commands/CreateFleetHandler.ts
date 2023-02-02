import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetRepository } from "./Ports/FleetRepository";
import { CreateFleet } from "./CreateFleet";

export class CreateFleetHandler implements CommandHandler<CreateFleet> {
  private fleetRepository: FleetRepository;

  constructor(fleetRepository: FleetRepository) {
    this.fleetRepository = fleetRepository;
  }

  async handle(command: CreateFleet): Promise<void> {
    await this.ensureFleetDoesNotAlreadyExist(command.userId);
    const fleet: Fleet = Fleet.createNewFleet(command.userId);

    //TODO REMOVE
    fleet.register("plate_1");
    fleet.register("plate_2");
    fleet.register("plate_3");

    await this.fleetRepository.saveFleet(fleet);
  }

  private async ensureFleetDoesNotAlreadyExist(userId: string) {
    if (await this.fleetRepository.hasFleetForUserId(userId)) {
      throw new Error(`Fleet already created.`);
    }
  }
}
