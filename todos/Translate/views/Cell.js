const Cell = (props) => {
  console.log("Translate Cell", props);
  if (!props.data) {
    return null;
  }
  return props.data?.map((t) => t.lang).join(",");
};

export default Cell;
