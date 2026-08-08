export function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/60 backdrop-blur-[2px]">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full border-2 border-brand-100" />

        <div className="h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-brand-600 border-r-brand-600" />

        <div className="h-2.5 w-2.5 rounded-full bg-brand-600 shadow-sm" />
      </div>
    </div>
  );
}