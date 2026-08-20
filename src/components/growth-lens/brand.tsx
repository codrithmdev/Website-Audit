import { PanelsTopLeft, TrendingUp } from "lucide-react";

export function Brand() {
  return (
    <button
      onClick={() => location.reload()}
      className="flex items-center gap-2.5"
      aria-label="GrowthLens home"
    >
      <span className="relative grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <PanelsTopLeft size={19} />
        <TrendingUp
          className="absolute -right-1 -top-1 rounded-full bg-growth p-0.5 text-growth-foreground"
          size={14}
        />
      </span>
      <span className="text-lg font-extrabold">
        Growth<span className="text-growth">Lens</span>
      </span>
    </button>
  );
}
