## 📁 `Hero.jsx`

### Navbar (inside Hero or standalone `Navbar.jsx`)

```js
export const NAV = {
  logo: {
    dot: "●",                  // --color-acid
    name: "PharmaAgent",
  },
  links: [
    { label: "Home",     href: "/" },
    { label: "Features", href: "/features" },
    { label: "About",    href: "/about" },
    { label: "Pricing",  href: "/pricing" },
    { label: "Blog",     href: "/blog" },
  ],
  cta: {
    login:  { label: "Login",      href: "/login" },
    signup: { label: "Sign up →",  href: "/signup" },
  },
}
```

---

### Hero Content

```js
export const HERO = {
  eyebrow: "AI Supply Chain Platform",

  headline: {
    line1: "A Smarter Path To",
    line2: "Zero Stockouts & Zero Waste.",
    // line2 renders in --color-acid
  },

  subheadline:
    "PharmaAgent gives your supply chain a single platform. " +
    "AI-powered demand forecasting with a fully autonomous " +
    "multi-agent replenishment system.",

  cta: {
    inputPlaceholder: "Enter your email",
    buttonLabel: "Sign Up Free →",
    trustText: "No credit card required · Free 14-day trial · Cancel anytime",
  },

  mockup: {
    greeting: "hello, Priya ✦",
    kpis: [
      { label: "Revenue Saved",   value: "₹2.1Cr",  trend: "+18%" },
      { label: "Orders Automated",value: "2,847",    trend: "+34%" },
      { label: "Expiry Reduced",  value: "↓ 40%",   trend: "vs last Q" },
      { label: "Stock Health",    value: "98.3%",    trend: "▲ +2.1%" },
    ],
    chartLabel1: "Inventory Overview",
    chartLabel2: "Network Health",
    // Bar chart: --color-acid bars | Donut: --color-acid + --color-danger
  },
}
```

---

## 📁 `FeatureIntro.jsx`

```js
export const FEATURE_INTRO = {
  eyebrow: "850+ SKUs MONITORED LIVE",

  headline: {
    line1: "PharmaAgent Gives You",
    line2: "Full Supply Chain Visibility",
  },

  body:
    "Preventing stockouts in one platform. Our AI agents handle " +
    "demand forecasting, real-time alerts, and auto-replenishment — " +
    "a fully redesigned supply chain management experience.",

  bullets: [
    {
      icon: "●",   // filled circle, --color-acid
      title: "Simply Monitor & React",
      description:
        "Real-time stock packages and single-dashboard alerts surface for your team.",
    },
    {
      icon: "●",
      title: "Easy To Automate",
      description:
        "Fully automated replenishment packages and one-click AI approval make supply chain effortless.",
    },
    {
      icon: "●",
      title: "Built With Intelligence",
      description:
        "RAG-based AI agents continuously optimize orders and flag expiry risks before they happen.",
    },
  ],

  phoneMockup: {
    appName: "● PharmaAgent",
    searchPlaceholder: "Search drug...",
    filterLabel: "Category ▾",
    stockItems: [
      {
        name: "Metformin 500mg",
        stock: 12,
        status: "LOW",
        statusColor: "danger",   // --color-danger, red pill
      },
      {
        name: "Insulin Glargine",
        stock: 45,
        status: "WARN",
        statusColor: "warn",     // --color-warn, yellow pill
      },
    ],
  },
}
```

---

## 📁 `FeatureGrid.jsx`

