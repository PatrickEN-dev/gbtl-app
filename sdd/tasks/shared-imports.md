# GBTL Shared Import Reference
# All builders use @/* alias mapped to ./src/* — never use relative paths
# Add this file path to your task's "Spec source" section.

## Available after Wave 1

```ts
// Types
import type { Product, CartItem, AuthUser, ProductColor, ProductSize, RootStackParamList } from '@/types'

// Constants (for JS logic — not styling; use className for styling)
import { Colors, Spacing, Radius } from '@/constants/tokens'

// Animations
import {
  Duration, Spring, Easing,
  useFadeInUp, useScaleIn, useSlideInRight, useStagger,
  usePressScale, useCartBounce, useShimmer, useParallax,
} from '@/lib/animations'

// Infra
import { queryClient } from '@/lib/queryClient'
import { getToken, setToken, deleteToken } from '@/lib/secureStore'

// Schemas
import { loginSchema, type LoginFormData } from '@/schemas/login.schema'
import { checkoutSchema, type CheckoutFormData } from '@/schemas/checkout.schema'

// Services
import { fetchProducts, fetchProduct } from '@/services/products'
import { login } from '@/services/auth'

// Data
import { mockProducts } from '@/data/mockProducts'
```

## Available after Wave 2

```ts
// Stores (prefer hooks below — stores only for advanced usage)
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'

// Hooks
import { useProducts } from '@/hooks/useProducts'
import { useProduct } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import { useBottomSheet } from '@/hooks/useBottomSheet'
```

## Available after Wave 3

```ts
// UI atoms
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Skeleton, SkeletonGroup, ProductCardSkeleton, ProductDetailSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Divider from '@/components/ui/Divider'

// Layout
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import TabBar from '@/components/layout/TabBar'
```

## Available after Wave 4

```ts
import { ProductCard } from '@/components/product/ProductCard'
import ProductGrid from '@/components/product/ProductGrid'
import ColorSwatch from '@/components/product/ColorSwatch'
import SizeSelector from '@/components/product/SizeSelector'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { Field } from '@/components/forms/Field'
import LoginForm from '@/components/forms/LoginForm'
import CheckoutForm from '@/components/forms/CheckoutForm'
```

## Common external imports (all installed after wave 1 npm install)

```ts
import { useRouter, useLocalSearchParams, router } from 'expo-router'
import { Image } from 'expo-image'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform, KeyboardAvoidingView, FlatList, ScrollView, Pressable } from 'react-native'
import { GestureDetector, Gesture, Swipeable } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, useAnimatedScrollHandler } from 'react-native-reanimated'
import { BottomSheetModal, BottomSheetScrollView, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingBag, ShoppingCart, Heart, ChevronLeft, AlertCircle, Package, User, Home, Grid } from 'lucide-react-native'
```
