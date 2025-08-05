import { ElementType } from "react";

import { cn } from "@/lib/utils";
import { euclidCircular } from "@/shared/assets/fonts";
import { FONT_SIZES } from "@/shared/lib/constants/typography";
import { TypographyProps, TypographyVariant, TypographyWeight } from "@/interfaces/Typography";



const getDefaultElement = (variant: TypographyVariant): ElementType => {
  switch (variant) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return variant;
    case "s1":
    case "s2":
    case "s3":
      return "h2";
    default:
      return "p";
  }
};

const getDefaultWeight = (variant: TypographyVariant): TypographyWeight => {
  switch (variant) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return "semibold";
    case "s1":
      return "medium";
    case "s2":
      return "semibold";
    case "s3":
      return "medium";
    default:
      return "regular";
  }
};

export const Typography = ({
  variant,
  weight,
  children,
  className,
  as,
}: TypographyProps) => {
  const Component = as || getDefaultElement(variant);
  const defaultWeight = getDefaultWeight(variant);
  const fontWeight = weight || defaultWeight;

  return (
    <Component
      className={cn(
        euclidCircular.className,
        FONT_SIZES[variant],
        `font-${fontWeight}`,
        className,
      )}
    >
      {children}
    </Component>
  );
};
