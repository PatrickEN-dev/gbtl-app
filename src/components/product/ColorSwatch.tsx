// src/components/product/ColorSwatch.tsx
import Typography from "@/components/ui/Typography";
import { usePressScale } from "@/lib/animations";
import type { ProductColor } from "@/types";
import React from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

interface ColorSwatchProps {
  colors: ProductColor[];
  selected: ProductColor;
  onSelect: (color: ProductColor) => void;
  hideLabel?: boolean;
}

interface SwatchItemProps {
  color: ProductColor;
  isSelected: boolean;
  onSelect: () => void;
}

function SwatchItem({ color, isSelected, onSelect }: SwatchItemProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.88);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={color.name}
        accessibilityState={{ selected: isSelected }}
      >
        {/* Outer ring — accent border when selected, transparent otherwise for stable sizing */}
        <View
          className={[
            "rounded-full p-0.5",
            isSelected ? "border-2 border-accent" : "border-2 border-transparent",
          ].join(" ")}
        >
          <View className="w-7 h-7 rounded-full" style={{ backgroundColor: color.hex }} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ColorSwatch({ colors, selected, onSelect, hideLabel = false }: ColorSwatchProps) {
  return (
    <View>
      <View className="flex-row flex-wrap gap-3">
        {colors.map((color) => (
          <SwatchItem
            key={color.hex}
            color={color}
            isSelected={color.hex === selected.hex}
            onSelect={() => onSelect(color)}
          />
        ))}
      </View>
      {!hideLabel && (
        <Typography variant="caption" color="muted" className="mt-2">
          {selected.name}
        </Typography>
      )}
    </View>
  );
}
