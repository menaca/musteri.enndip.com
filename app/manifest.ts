import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "enndip — Sıfır araçta en uygun fiyat",
    short_name: "enndip",
    description:
      "Sıfır araç için ilan oluştur, yetkili bayiler en uygun teklifi sunsun.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#0B0B0B",
    lang: "tr",
    categories: ["shopping", "business", "automotive"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
