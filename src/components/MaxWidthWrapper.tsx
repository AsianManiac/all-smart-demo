import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-2xl lg:px-8 px-4 py-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
