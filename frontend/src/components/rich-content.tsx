import React from "react";

function renderChildren(children: any[] | undefined, keyPrefix: string) {
  return children?.map((child, index) => {
    const text = typeof child?.text === "string" ? child.text : "";
    return <span key={`${keyPrefix}-${index}`}>{text}</span>;
  });
}

export function RichContent({
  content,
  className,
}: {
  content: any[] | string | null | undefined;
  className?: string;
}) {
  if (typeof content === "string") {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {content.map((block: any, index: number) => {
        if (block?.type === "paragraph") {
          return (
            <p key={index} className="mb-4">
              {renderChildren(block.children, `paragraph-${index}`)}
            </p>
          );
        }

        if (block?.type === "heading") {
          const Tag = `h${block.level || 2}` as keyof React.JSX.IntrinsicElements;
          return React.createElement(
            Tag,
            {
              key: index,
              className: "mb-4 font-bold tracking-tight",
            },
            renderChildren(block.children, `heading-${index}`)
          );
        }

        if (block?.type === "list") {
          const Tag = (block.format === "ordered" ? "ol" : "ul") as keyof React.JSX.IntrinsicElements;
          return React.createElement(
            Tag,
            {
              key: index,
              className:
                block.format === "ordered" ? "mb-4 list-decimal pl-6" : "mb-4 list-disc pl-6",
            },
            block.children?.map((item: any, itemIndex: number) => (
              <li key={`item-${index}-${itemIndex}`}>
                {renderChildren(item.children, `list-${index}-${itemIndex}`)}
              </li>
            ))
          );
        }

        return null;
      })}
    </div>
  );
}
