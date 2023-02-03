import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetsRepository } from "./Ports/FleetRepository";
import { CreateFleet } from "./CreateFleet";

export class CreateFleetHandler implements CommandHandler<CreateFleet> {
  private fleetRepository: FleetsRepository;

  constructor(fleetRepository: FleetsRepository) {
    this.fleetRepository = fleetRepository;
  }

  async handle(command: CreateFleet): Promise<void> {
    await this.ensureFleetDoesNotAlreadyExist(command.userId); // Bonus TODO move into createNew with a Domain Service, domain should throw

    const fleet: Fleet = Fleet.createNew(command.userId);

    await this.fleetRepository.save(fleet);
  }

  private async ensureFleetDoesNotAlreadyExist(userId: string) {
    if (await this.fleetRepository.hasForUserId(userId)) {
      throw new Error(`Fleet already created for this user.`);
    }
  }
}
