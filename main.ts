import { Application } from "./Application";

async function main() {
  const application: Application = new Application();
  await application.start();
}

main().then(() => {});
