# Modern Dashboard Architecture for Cartpanda

## Overview

This document outlines how I would build a modern admin dashboard for a funnels + checkout product that stays fast, scales with the team, and meets accessibility standards.

---

## 1. Architecture

### Route & Module Structure

```
src/
├── app/                     # App-level providers, layouts
├── features/                # Feature modules (domain-driven)
│   ├── funnels/
│   │   ├── components/      # Feature-specific components
│   │   ├── hooks/           # Feature-specific hooks
│   │   ├── api/             # API calls & queries
│   │   ├── types.ts         # Feature types
│   │   └── index.ts         # Public exports
│   ├── orders/
│   ├── customers/
│   ├── subscriptions/
│   ├── analytics/
│   ├── disputes/
│   └── settings/
├── shared/                  # Shared utilities
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Shared hooks
│   ├── lib/                 # Utilities, helpers
│   └── types/               # Global types
└── design-system/           # Design tokens, themes
```

### Patterns to Avoid Spaghetti

1. **Feature Folders**: Each feature owns its routes, components, queries, and types
2. **Barrel Exports**: Features expose a clean public API via `index.ts`
3. **Colocation**: Keep related code together (test files alongside components)
4. **Dependency Direction**: Features can import from `shared/`, never from other features

---

## 2. Design System

### Approach: Build on Existing Foundations

I would use **Radix UI primitives + Tailwind CSS** (similar to shadcn/ui) because:

- Full accessibility built-in (ARIA, keyboard navigation)
- Unstyled primitives allow complete design control
- Strong TypeScript support
- No vendor lock-in

### Enforcing Consistency

1. **Design Tokens**: Define all colors, spacing, typography in CSS variables
   ```css
   :root {
     --color-primary: 217 91% 60%;
     --spacing-unit: 4px;
     --font-sans: 'Inter', system-ui;
   }
   ```

2. **Component Variants**: Use CVA (Class Variance Authority) for type-safe variants
   ```tsx
   const buttonVariants = cva("base-styles", {
     variants: {
       intent: { primary: "...", secondary: "..." },
       size: { sm: "...", md: "...", lg: "..." }
     }
   });
   ```

3. **Storybook**: Document components with usage examples and accessibility notes

4. **ESLint Rules**: Custom rules to enforce design system usage (e.g., no arbitrary color values)

---

## 3. Data Fetching & State

### Server State: TanStack Query

- **Caching**: Automatic cache management with configurable stale times
- **Deduplication**: Multiple components requesting same data = one request
- **Background Updates**: Stale-while-revalidate pattern
- **Optimistic Updates**: For mutations (create, update, delete)

```tsx
// Example query hook
export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
    staleTime: 30_000, // 30 seconds
  });
}
```

### Client State: Zustand (for UI state)

- Minimal global state (theme, sidebar, user preferences)
- Most state stays local to components
- URL state for shareable filters/sorts

### Loading/Error/Empty States

Create reusable wrapper components:

```tsx
<QueryBoundary query={ordersQuery}>
  {(data) => <OrdersTable data={data} />}
</QueryBoundary>
```

### Tables with Filters/Sorts/Pagination

- **URL-driven**: Filters encoded in URL params for shareability
- **TanStack Table**: For complex table features
- **Server-side pagination**: For large datasets

---

## 4. Performance

### Bundle Optimization

1. **Route-based code splitting**: Each feature loads on demand
   ```tsx
   const OrdersPage = lazy(() => import('./features/orders/OrdersPage'));
   ```

2. **Component-level splitting**: Heavy components (charts, editors) split separately

3. **Tree shaking**: Proper ES module exports

### Runtime Performance

1. **Virtualization**: Use TanStack Virtual for long lists/tables
2. **Memoization**: Strategic use of `useMemo`, `useCallback`, `memo()`
3. **Debouncing**: For search inputs and filters

### Instrumentation

