import type { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <div className="shell">{children}</div>;
}
