import { Copy, Share2 } from "lucide-react";

interface Props {
  className?: string;
  text: string;
  cli: string;
  onCopy: (val: string) => void;
  onShare: () => void;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    item: "px-2 py-1 text-xs gap-1.5",
    icon: 14,
  },
  md: {
    item: "px-3 py-2 text-sm gap-2",
    icon: 16,
  },
  lg: {
    item: "px-4 py-3 text-base gap-3",
    icon: 18,
  },
};
export default function CopyDropdown({className,
  text,
  cli,
  onCopy,
  onShare,
   size = "md",
}: Props) {
   const s = sizes[size];
 const baseClass =
  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm " +
  "hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer";

  return (
    <div className={className}>
      <button onClick={() => onCopy(text)} className={baseClass}>
        <Copy size={s.icon} className="opacity-70" />
        <span>Copy Text</span>
      </button>

      <button onClick={() => onCopy(cli)} className={baseClass}>
        <Copy size={s.icon} className="opacity-70" />
        <span>Copy CLI</span>
      </button>

      <button onClick={onShare} className={baseClass}>
        <Share2 size={s.icon} className="opacity-70" />
        <span>Share Link</span>
      </button>
    </div>
  );
}