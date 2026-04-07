export const SidebarItem = ({label, icon, active, badge }) => (
    <button
    className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left"
    style={{ background: active ? "rgba(99,108,241,.12)" : "transparent", color: active ? "#a5b4fc" : "#64748b"}}
    onMouseEnter={e => { if (!active) {e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.color = "#94e3b8"}}}
    onMouseLeave={e => { if (!active) {e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"}}}>
    {active && <span className="nai" />}
    <span>{icon}</span>
    <span className="text-sm font-medium flex-1">{label}</span>
    {badge && <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{badge}</span>}
</button>
);