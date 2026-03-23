// tokens.js — import into every component
export const TOKENS = {
  colors: {
    acid:    "#E8F532",                   // primary CTA, highlights, active
    danger:  "#FF5061",                   // critical, expiry, error
    warn:    "#F59E0B",                   // low stock, pending
    success: "#22C55E",                   // OK, approved
    void:    "#0A0701",                   // page background
    surface: "rgba(255,255,255,0.04)",   // card backgrounds
    border:  "rgba(255,255,255,0.08)",   // card borders
    text: {
      primary:   "#FFFFFF",
      secondary: "rgba(255,255,255,0.55)",
      muted:     "rgba(255,255,255,0.35)",
      mono:      "rgba(255,255,255,0.4)",
    },
  },

  // Tailwind class equivalents for quick reference
  tw: {
    cardBg:       "bg-white/[0.04]",
    cardBorder:   "border border-white/[0.08]",
    cardRadius:   "rounded-2xl",           // --radius-lg = 20px
    pillRadius:   "rounded-full",
    acidText:     "text-[#E8F532]",
    acidBg:       "bg-[#E8F532]",
    dangerText:   "text-[#FF5061]",
    warnText:     "text-[#F59E0B]",
    successText:  "text-[#22C55E]",
    bodyText:     "text-white/55",
    mutedText:    "text-white/35",
  },
};