```js
export const FEATURE_GRID = {
  eyebrow: "AI AGENTS IN ACTION",

  headline: {
    line1: "PharmaAgent Helps You Prevent",
    line2: "Every Supply Chain Failure",
  },

  body:
    "Preventing stockout and expiry losses in one platform. " +
    "Our AI agents handle demand forecasting, inventory rebalancing, " +
    "and auto-replenishment with full audit trails.",

  // Grid layout: A(2/3 wide) | B(1/3) / C(1/3) | D(1/3) | E(1/3) / F(2/3 wide) | G(1/3)
  cards: [
    {
      id: "A",
      size: "wide",          // 2/3 width
      title: "Demand forecasting and qualification workflows",
      body:
        "AI agents predict stock needs 30 days ahead. Automatically qualify " +
        "reorder triggers based on historical patterns and seasonal signals.",
      visual: {
        type: "search-input",
        placeholder: "📦 Type drug name here...",
        buttonLabel: "Forecast →",   // --color-acid button
      },
    },
    {
      id: "B",
      size: "narrow",        // 1/3 width
      title: "Auto-Reorder",
      body:
        "Agents trigger purchase orders the moment stock crosses threshold.",
      visual: {
        type: "icon-tile",
        icon: "RefreshCw",           // Lucide icon
        iconBg: "--color-acid",
        size: "48x48",
      },
    },
    {
      id: "C",
      size: "narrow",
      title: "Expiry stage management",
      body:
        "Track every batch through its lifecycle. Redistribute before expiry.",
      visual: {
        type: "pipeline",
        stages: [
          { label: "Ordered",   status: "done" },
          { label: "Received",  status: "done" },
          { label: "Active",    status: "done" },
          { label: "Expiring",  status: "danger" },  // --color-danger
        ],
      },
    },
    {
      id: "D",
      size: "narrow",
      title: "Duplicate detection and merging",
      body:
        "Agents flag and consolidate duplicate orders before they're submitted.",
      visual: {
        type: "avatar-stack",
        avatars: ["B4", "MH", "NG"],   // branch initials
        overflow: "+14 more",
      },
    },
    {
      id: "E",
      size: "narrow",
      title: "Chat with PharmaAgent AI",
      body:
        "Ask your supply chain anything. Get instant answers from your live data.",
      visual: {
        type: "chat-bubble",
        userMessage: "Have any help?",
        agentReply:
          "Insulin at Branch 4 expires in 12 days. Redistribute now?",
        // agentReply renders in --color-acid bubble
      },
    },
    {
      id: "F",
      size: "wide",
      title: "Auto-replenishment based on stock alerts or expiry",
      body:
        "When stock drops below minimum, the Reorder Agent auto-creates a PO " +
        "and routes it for approval — or executes if auto-approved.",
      visual: {
        type: "toggle",
        offLabel: "Manual ordering",
        onLabel: "AI-Managed",
        defaultState: "on",     // active = --color-acid track
      },
    },
    {
      id: "G",
      size: "narrow",
      title: "Notification and alert automation",
      body:
        "Every agent action triggers role-appropriate alerts. " +
        "Pharmacists, managers, and executives each see what they need.",
      visual: {
        type: "notification-stack",
        items: [
          { label: "Critical stock — Branch 4", level: "danger" },
          { label: "Redistribution suggested",  level: "warn" },
          { label: "PO #4892 approved",         level: "success" },
        ],
        // Globe/network icon in --color-acid, top-right of card
      },
    },
  ],
}
```

---

## 📁 `Outcomes.jsx`

```js
export const OUTCOMES = {
  eyebrow: "Testimonial",      // small mono pill, left-aligned

  headline: {
    line1: "Practical Outcomes And Financial",
    line2: "Performance In Real-World Scenarios",
  },

  subtext:
    "See How Companies Have Shared Their Supply Chain Success Stories",

  stats: [
    {
      value: "₹2.1Cr",
      label: "Revenue Saved",
      // Animate: count up from 0 on scroll enter
    },
    {
      value: "40%",
      label: "Expiry Reduction",
      // Animate: count up from 0 on scroll enter
    },
  ],

  testimonials: [
    {
      quote:
        "Using PharmaAgent is one of the best decisions we've ever made. " +
        "We've seen our annual expiry losses drop dramatically, and the " +
        "outlook just keeps getting better.",
      author: {
        name: "Rajiv Sharma",
        title: "Founder & CEO, Pharma Business Strategies",
        avatar: "RS",   // initials for avatar circle
      },
    },
    {
      quote:
        "PharmaAgent is created for supply chain teams. It's the kind of " +
        "platform that just works — I don't have to make it work. " +
        "It's just perfect.",
      author: {
        name: "Meera Joshi",
        title: "Supply Chain Director, MedNet India",
        avatar: "MJ",
      },
    },
  ],
}
```

---

## 📁 `UseCase.jsx`

