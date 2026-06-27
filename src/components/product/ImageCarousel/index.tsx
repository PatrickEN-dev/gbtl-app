// src/components/product/ImageCarousel/index.tsx
import { Spacing } from "@/constants/tokens";
import { Duration, Spring, useSlideInRight } from "@/lib/animations";
import { Image } from "expo-image";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH / 3;

// ─── Context ──────────────────────────────────────────────────────────────────

type CarouselContextType = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  images: string[];
  dragX: SharedValue<number>;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

function useCarouselContext(): CarouselContextType {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("ImageCarousel sub-components must be used within ImageCarousel.Root");
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type RootProps = {
  images: string[];
  children: React.ReactNode;
};

function Root({ images, children }: RootProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragX = useSharedValue(0);
  const activeIndexSV = useSharedValue(0);

  useEffect(() => {
    activeIndexSV.value = activeIndex;
  }, [activeIndex]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      dragX.value = e.translationX;
    })
    .onEnd((e) => {
      const current = activeIndexSV.value;
      const maxIndex = images.length - 1;
      if (e.translationX < -SWIPE_THRESHOLD && current < maxIndex) {
        dragX.value = withSpring(0, Spring.snappy);
        runOnJS(setActiveIndex)(current + 1);
      } else if (e.translationX > SWIPE_THRESHOLD && current > 0) {
        dragX.value = withSpring(0, Spring.snappy);
        runOnJS(setActiveIndex)(current - 1);
      } else {
        dragX.value = withSpring(0, Spring.snappy);
      }
    });

  return (
    <CarouselContext.Provider value={{ activeIndex, setActiveIndex, images, dragX }}>
      <GestureDetector gesture={gesture}>
        <View className="w-full overflow-hidden">{children}</View>
      </GestureDetector>
    </CarouselContext.Provider>
  );
}

// ─── Slide ────────────────────────────────────────────────────────────────────

type SlideProps = { aspectRatio?: number };

function Slide({ aspectRatio }: SlideProps) {
  const { activeIndex, images, dragX } = useCarouselContext();
  const { animatedStyle: mountStyle } = useSlideInRight();

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value }],
  }));

  return (
    <Animated.View style={dragStyle}>
      <Animated.View style={mountStyle}>
        <Image
          source={{ uri: images[activeIndex] }}
          style={{ width: "100%", aspectRatio: aspectRatio ?? 1 }}
          contentFit="cover"
        />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Thumbnails ───────────────────────────────────────────────────────────────

function Thumbnails() {
  const { images, activeIndex, setActiveIndex } = useCarouselContext();

  return (
    <FlatList
      horizontal
      data={images}
      keyExtractor={(_, i) => i.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }}
      renderItem={({ item, index }) => (
        <Pressable onPress={() => setActiveIndex(index)} className="mr-2">
          <View
            className={`w-[60px] h-[60px] rounded-lg overflow-hidden ${
              index === activeIndex ? "border-2 border-accent" : "border border-border"
            }`}
          >
            <Image source={{ uri: item }} style={{ width: 60, height: 60 }} contentFit="cover" />
          </View>
        </Pressable>
      )}
    />
  );
}

// ─── SideThumbnails ───────────────────────────────────────────────────────────

function SideThumbnails() {
  const { images, activeIndex, setActiveIndex } = useCarouselContext();
  return (
    <View className="gap-2 pl-2 justify-center">
      {images.slice(0, 4).map((uri, index) => (
        <Pressable key={index} onPress={() => setActiveIndex(index)}>
          <View
            className={`w-14 h-14 rounded-lg overflow-hidden ${
              index === activeIndex ? 'border-2 border-accent' : 'border border-border'
            }`}
          >
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
        </Pressable>
      ))}
    </View>
  )
}

// ─── Dots ─────────────────────────────────────────────────────────────────────

type DotItemProps = { index: number };

function DotItem({ index }: DotItemProps) {
  const { activeIndex } = useCarouselContext();
  const isActive = index === activeIndex;
  const width = useSharedValue(isActive ? 20 : 6);

  useEffect(() => {
    width.value = withTiming(index === activeIndex ? 20 : 6, { duration: Duration.base });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`h-[6px] rounded-full mx-[2px] ${isActive ? "bg-accent" : "bg-border"}`}
    />
  );
}

function Dots() {
  const { images } = useCarouselContext();

  return (
    <View className="flex-row justify-center items-center py-3">
      {images.map((_, index) => (
        <DotItem key={index} index={index} />
      ))}
    </View>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const ImageCarousel = { Root, Slide, Thumbnails, SideThumbnails, Dots };
