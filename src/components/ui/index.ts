// ── Custom UI components ──────────────────────────────────────────────────────
// Import from here instead of individual files.
// Shadcn/ui primitives (button, card, input, etc.) are imported directly from
// their own files: '@/components/ui/button', '@/components/ui/card', etc.

// Content components
export { HeroSection } from './HeroSection'
export { FeatureCard } from './FeatureCard'
export { WhyCard } from './WhyCard'
export { EnrollNowButton } from './EnrollNowButton'
export { Icon } from './Icon'
export { ImageWrapper } from './ImageWrapper'
export { ColoredBorderCard } from './ColoredBorderCard'
export { AutoScrollCarousel } from './AutoScrollCarousel'

// Interactive / compound components
export { AccordionList } from './AccordionList'
export { TabsPanel } from './TabsPanel'
export { TooltipWrapper } from './TooltipWrapper'
export { AvatarDisplay } from './AvatarDisplay'
export { Divider } from './Divider'
export { ProgressBar } from './ProgressBar'

// Form components
export { FormField } from './FormField'
export { RadioGroupField } from './RadioGroup'
export { FileUpload } from './FileUpload'
export { SubmitButton } from './SubmitButton'

// Data display
export { default as DataCard } from './DataCard'
export { default as EmptyState } from './EmptyState'
export { default as LoadingSpinner } from './LoadingSpinner'
export { default as SkeletonBlock } from './SkeletonBlock'
export { default as PaginationBar } from './PaginationBar'

// Feedback
export { toast, Toaster } from './ToastProvider'
export { default as AlertBanner } from './AlertBanner'
export { default as Modal } from './Modal'
export { default as ConfirmDialog } from './ConfirmDialog'

// Animations
export { FadeIn } from './FadeIn'
export { SlideIn } from './SlideIn'
export { AnimatedCounter } from './AnimatedCounter'

// Shared icon sets
export { subjectIcons, subjectIconList, homeWhyIcons, aboutWhyIcons } from './icons'
export type { SubjectId } from './icons'
