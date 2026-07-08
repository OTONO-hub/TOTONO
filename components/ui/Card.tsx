import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-2xl bg-white shadow ${className}`}
    >
      {children}
    </div>
  );
}