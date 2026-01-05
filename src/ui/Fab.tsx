type FabProps = {
  onClick?: () => void
  label?: string
}

export function Fab({ onClick, label = 'Add place' }: FabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-lg shadow-blue-200 transition hover:scale-[1.02] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <span className="text-lg">＋</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}
