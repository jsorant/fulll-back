const common = {
  format: ["progress"],
  requireModule: ["ts-node/register"],
  require: ["tests/StepsDefinitions/*.ts"],
  publishQuiet: true,
};

module.exports = {
  default: {
    ...common,
  },
  inmemory: {
    ...common,
    worldParameters: {
      fleetPersistenceType: "inmemory",
    },
  },
  sqlite3: {
    ...common,
    worldParameters: {
      fleetPersistenceType: "sqlite3",
    },
  },
};