1. **Core Web Vitals**: Track LCP, FID, CLS via web-vitals library
2. **Custom metrics**: 
   - Time to first meaningful data
   - Table render time
   - Interaction latency
3. **Real User Monitoring**: Sentry, Datadog, or similar

---

## 5. Developer Experience & Team Scaling

### Onboarding

1. **Architecture Decision Records (ADRs)**: Document why decisions were made
2. **README in each feature folder**: Quick start for that module
3. **Storybook**: Visual component documentation
4. **Pair programming**: First PR with experienced team member

### Conventions

1. **ESLint + Prettier**: Automated formatting, no debates
2. **Husky + lint-staged**: Pre-commit hooks for quality
3. **PR Templates**: Checklist for accessibility, testing, design review
4. **Component Guidelines**:
   - Max 200 lines per component
   - Extract custom hooks for complex logic
   - Prefer composition over configuration

### Preventing One-Off UI

1. **Design system as source of truth**: Changes go through design review
2. **Chromatic**: Visual regression testing
3. **Code review focus**: Check for design system usage
4. **Regular audits**: Quarterly review of component usage

---

## 6. Testing Strategy

### Testing Pyramid

| Level | What | Tools | Coverage |
|-------|------|-------|----------|
| Unit | Utilities, hooks, pure functions | Vitest | High |
| Integration | Component + API interactions | Vitest + Testing Library | Medium |
| E2E | Critical user flows | Playwright | Low but critical |

### Minimum Viable Testing

Before shipping:
1. **Unit tests** for business logic (validators, formatters, calculations)
2. **Integration tests** for data mutations (create, update, delete flows)
3. **E2E tests** for happy paths (login, create funnel, complete order)

### Accessibility Testing

1. **axe-core**: Automated a11y checks in tests
2. **Manual testing**: Keyboard navigation, screen reader testing
3. **WCAG 2.1 AA compliance**: Required for all new components

---

## 7. Release & Quality

### Feature Flags

Use a feature flag service (LaunchDarkly, Statsig, or custom) for:
- Gradual rollouts (1% → 10% → 50% → 100%)
- A/B testing
- Kill switches for new features

### Staged Rollouts

1. **Preview environment**: Automatic deploys for PRs
2. **Staging**: Full integration testing
3. **Production**: Behind feature flags initially

### Error Monitoring

1. **Sentry**: Error tracking with source maps
2. **Alerts**: Slack notifications for error spikes
3. **Session replay**: Understand user context when errors occur

### "Ship Fast but Safe"

1. **Feature flags**: Ship to production behind flags
2. **Monitoring**: Watch error rates, performance metrics
3. **Rollback plan**: One-click revert capability
4. **Incremental delivery**: Small PRs, ship often

---

## Summary of Technology Choices

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | React + Vite | Fast DX, industry standard |
| Styling | Tailwind + CVA | Utility-first, type-safe variants |
| UI Primitives | Radix UI | Accessible, unstyled, flexible |
| Data Fetching | TanStack Query | Best-in-class caching & DevTools |
| Client State | Zustand | Simple, minimal boilerplate |
| Tables | TanStack Table | Feature-complete, virtualization |
| Forms | React Hook Form + Zod | Performance, runtime validation |
| Testing | Vitest + Playwright | Fast, modern, reliable |
| Monitoring | Sentry | Industry standard, great DX |

---

## Accessibility Notes

WCAG 2.1 AA compliance is non-negotiable:

1. **Color contrast**: Minimum 4.5:1 for text, 3:1 for UI components
2. **Keyboard navigation**: All interactive elements focusable and operable
3. **Screen reader support**: Proper ARIA labels, live regions for updates
4. **Focus management**: Logical focus order, visible focus indicators
5. **Reduced motion**: Respect `prefers-reduced-motion`
6. **Form accessibility**: Labels, error messages, required field indicators

All components in the design system are tested for accessibility before release.
