// src/components/layout/Header.tsx
import Badge from "@/components/ui/Badge";
import Typography from "@/components/ui/Typography";
import { Colors } from "@/constants/tokens";
import { useCart } from "@/hooks/useCart";
import { usePressScale } from "@/lib/animations";
import { useRouter } from "expo-router";
import { ChevronLeft, ShoppingBag } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  transparent?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showCart = false,
  transparent = false,
  rightElement,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { totalItems } = useCart();
  const backPress = usePressScale(0.9);
  const cartPress = usePressScale(0.9);

  const iconColor = transparent ? Colors.surface : Colors.primary;

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
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }
          : undefined,
      ]}
    >
      <View className="w-10">
        {showBack && (
          <Animated.View style={backPress.animatedStyle}>
            <Pressable
              onPress={() => router.back()}
              onPressIn={backPress.handlePressIn}
              onPressOut={backPress.handlePressOut}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1"
            >
              <ChevronLeft size={24} color={iconColor} />
            </Pressable>
          </Animated.View>
        )}
      </View>

      <View className="flex-1 items-center">
        {title ? (
          <Typography variant="heading3" color={transparent ? "white" : "primary"}>
            {title}
          </Typography>
        ) : null}
      </View>

      <View className="w-10 flex-row items-center justify-end gap-2">
        {rightElement}
        {showCart && (
          <Animated.View style={cartPress.animatedStyle}>
            <Pressable
              onPress={() => router.push("/(tabs)/cart")}
              onPressIn={cartPress.handlePressIn}
              onPressOut={cartPress.handlePressOut}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1"
            >
              <View className="relative">
                <ShoppingBag size={24} color={iconColor} />
                {totalItems > 0 && (
                  <View className="absolute -top-1 -right-2">
                    <Badge variant="accent" size="sm">
                      {totalItems}
                    </Badge>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
