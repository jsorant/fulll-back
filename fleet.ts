import mongoose from "mongoose";

class App {
  constructor() {
    this.initialiseDatabaseConnection();
  }

  private initialiseDatabaseConnection(): void {
    //const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    //mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    const uri = "mongodb://localhost:27017";
    mongoose.connect(uri);
  }

  public handleCommandLineQuery(): void {}
}

export default App;

const app = new App();

app.handleCommandLineQuery();

// beforeAll:
// mongoose.connect

//afterAll:
// mongoose.disconnect
// mongoose.connecton.close()
