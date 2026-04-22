import { useState } from "react";

type ToggleButtonProps = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
    onIcon?: React.ReactNode;
    offIcon?: React.ReactNode;
    onColor?: string;
    offColor?: string;
    tooltipOn?: string;
    tooltipOff?: string;
    size?: "sm" | "md" | "lg";
};

const sizes = {
    sm: {
        track: "w-[80px] h-[40px] p-[4px]",
        knob: "h-[30px] w-[30px] top-[5px] left-[5px]",
        knobMove: "translate-x-[38px]",
        indicator: "h-[18px] w-[18px] right-[8px]",
        indicatorMove: "translate-x-[-40px]",
        tooltip: "top-full mt-1 text-[10px]",
    },
    md: {
        track: "w-[115px] h-[55px] p-[6px]",
        knob: "h-[42px] w-[42px] top-[6px] left-[6px]",
        knobMove: "translate-x-[55px]",
        indicator: "h-[25px] w-[25px] right-[12px]",
        indicatorMove: "translate-x-[-65px]",
        tooltip: "top-full mt-2 text-xs",
    },
    lg: {
        track: "w-[140px] h-[65px] p-[7px]",
        knob: "h-[50px] w-[50px] top-[7px] left-[7px]",
        knobMove: "translate-x-[70px]",
        indicator: "h-[30px] w-[30px] right-[14px]",
        indicatorMove: "translate-x-[-80px]",
        tooltip: "top-full mt-3 text-sm",
    },
};
const ToggleButton = ({
    checked,
    onChange,
    onIcon,
    offIcon,
    onColor = "#60d480",
    offColor = "#ef565f",
    tooltipOn = "On",
    tooltipOff = "Off",
    size = "md",
}: ToggleButtonProps) => {
    const [internalChecked, setInternalChecked] = useState(false);
    const isChecked = checked ?? internalChecked;
    const s = sizes[size || "md"];

    // ✅ handle change
    const handleChange = (value: boolean) => {
        if (onChange) {
            onChange(value);
        } else {
            setInternalChecked(value);
        }
    };

    // ✅ default icon
    const DefaultOffIcon = () => (
        <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
        >
            <line x1="3" y1="3" x2="20" y2="20" />
        </svg>
    );

    // ✅ icon logic
    const renderIcon = () => {
        if (isChecked) return onIcon ?? null;
        return offIcon ?? <DefaultOffIcon />;
    };

    return (
        <div className="w-full flex justify-center">
            <label className="flex items-center justify-center cursor-pointer relative group">

                {/* input */}
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleChange(e.target.checked)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {/* track */}
                <div className={`${s.track} rounded-full
                bg-[#252532] border border-[#32303e]
                shadow-[inset_0px_5px_10px_#16151c,0px_3px_6px_-2px_#403f4e]`} />

                {/* knob */}
                <span
                    className={`absolute ${s.knob} rounded-full
              bg-gradient-to-b from-[#3b3a4e] to-[#272733]
              shadow-[inset_0px_5px_4px_#424151,0px_4px_15px_#0f0e17]
              transition-all duration-300
              ${isChecked ? s.knobMove : ""}`}
                />

                {/* indicator */}
                <span
                    className={`absolute ${s.indicator} top-1/2 -translate-y-1/2
              rounded-full flex items-center justify-center
              border-[3px] transition-all duration-300
              ${isChecked ? s.indicatorMove : ""}`}
                    style={{
                        borderColor: isChecked ? onColor : offColor,
                        color: isChecked ? onColor : offColor,
                    }}
                >
                    {renderIcon()}
                </span>

                {/* ✅ tooltip (must be inside label for group-hover) */}
                <span
                    className={`absolute ${s.tooltip} left-1/2 -translate-x-1/2
              px-2 py-1 rounded-md
              bg-black text-white whitespace-nowrap
              opacity-0 scale-95
              transition-all duration-200
              group-hover:opacity-100 group-hover:scale-100`}
                >
                    {!isChecked ? tooltipOn : tooltipOff}
                </span>
            </label>
        </div>
    );
};

export default ToggleButton;