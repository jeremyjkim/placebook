import { ReactNode } from 'react'

interface BottomSheetProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

export function BottomSheet({ title, subtitle, children }: BottomSheetProps) {
  return (
    <section className="relative z-10 w-full rounded-t-3xl bg-white/90 backdrop-blur shadow-sheet">
      <div className="sticky top-0 space-y-1 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto h-1 w-12 rounded-full bg-slate-200" aria-hidden />
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">{children}</div>
    </section>
  )
}
