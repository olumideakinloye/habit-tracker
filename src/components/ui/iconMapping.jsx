// ── Inline SVG icon helper ────────────────────────────────────────────────
export default function Icon({ d, size = 18, className = "", strokeWidth = 2, fill = "none" }) {
    return (
        <svg
            width={size} height={size} viewBox="0 0 24 24"
            fill={fill} stroke="currentColor"
            strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
            className={className}
        >
            {Array.isArray(d)
                ? d.map((path, i) => <path key={i} d={path} />)
                : <path d={d} />}
        </svg>
    )
}