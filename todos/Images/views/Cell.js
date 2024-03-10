import React, { Fragment } from "react";

export default ({ data, field, Link }) => {
  if (!data) {
    return null;
  }
  const { fullPath } = field.getRefList();
  return (
    <Fragment>
      {(Array.isArray(data) ? data : [data])
        .filter((item) => item)
        .map((item, index) => {
          const url = item[field.config.file]?.publicUrl;

          return (
            <Fragment key={item.id}>
              {url ? (
                <img src={url} />
              ) : (
                <Link path={fullPath} item={item}>
                  {item._label_}
                </Link>
              )}
            </Fragment>
          );
        })}
      <style>{`
        img {
          display: inline-block;
          max-heigh: 40px;
          max-width: 40px;
        }
      `}</style>
    </Fragment>
  );
};
