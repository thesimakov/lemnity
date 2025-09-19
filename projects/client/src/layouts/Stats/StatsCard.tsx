import React from "react";
import SvgIcon from "../../components/SvgIcon";

interface StatsCardProps {
  title: string;
  amount: number;
  currency?: string;
  iconColor?: string;
  tip?: string;
  isNegative?: boolean;
  className?: string;
  maxAmount?: number;
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  amount,
  currency,
  icon,
  iconColor,
  tip,
  isNegative = false,
  className = "",
  maxAmount,
}) => {
  const formatAmount = (value: number) => {
    const sign = isNegative ? "-" : "";
    return `${sign}${Math.abs(value)}`;
  };

  const renderBackgroundIcon = () => (
    <SvgIcon
      src={icon}
      className={`opacity-20 select-none ${iconColor || ""}`}
      size="30%"
    />
  );

  return (
    <div
      className={`relative flex flex-col justify-between font-roboto
    min-h-0 h-auto w-full max-w-[195px]
    aspect-6/5
    bg-[#F7FBFF] rounded-[5px] border border-gray-200
    p-2 lg:p-3 pr-0.5 md:pr-1 lg:pr-1 xl:pr-1.5 ${className || ""}`}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {renderBackgroundIcon()}
      </div>

      <div className="relative gap-2">
        <div className="flex items-start justify-between">
          <h3 className="text-[13px] font-normal text-[#656565]">{title}</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div
          className={`text-xl ${isNegative ? "text-[#FF5183]" : "text-black"}`}
        >
          {formatAmount(amount)} {currency}{" "}
          {maxAmount && <span> / {maxAmount}</span>}
        </div>
      </div>

      <div className="relative z-10 min-h-[20px]">
        {tip && (
          <p className="text-[10px] text-[#FF5183] leading-relaxed">{tip}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
