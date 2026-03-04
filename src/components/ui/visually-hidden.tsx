import * as React from "react";

function VisuallyHidden({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="sr-only"
      {...props}
    >
      {children}
    </div>
  );
}

export { VisuallyHidden };
