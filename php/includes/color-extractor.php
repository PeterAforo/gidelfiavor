<?php
/**
 * Color Extractor - Extracts dominant color from an image
 * Used for auto-theming based on hero image
 */

class ColorExtractor {
    
    /**
     * Extract dominant color from an image
     * @param string $imagePath Path to the image file
     * @param int $sampleSize Number of pixels to sample (higher = more accurate but slower)
     * @return array RGB color array or default color
     */
    public static function getDominantColor($imagePath, $sampleSize = 10) {
        if (!file_exists($imagePath)) {
            return ['r' => 117, 'g' => 89, 'b' => 65]; // Default brown #755941
        }
        
        $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
        
        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                $image = @imagecreatefromjpeg($imagePath);
                break;
            case 'png':
                $image = @imagecreatefrompng($imagePath);
                break;
            case 'gif':
                $image = @imagecreatefromgif($imagePath);
                break;
            case 'webp':
                $image = @imagecreatefromwebp($imagePath);
                break;
            default:
                return ['r' => 117, 'g' => 89, 'b' => 65];
        }
        
        if (!$image) {
            return ['r' => 117, 'g' => 89, 'b' => 65];
        }
        
        $width = imagesx($image);
        $height = imagesy($image);
        
        $rTotal = 0;
        $gTotal = 0;
        $bTotal = 0;
        $count = 0;
        
        // Sample pixels from the image
        for ($x = 0; $x < $width; $x += $sampleSize) {
            for ($y = 0; $y < $height; $y += $sampleSize) {
                $rgb = imagecolorat($image, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;
                
                // Skip very light colors (likely background)
                if ($r > 240 && $g > 240 && $b > 240) continue;
                // Skip very dark colors
                if ($r < 15 && $g < 15 && $b < 15) continue;
                // Skip transparent pixels
                if ($rgb === imagecolorallocatealpha($image, 0, 0, 0, 127)) continue;
                
                $rTotal += $r;
                $gTotal += $g;
                $bTotal += $b;
                $count++;
            }
        }
        
        imagedestroy($image);
        
        if ($count === 0) {
            return ['r' => 117, 'g' => 89, 'b' => 65];
        }
        
        return [
            'r' => round($rTotal / $count),
            'g' => round($gTotal / $count),
            'b' => round($bTotal / $count)
        ];
    }
    
    /**
     * Convert RGB to HEX
     */
    public static function rgbToHex($r, $g, $b) {
        return sprintf("#%02X%02X%02X", $r, $g, $b);
    }
    
    /**
     * Generate a darker shade of a color
     */
    public static function darkenColor($hex, $percent = 20) {
        $hex = ltrim($hex, '#');
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        
        $r = max(0, $r - ($r * $percent / 100));
        $g = max(0, $g - ($g * $percent / 100));
        $b = max(0, $b - ($b * $percent / 100));
        
        return sprintf("#%02X%02X%02X", $r, $g, $b);
    }
    
    /**
     * Generate a lighter shade of a color
     */
    public static function lightenColor($hex, $percent = 20) {
        $hex = ltrim($hex, '#');
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        
        $r = min(255, $r + ((255 - $r) * $percent / 100));
        $g = min(255, $g + ((255 - $g) * $percent / 100));
        $b = min(255, $b + ((255 - $b) * $percent / 100));
        
        return sprintf("#%02X%02X%02X", $r, $g, $b);
    }
    
    /**
     * Get theme colors from hero image
     * @param string $imagePath Path to hero image
     * @return array Theme colors (primary, primary_dark, primary_light)
     */
    public static function getThemeFromImage($imagePath) {
        $dominant = self::getDominantColor($imagePath);
        $primaryHex = self::rgbToHex($dominant['r'], $dominant['g'], $dominant['b']);
        
        return [
            'primary' => $primaryHex,
            'primary_dark' => self::darkenColor($primaryHex, 20),
            'primary_light' => self::lightenColor($primaryHex, 20)
        ];
    }
    
    /**
     * Save theme colors to database
     */
    public static function saveThemeColors($colors) {
        $db = Database::getInstance();
        
        // Check if theme_colors table exists, if not create it
        try {
            $db->query("CREATE TABLE IF NOT EXISTS theme_colors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                primary_color VARCHAR(10),
                primary_dark VARCHAR(10),
                primary_light VARCHAR(10),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )");
            
            $existing = $db->fetchOne("SELECT id FROM theme_colors LIMIT 1");
            
            if ($existing) {
                $db->update('theme_colors', [
                    'primary_color' => $colors['primary'],
                    'primary_dark' => $colors['primary_dark'],
                    'primary_light' => $colors['primary_light']
                ], 'id = :id', ['id' => $existing['id']]);
            } else {
                $db->insert('theme_colors', [
                    'primary_color' => $colors['primary'],
                    'primary_dark' => $colors['primary_dark'],
                    'primary_light' => $colors['primary_light']
                ]);
            }
            
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * Get saved theme colors from database
     */
    public static function getSavedThemeColors() {
        try {
            $db = Database::getInstance();
            $colors = $db->fetchOne("SELECT * FROM theme_colors LIMIT 1");
            
            if ($colors) {
                return [
                    'primary' => $colors['primary_color'],
                    'primary_dark' => $colors['primary_dark'],
                    'primary_light' => $colors['primary_light']
                ];
            }
        } catch (Exception $e) {
            // Table might not exist yet
        }
        
        // Default colors
        return [
            'primary' => '#755941',
            'primary_dark' => '#5D4735',
            'primary_light' => '#8B6B4D'
        ];
    }
}
