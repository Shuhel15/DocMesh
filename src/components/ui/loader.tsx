import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div
      className={cn(
        "h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent text-foreground",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
