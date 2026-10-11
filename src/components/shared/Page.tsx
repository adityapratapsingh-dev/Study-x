import React from 'react';

/** Shared page frame primitives — one container, header and card recipe for every screen. */

const MAX_WIDTH = {
  default: 'max-w-7xl',
  narrow: 'max-w-4xl',
  wide: 'max-w-[96rem]',
} as const;

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Width of the centred content column. */
  width?: keyof typeof MAX_WIDTH;
  /** `false` for full-height screens that manage their own inner scrolling. */
  scroll?: boolean;
  /** `true` for full-bleed app surfaces (chat, master-detail) — no max-width/padding. */
  bleed?: boolean;
}

/**
 * The one container every screen renders inside. Owns the scroll region, the
 * container width and the padding rhythm so screens cannot drift apart.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  width = 'default',
  scroll = true,
  bleed = false,
}) => (
  <div
    className={`flex-1 min-h-0 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'} bg-slate-950 text-slate-100`}
  >
    {bleed ? (
      <div className={`h-full ${className}`}>{children}</div>
    ) : (
      <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${MAX_WIDTH[width]} ${className}`}>
        {children}
      </div>
    )}
  </div>
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  eyebrowIcon?: React.ElementType;
  /** Accent classes for the eyebrow pill, e.g. `bg-blue-500/20 text-blue-300 border-blue-500/30`. */
  accent?: string;
  /** Optional subtle gradient tint for the header surface. Defaults to neutral. */
  accentGradient?: string;
  actions?: React.ReactNode;
  /** Decorative icon rendered faintly in the corner of the header. */
  watermark?: React.ElementType;
}

/** Canonical page header: eyebrow, title, subtitle and right-aligned actions. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  accent = 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  accentGradient = 'from-slate-900 via-slate-900 to-slate-950',
  actions,
  watermark: Watermark,
}) => (
  <header
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${accentGradient} border border-slate-800 p-6 sm:p-8 glow-iris`}
  >
    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2 max-w-2xl">
        {eyebrow && (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${accent}`}>
            {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5" />}
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-slate-300 leading-relaxed">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
    {Watermark && (
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
        <Watermark className="w-64 h-64 text-slate-400" />
      </div>
    )}
  </header>
);

/** Consistent vertical rhythm between page blocks. */
export const PageSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <section className={`space-y-6 ${className}`}>{children}</section>;

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds hover affordance for clickable cards. */
  interactive?: boolean;
}

/** The one panel recipe: surface, border, radius, padding. */
export const Card: React.FC<CardProps> = ({ children, className = '', interactive = false }) => (
  <div
    className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 surface-lift ${
      interactive ? 'transition hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/50' : ''
    } ${className}`}
  >
    {children}
  </div>
);
