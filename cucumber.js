module.exports = {
  default: {
    format: ["progress"],
    requireModule: ["ts-node/register"],
    require: ["tests/StepsDefinitions/*.ts"],
    publishQuiet: true,
  },
};
