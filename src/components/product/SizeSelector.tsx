// src/components/product/SizeSelector.tsx
import Typography from "@/components/ui/Typography";
import { Colors } from "@/constants/tokens";
import { Duration } from "@/lib/animations";
import type { ProductSize } from "@/types";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string;
  onSelect: (size: string) => void;
}

interface SizeChipProps {
  size: ProductSize;
  isSelected: boolean;
  onSelect: () => void;
}

function SizeChip({ size, isSelected, onSelect }: SizeChipProps) {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: Duration.base });
  }, [isSelected]);

  // Background animates between surface (unselected) and primary (selected)
  // interpolateColor is JS logic — legitimate use of Colors constants from tokens
  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [Colors.surface, Colors.primary]),
  }));

  return (
    <Pressable
      onPress={size.available ? onSelect : undefined}
      accessibilityRole="button"
      accessibilityLabel={size.label}
      accessibilityState={{ selected: isSelected, disabled: !size.available }}
    >
      <Animated.View
        style={animatedBgStyle}
        className={[
          "min-w-[44px] h-11 px-3 rounded-full border border-border items-center justify-center",
          !size.available ? "opacity-40" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Typography
          variant="body-sm"
          color={isSelected ? 'white' : 'primary'}
          className={!size.available ? 'line-through' : ''}
        >
          {size.label}
        </Typography>
      </Animated.View>
    </Pressable>
  );
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {sizes.map((size) => (
        <SizeChip
          key={size.label}
          size={size}
          isSelected={size.label === selected}
          onSelect={() => onSelect(size.label)}
        />
      ))}
    </View>
  );
}
