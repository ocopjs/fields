import mongoose from "mongoose";
import { Decimal as _Decimal } from "decimal.js";
import { Implementation } from "../../Implementation";
import { MongooseFieldAdapter } from "@ocopjs/adapter-mongoose";

export class Decimal extends Implementation {
  constructor(path, { symbol }) {
    super(...arguments);
    this.symbol = symbol;
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }
  gqlOutputFieldResolvers() {
    return { [`${this.path}`]: (item) => item[this.path] };
  }

  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields("String"),
      ...this.orderingInputFields("String"),
      ...(this.adapter.listAdapter.parentAdapter.name === "prisma_postgresql"
        ? []
        : this.inInputFields("String")),
    ];
  }
  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }
  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }
  extendAdminMeta(meta) {
    return {
      ...meta,
      symbol: this.symbol,
    };
  }
  getBackingTypes() {
    return { [this.path]: { optional: true, type: "string | null" } };
  }
}

export class MongoDecimalInterface extends MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    const validator = (a) => typeof a === "object" && /^-?\d*\.?\d*$/.test(a);
    const schemaOptions = {
      type: mongoose.Decimal128,
      validate: {
        validator: this.buildValidator(validator),
        message: "{VALUE} is not a Decimal value",
      },
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config),
    });
  }

  setupHooks({ addPreSaveHook, addPostReadHook }) {
    // Updates the relevant value in the item provided (by reference)
    addPreSaveHook((item) => {
      // Only run the hook if the item actually contains the field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(this.path in item)) {
        return item;
      }

      if (item[this.path]) {
        if (typeof item[this.path] === "string") {
          item[this.path] = mongoose.Types.Decimal128.fromString(
            item[this.path],
          );
        } else {
          // Should have been caught by the validator??
          throw `Invalid Decimal value given for '${this.path}'`;
        }
      } else {
        item[this.path] = null;
      }

      // else: Must either be undefined or a Decimal128 object, so leave it alone.
      return item;
    });
    addPostReadHook((item) => {
      if (item[this.path]) {
        item[this.path] = item[this.path].toString();
      }
      return item;
    });
  }

  getQueryConditions(dbPath) {
    return {
      ...this.equalityConditions(
        dbPath,
        (s) => s && mongoose.Types.Decimal128.fromString(s),
      ),
      ...this.orderingConditions(
        dbPath,
        (s) => s && mongoose.Types.Decimal128.fromString(s),
      ),
      ...this.inConditions(
        dbPath,
        (s) => s && mongoose.Types.Decimal128.fromString(s),
      ),
    };
  }
}
