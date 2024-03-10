import { Integer } from "../../";
import { resolveView } from "../../resolve-view";
export default {
  type: "Currency",
  implementation: Integer.implementation,
  views: {
    Controller: Integer.views.Controller,
    Field: resolveView("types/Currency/views/Field"),
    Cell: resolveView("types/Currency/views/Cell"),
    Filter: Integer.views.Filter,
  },
  adapters: Integer.adapters,
};
