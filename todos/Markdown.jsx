import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import slugify from "slugify";
import MathJax from "@ocopjs/react-mathjax";

/** REMARK, REHYPE */
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import rehypeKatex from "rehype-katex";

const generateId = (content) => {
  const stringContent = String(content);
  const idRegex = / {#([^]+?)}$/;
  let string = stringContent.replace(/ +$/, "");
  let matched = string.match(idRegex);

  const parseContent = stringContent.replace(idRegex, "");
  if (matched) {
    let id = matched[1];
    if (!!id.length) {
      const customId = slugify(parseContent);
      return {
        id: customId,
        content: parseContent,
      };
    }

    return {
      id,
      content: parseContent,
    };
  }

  return {
    id: "",
    content: parseContent,
  };
};

const Markdown = ({ children, className = "" }) => {
  return useMemo(() => {
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(children);
    return isHtml
      ? (
        <div
          dangerouslySetInnerHTML={{ __html: children }}
          className={className}
        />
      )
      : (
        <MathJax.Provider input="svg">
          <ReactMarkdown
            className={"line-break space-y-4 text-base font-noto text-semantic-primary px-4 markdown-body"}
            remarkPlugins={[
              remarkGfm,
              remarkMath,
              // remarkParse, remarkRehype
            ]}
            rehypePlugins={[
              // rehypeMathjax,
              rehypeKatex,
            ]}
            components={{
              math: (props) => <MathJax.Node formula={props.value} />,
              inlineMath: (props) => (
                <MathJax.Node inline formula={props.value} />
              ),
              table: ({ children }) => (
                <table
                  className={"min-w-full divide-y divide-gray-300 overflow-auto"}
                >
                  {children}
                </table>
              ),

              tbody: ({ children }) => (
                <tbody className="divide-y divide-gray-200 overflow-auto">
                  {children}
                </tbody>
              ),
              td: ({ children }) => (
                <td className="d-table-cell">{children}</td>
              ),
              h1: ({ children }) => {
                const { id, content } = generateId(children);
                return (
                  <h2 id={id} className={"text-xl font-bold leading-30"}>
                    {id ? content : children}
                  </h2>
                );
              },
              h2: ({ children }) => {
                const { id, content } = generateId(children);
                return (
                  <h2 id={id} className={"text-xl font-bold leading-30"}>
                    {id ? content : children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const { id, content } = generateId(children);

                return (
                  <h3 id={id} className={"text-lg font-bold leading-30"}>
                    {id ? content : children}
                  </h3>
                );
              },
              h4: ({ children }) => {
                const { id, content } = generateId(children);
                return (
                  <h4 id={id} className={"text-md font-bold leading-30"}>
                    {id ? content : children}
                  </h4>
                );
              },
              h5: ({ children }) => {
                const { id, content } = generateId(children);
                return (
                  <h5 id={id} className={"font-bold leading-30"}>
                    {id ? content : children}
                  </h5>
                );
              },
              h6: ({ children }) => {
                const { id, content } = generateId(children);
                return (
                  <h6 id={id} className={"font-bold leading-30"}>
                    {id ? content : children}
                  </h6>
                );
              },
              ol: ({ children }) => (
                <ol className={"list-decimal"}>{children}</ol>
              ),
              ul: ({ children }) => <ol className={"list-disc"}>{children}</ol>,
              li: ({ children }) => <li className={"ml-8"}>{children}</li>,
              img: ({ src, alt }) => {
                if (!src || src.includes("leaderbook.com")) return null;
                return (
                  <img
                    src={src}
                    width={600}
                    height={600}
                    alt={alt ?? "Hình minh họa"}
                  />
                );
              },
            }}
          >
            {children}
          </ReactMarkdown>
        </MathJax.Provider>
      );
  }, [children, className]);
};

export default Markdown;
