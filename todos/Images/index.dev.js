const { Relationship } = require("@ocopjs/fields");

module.exports = {
  type: "Images",
  isRelationship: true,
  implementation: Relationship.implementation,
  views: {
    Controller: require.resolve("./views/Controller"),
    Field: require.resolve("./views/Field"),
    Filter: Relationship.views.Filter,
    Cell: require.resolve("./views/Cell"),
  },
  adapters: Relationship.adapters,
};
