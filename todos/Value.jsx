import React, { lazy, useMemo } from "react";
import { Fragment } from "react";

const Markdown = lazy(() => import("./Markdown"));

const f = new Intl.NumberFormat();
/**
 * @param {{round:Boolean}} param
 * @returns
 */
export default function Value({ children, round, step, className }) {
  const value = useMemo(() => {
    if (typeof children === "number") {
      if (round) children = Math.round(children);
      if (step) children = Math.ceil(children / step) * step;
      return f.format(children);
    }
    if (typeof children === "string") {
      const number = f.format(Number(children));
      if (number !== "NaN") return number;
      const isHtml = /<\/?[a-z][\s\S]*>/i.test(children);
      return isHtml
        ? (
          <div
            className={className}
            dangerouslySetInnerHTML={{ __html: children }}
          />
        )
        : <Markdown>{children}</Markdown>;
    }
    return children;
  }, [children]);
  return (
    <Fragment>
      {value}
      <style>{`img { max-width: 100%; }`}</style>
    </Fragment>
  );
}
