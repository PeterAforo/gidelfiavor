import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";

const DynamicFavicon = () => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (settings?.site_favicon) {
      // Remove existing favicons
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      existingFavicons.forEach((el) => el.remove());

      // Create new favicon link
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/x-icon";
      link.href = settings.site_favicon;
      document.head.appendChild(link);

      // Also add apple-touch-icon for iOS
      const appleLink = document.createElement("link");
      appleLink.rel = "apple-touch-icon";
      appleLink.href = settings.site_favicon;
      document.head.appendChild(appleLink);
    }
  }, [settings?.site_favicon]);

  // Also update the page title if site_name is set
  useEffect(() => {
    if (settings?.site_name) {
      const currentTitle = document.title;
      // Only update if it's the default title
      if (currentTitle.includes("Gidel") || !currentTitle) {
        document.title = `${settings.site_name}${settings.site_tagline ? ` - ${settings.site_tagline}` : ""}`;
      }
    }
  }, [settings?.site_name, settings?.site_tagline]);

  return null; // This component doesn't render anything
};

export default DynamicFavicon;
