export default function BrandLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>

            <div className="font-bold tracking-widest text-xl whitespace-nowrap">
                <span className="text-white">DATA</span>
                <span className="text-white/70 ml-1.5">NEXUS</span>
            </div>
        </div>
    );
}
