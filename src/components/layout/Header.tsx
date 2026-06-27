
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/primitives/IconButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "expo-router";
import { ChevronLeft, ShoppingBag } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  transparent?: boolean;
  rightElement?: React.ReactNode;
  roundedIcons?: boolean;
}

export default function Header({
  title,
  showBack = false,
  showCart = false,
  transparent = false,
  rightElement,
  roundedIcons = false,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { totalItems } = useCart();
  const colors = useThemeColors();
  const surfaceShadow = {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  };

  const iconColor = transparent ? colors.surface : colors.primary;

  const backButton = showBack ? (
    <IconButton
      icon={<ChevronLeft size={24} color={iconColor} />}
      variant={roundedIcons ? 'surface' : 'ghost'}
      onPress={() => router.back()}
      accessibilityLabel="Go back"
    />
  ) : null;

  const cartButton = showCart ? (
    <IconButton
      icon={<ShoppingBag size={24} color={iconColor} />}
      variant={roundedIcons ? 'surface' : 'ghost'}
      badge={totalItems > 0 ? totalItems : undefined}
      onPress={() => router.push('/(tabs)/cart')}
      accessibilityLabel="Open cart"
    />
  ) : null;

  const rightSlot = rightElement
    ? (roundedIcons
        ? <View className="w-10 h-10 bg-surface rounded-full items-center justify-center" style={surfaceShadow}>{rightElement}</View>
        : rightElement)
    : null;

  return (
    <View
      className={[
        "flex-row items-center px-4 pb-3",
        transparent ? "absolute top-0 left-0 right-0 z-10" : "bg-surface",
      ].join(" ")}
      style={[
        { paddingTop: insets.top + 8 },
        !transparent
          ? {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }
          : undefined,
      ]}
    >
      <View className="w-10">
        {showBack && backButton}
      </View>

      <View className="flex-1 items-center">
        {title ? (
          <Typography variant="heading3" color={transparent ? "white" : "primary"}>
            {title}
          </Typography>
        ) : null}
      </View>

      <View className="flex-row items-center justify-end gap-2" style={{ minWidth: 40 }}>
        {rightSlot}
        {showCart && cartButton}
      </View>
    </View>
  );
}
