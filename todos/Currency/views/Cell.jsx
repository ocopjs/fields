const f = new Intl.NumberFormat();
export default ({ data }) => {
  if (!data) return null;
  return f.format(data);
};
