export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-8">

                {/* Animated DN Logo */}
                <div className="relative flex items-center justify-center w-20 h-20">
                    {/* Rotating ring */}
                    <div className="absolute inset-0 rounded-full border border-white/10 animate-spin"
                        style={{ animationDuration: "3s" }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                    {/* Second ring opposite */}
                    <div className="absolute inset-[6px] rounded-full border border-white/20 animate-spin"
                        style={{ animationDuration: "2s", animationDirection: "reverse" }}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-white/60 rounded-full" />
                    </div>

                    {/* Center DN text */}
                    <span
                        className="text-white font-bold text-xl tracking-widest z-10 select-none animate-pulse"
                        style={{ animationDuration: "2s" }}
                    >
                        DN
                    </span>
                </div>

                {/* Marquee bar */}
                <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white to-transparent animate-loading-bar"
                    />
                </div>

                <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Loading</p>
            </div>

            <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(500%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
