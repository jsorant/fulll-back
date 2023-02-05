import { CommandHandler } from "../CqrsModel/CommandHandler";
import { Fleet } from "../../Domain/Fleet/Fleet";
import { FleetsRepository } from "./Ports/FleetsRepository";
import { CreateFleet } from "./CreateFleet";

export class CreateFleetHandler implements CommandHandler<CreateFleet> {
  private fleetsRepository: FleetsRepository;

  constructor(fleetsRepository: FleetsRepository) {
    this.fleetsRepository = fleetsRepository;
  }

  async handle(command: CreateFleet): Promise<void> {
    // TODO Business rule:
    //   Should this rule be moved into a 'Domain' wrapped into a Domain Service ?
    //   In that case, Domain would have knowledge of repositories...
    await this.ensureFleetDoesNotAlreadyExist(command.userId);

    const fleet: Fleet = Fleet.createNew(command.userId);

    await this.fleetsRepository.save(fleet);
  }

  private async ensureFleetDoesNotAlreadyExist(userId: string) {
    if (await this.fleetsRepository.hasForUserId(userId)) {
      throw new Error(`Fleet already created for this user.`);
    }
  }
}