```js
export const USE_CASE = {
  // Left column: phone mockup (same component as FeatureIntro)
  phoneMockup: {
    appName: "● PharmaAgent",
    searchPlaceholder: "Search anything...",
    filterLabel: "Category ▾",
    stockItems: [
      {
        name: "Paracetamol 500",
        subLabel: "Fast Restock",
        status: "CRITICAL",
        statusColor: "danger",
      },
      {
        name: "Insulin 100IU",
        subLabel: "Expiry Alert",
        status: "WARN",
        statusColor: "warn",
      },
    ],
  },

  // Right column: headline + body + CTA
  headline: {
    line1: "Simplify How You",
    line2: "Monitor and Manage",
    line3: "Pharmaceutical Inventory",
  },

  body:
    "PharmaAgent helps you eliminate the guesswork of managing pharma products. " +
    "It's easy to get started and the AI can be extremely affordable and scalable, " +
    "with short timeframes and full credibility.",

  cta: {
    label: "Learn More →",
    href:  "/features",
  },
}
```

---

## 📁 `FAQ.jsx`

```js
export const FAQ = {
  eyebrow: "FAQ",

  headline: "Questions & Answers",

  items: [
    {
      id: 1,
      question:
        "What makes PharmaAgent different from other inventory tools?",
      answer:
        "PharmaAgent is the only platform built around autonomous AI agents — not " +
        "just dashboards. Our Reorder, Redistribution, and Forecasting agents act " +
        "on your data in real time, reducing human effort by up to 60% while " +
        "delivering 94% demand forecast accuracy. Unlike traditional tools that " +
        "show you what's wrong, PharmaAgent fixes it automatically.",
      defaultOpen: true,
    },
    {
      id: 2,
      question: "Do you offer a free trial?",
      answer:
        "Yes. PharmaAgent offers a 14-day free trial where you can connect your " +
        "inventory data and see real AI-driven recommendations — no credit card " +
        "required. Enterprise pilots with dedicated onboarding are also available.",
      defaultOpen: false,
    },
    {
      id: 3,
      question: "Can I use PharmaAgent across multiple branches?",
      answer:
        "Absolutely. PharmaAgent is built for multi-location networks. It monitors " +
        "inventory across 200+ branches simultaneously, identifies redistribution " +
        "opportunities between locations, and gives executives a unified network " +
        "view — all from a single dashboard.",
      defaultOpen: false,
    },
    {
      id: 4,
      question: "Does PharmaAgent work on mobile?",
      answer:
        "Yes. Pharmacists and field staff can access alerts, approve AI " +
        "recommendations, and check stock levels from any mobile device. The " +
        "mobile interface is optimized for quick decisions — critical alerts " +
        "surface in under 3 seconds.",
      defaultOpen: false,
    },
    {
      id: 5,
      question: "How secure is my data?",
      answer:
        "PharmaAgent is SOC 2 Type II certified and built on HIPAA-compliant " +
        "architecture. All data is encrypted in transit (TLS 1.3) and at rest " +
        "(AES-256). Role-based access control ensures each user only sees what " +
        "they need. Full audit logs are available for every AI decision.",
      defaultOpen: false,
    },
  ],
}
```

---

## 📁 `FinalCTA.jsx`

```js
export const FINAL_CTA = {
  headline: {
    line1: "Are you interested in",
    line2: "PharmaAgent?",
    // line2 renders in --color-acid
  },

  cta: {
    label: "Contact Sales →",
    href:  "/contact",
  },
}
```

---

## 📁 `Footer.jsx`

