import React from "react";

export function FluxeLogo(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" {...props}>
      <g fill="none" stroke="#1DA1F2" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 35 85 C 35 60, 25 35, 50 20 C 65 11, 75 20, 80 25" />
        <path d="M 34 50 C 50 45, 65 55, 75 50" />
      </g>
    </svg>
  );
}
