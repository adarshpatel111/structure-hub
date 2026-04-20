import { Copy, Share2 } from "lucide-react";

interface Props {
  className?: string;
  text: string;
  cli: string;
  onCopy: (val: string) => void;
  onShare: () => void;
}

export default function CopyDropdown({className,
  text,
  cli,
  onCopy,
  onShare,
}: Props) {
 const baseClass =
  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm " +
  "hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer";

  return (
    <div className={className}>
      <button
        onClick={() => onCopy(text)}
        className={baseClass}
      >
        <Copy size={16} className="opacity-70" />
        <span>Copy Text</span>
      </button>

      <button
        onClick={() => onCopy(cli)}
        className={baseClass}
      >
        <Copy size={16} className="opacity-70" />
        <span>Copy CLI</span>
      </button>

      <button
        onClick={onShare}
        className={baseClass}
      >
        <Share2 size={16} className="opacity-70" />
        <span>Share Link</span>
      </button>
    </div>
  );
}