# Wave 3 / Task B — UI Atoms (Badge, Divider, EmptyState)

## Spec source
- `## COMPONENT LOADING STATES` (lines 582–592) — EmptyState usage context
- `## DESIGN PATTERNS` (lines 253–306) — understand how components compose
- `## ANIMATION SYSTEM` (lines 332–371) — useScaleIn for EmptyState

Note: Typography and Button are built by task-ui-text-button. Import them from their paths.

## Files to generate

1. `src/components/ui/Badge.tsx`
   - Props: `variant: 'accent' | 'success' | 'warning' | 'error' | 'neutral'`, `size: 'sm' | 'md'`, `children`
   - Always rounded-full. sm: px-2 py-0.5 text-caption | md: px-3 py-1 text-body-sm
   - variant colors: accent=bg-accent, success=bg-green-500, warning=bg-yellow-500, error=bg-red-500, neutral=bg-border
   - Text always white (except neutral: text-primary)

2. `src/components/ui/Divider.tsx`
   - Props: `orientation?: 'horizontal' | 'vertical'`
   - horizontal: `w-full h-px bg-border` | vertical: `h-full w-px bg-border`
   - Default: horizontal

3. `src/components/ui/EmptyState.tsx`
   - Props: `icon: LucideIcon`, `title: string`, `description?: string`, `action?: { label: string; onPress: () => void }`
   - Layout: centered column, icon 48px color muted, Typography heading3 title, Typography body-sm description, Button outline for action
   - useScaleIn() on mount (scale 0.92→1 with opacity)
   - The `icon` prop receives a Lucide component: `const EmptyState = ({ icon: Icon }) => <Icon size={48} .../>`
