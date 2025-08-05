import localFont from "next/font/local";

export const euclidCircular = localFont({
  src: [
    {
      path: "../../../../public/fonts/euclid/EuclidCircularA-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/euclid/EuclidCircularA-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/euclid/EuclidCircularA-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/euclid/EuclidCircularA-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-euclid",
  display: "swap",
});
