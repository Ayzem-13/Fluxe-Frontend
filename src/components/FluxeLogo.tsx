export function FluxeLogo(props: React.ComponentProps<"svg">) {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"{...props}>
        <g fill="none" stroke="#1DA1F2" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">

          <path d="M 35 85 C 35 60, 25 35, 50 20 C 65 11, 75 20, 80 25" />

          <path d="M 32 50 C 50 45, 65 55, 75 50" />

        </g>
      </svg>
      );
}
