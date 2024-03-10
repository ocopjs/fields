import Relationship from "../Relationship";

class Images extends Relationship.implementation {}

export default {
  Images,
  MongoRelationshipInterface: Relationship.adapters.mongoose,
};
