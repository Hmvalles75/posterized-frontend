import { cn } from "@/lib/utils";

interface WatermarkOverlayProps {
  children: React.ReactNode;
  className?: string;
}

const WatermarkOverlay = ({ children, className }: WatermarkOverlayProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <span className="text-4xl sm:text-6xl font-bold text-white transform -rotate-12 select-none">
          POSTERIZED.AI
        </span>
      </div>
    </div>
  );
};

export default WatermarkOverlay;