```js
export const FOOTER = {
  logo: {
    dot:  "●",             // --color-acid
    name: "PharmaAgent",
  },

  topNav: [
    { label: "Home",      href: "/" },
    { label: "Features",  href: "/features" },
    { label: "About",     href: "/about" },
    { label: "Resources", href: "/resources", hasDropdown: true },
  ],

  socials: [
    { icon: "Twitter",   href: "https://twitter.com/pharmaagent" },
    { icon: "Instagram", href: "https://instagram.com/pharmaagent" },
    { icon: "Linkedin",  href: "https://linkedin.com/company/pharmaagent" },
    { icon: "Youtube",   href: "https://youtube.com/pharmaagent" },
  ],

  linkColumns: [
    {
      heading: "Company",
      links: [
        { label: "Security",         href: "/security" },
        { label: "Brand Guidelines", href: "/brand" },
        { label: "Careers",          href: "/careers" },
        { label: "FAQs",             href: "/faq" },
      ],
    },
    {
      heading: "Legal Information",
      links: [
        { label: "Privacy Policy",   href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy",    href: "/cookies" },
        { label: "Compliance",       href: "/compliance" },
        { label: "Privacy Shield",   href: "/privacy-shield" },
      ],
    },
  ],

  bottomBar: {
    nav: [
      { label: "Home",      href: "/" },
      { label: "Features",  href: "/features" },
      { label: "About",     href: "/about" },
      { label: "Resources", href: "/resources" },
    ],
    legal: "Terms & Conditions · Privacy Policy",
    copyright: "© 2025 PharmaAgent Inc. All rights reserved.",
  },
}
```

---

## 🎨 Design Tokens (shared across all components)

```js
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
}
```

---

## 🧩 Component → Section Map

| File | Section | Content Object |
|---|---|---|
| `Hero.jsx` | Section 1 — Hero + Navbar | `NAV`, `HERO` |
| `FeatureIntro.jsx` | Section 2 — Left Text / Right Phone | `FEATURE_INTRO` |
| `FeatureGrid.jsx` | Section 3 — Bento Feature Grid | `FEATURE_GRID` |
| `Outcomes.jsx` | Section 4 — Stats + Testimonials | `OUTCOMES` |
| `UseCase.jsx` | Section 5 — Phone Left / Text Right | `USE_CASE` |
| `FAQ.jsx` | Section 6 — Accordion FAQ | `FAQ` |
| `FinalCTA.jsx` | Section 7 — CTA Banner | `FINAL_CTA` |
| `Footer.jsx` | Section 8 — Footer | `FOOTER` |

---

## ⚡ GSAP Animation Classes (add to JSX elements)

Every animated element needs these class names so the GSAP animation scripts in `animations/revealAll.js` pick them up automatically. **No animation logic lives in the component — just class names.**

```
reveal-section     → parent section wrapper
reveal-child       → any child that stagger-animates on scroll

hero-eyebrow       → eyebrow badge (fade down)
hero-headline      → headline wrapper (split into .word spans by GSAP)
hero-subtext       → subheadline paragraph
hero-cta-row       → email + button row
hero-trust-text    → "No credit card..." micro text
hero-mockup        → floating dashboard card (tilt + parallax)
hero-kpi-number    → each KPI value in mockup (count-up)

nav-logo           → logo in navbar
nav-links          → ul containing nav link items
nav-cta            → sign up button

feature-bullet     → each bullet item in FeatureIntro
phone-mockup       → phone frame in FeatureIntro / UseCase

bento-card         → each card in FeatureGrid
toggle-card        → Card F specifically (for toggle animation)
toggle-thumb       → the moving thumb inside toggle
toggle-track       → the track background of toggle
chat-card          → Card E (for typewriter on hover)
chat-bubble-text   → the text inside agent reply bubble

stat-revenue       → ₹2.1Cr counter in Outcomes
stat-revenue-pct   → 40% counter in Outcomes
testimonial-card   → each quote card in Outcomes

use-case-phone     → phone frame in UseCase
use-case-text      → text column wrapper in UseCase

faq-answer         → collapsible answer panel
faq-icon           → +/× icon in FAQ

cta-banner         → FinalCTA section wrapper
cta-headline       → headline in FinalCTA (split into .word spans)
cta-button         → Contact Sales button
```

---

## 📐 Section Background Colors

| Component | Background |
|---|---|
| `Hero.jsx` | `#0A0701` (--color-void) |
| `FeatureIntro.jsx` | `#0D0C09` |
| `FeatureGrid.jsx` | `#080807` |
| `Outcomes.jsx` | `#0D0C09` |
| `UseCase.jsx` | `#0A0701` (--color-void) |
| `FAQ.jsx` | `#0D0C09` |
| `FinalCTA.jsx` | `#0D0C09` |
| `Footer.jsx` | `#050403` |

---
