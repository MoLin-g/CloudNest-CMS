import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Cloud } from "lucide-react";
import { getSiteSettings } from "@/lib/api";

type LogoProps = {
  className?: string;
  showText?: boolean;
  imageClassName?: string;
  textClassName?: string;
};

const Logo = ({
  className,
  showText = true,
  imageClassName,
  textClassName,
}: LogoProps) => {
  const [siteName, setSiteName] = useState("CloudNest");

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s.site_name) setSiteName(s.site_name);
    }).catch(() => {});
  }, []);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        className={cn(
          "h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center",
          imageClassName
        )}
      >
        <Cloud size={24} className="text-white" />
      </div>
      {showText && (
        <span className={cn("text-xl font-bold text-foreground", textClassName)}>
          {siteName}
        </span>
      )}
    </div>
  );
};

export default Logo;
