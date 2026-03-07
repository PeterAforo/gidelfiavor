import { useEffect } from "react";
import { useSiteContent } from "@/hooks/useCms";

// Convert hex to HSL for CSS variable
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// Calculate if a color is light or dark to determine contrast text color
const isLightColor = (h: number, s: number, l: number): boolean => {
  return l > 50;
};

const ThemeColorProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: content } = useSiteContent();

  useEffect(() => {
    if (content?.theme_color) {
      try {
        const hsl = hexToHSL(content.theme_color);
        // Update CSS custom property for primary color
        document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
        
        // Also set a slightly darker version for hover states
        const darkerL = Math.max(0, hsl.l - 10);
        document.documentElement.style.setProperty('--primary-hover', `${hsl.h} ${hsl.s}% ${darkerL}%`);
        
        // Set ring color to match
        document.documentElement.style.setProperty('--ring', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
        
        // Generate stats section background color (use the primary color)
        document.documentElement.style.setProperty('--stats-bg', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
        
        // Calculate contrasting text color for stats section
        const needsLightText = !isLightColor(hsl.h, hsl.s, hsl.l);
        if (needsLightText) {
          // Dark background - use white/light text
          document.documentElement.style.setProperty('--stats-foreground', '0 0% 100%');
          document.documentElement.style.setProperty('--stats-muted', '0 0% 85%');
          document.documentElement.style.setProperty('--stats-accent', '0 0% 100%');
        } else {
          // Light background - use dark text
          document.documentElement.style.setProperty('--stats-foreground', '0 0% 10%');
          document.documentElement.style.setProperty('--stats-muted', '0 0% 30%');
          document.documentElement.style.setProperty('--stats-accent', '0 0% 0%');
        }
        
        // Stats card background (slightly lighter/darker than main)
        const cardL = needsLightText ? Math.min(100, hsl.l + 8) : Math.max(0, hsl.l - 8);
        document.documentElement.style.setProperty('--stats-card', `${hsl.h} ${hsl.s}% ${cardL}%`);
        
        // Stats border color
        const borderL = needsLightText ? Math.min(100, hsl.l + 15) : Math.max(0, hsl.l - 15);
        document.documentElement.style.setProperty('--stats-border', `${hsl.h} ${Math.max(0, hsl.s - 20)}% ${borderL}%`);
        
      } catch (e) {
        console.error('Error applying theme color:', e);
      }
    }
  }, [content?.theme_color]);

  return <>{children}</>;
};

export default ThemeColorProvider;
