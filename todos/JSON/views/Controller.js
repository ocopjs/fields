import FieldController from "../../../Controller";

export default class TextController extends FieldController {
  getFilterGraphQL = ({ type, value }) => {
    const key = type === "is_i" ? `${this.path}_i` : `${this.path}_${type}`;
    return { [key]: value };
  };
  getFilterLabel = ({ label }) => {
    return `${this.label} ${label.toLowerCase()}`;
  };
  formatFilter = ({ label, value }) => {
    return `${this.getFilterLabel({ label })}: "${value}"`;
  };
  getFilterTypes = () => [];
}
