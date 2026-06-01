import Icon from "./iconMapping";
import { icons } from "../../utils/icons"


// ─── Modal ───────────────────────────────────────────────────────────────────
export default function Modal({ title, subtitle, children, onClose, danger = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm animate-fade-in px-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full max-w-md max-h-[90%] overflow-y-auto bg-[#1a1a2e] rounded-2xl p-7 shadow-2xl border animate-pop-in ${danger ? "border-red-500/30" : "border-[rgba(255,255,255,0.1)]"}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`texlt-lg font-bold ${danger ? "text-red-400" : "text-white"}`}>{title}</h3>
            {subtitle && (<p className="text-gray-400 mt-2">
              {subtitle}
            </p>)}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Icon d={icons.close} size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
