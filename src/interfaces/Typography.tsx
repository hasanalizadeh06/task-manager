import { ElementType, ReactNode } from "react";

export interface TypographyProps {
  variant: TypographyVariant;
  weight?: TypographyWeight;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "b1"
  | "b2"
  | "b3"
  | "btn-sm"
  | "btn-lg"
  | "s1"
  | "s2"
  | "s3";

export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";