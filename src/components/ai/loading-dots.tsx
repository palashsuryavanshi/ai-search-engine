export function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-4">
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"></div>
    </div>
  )
}