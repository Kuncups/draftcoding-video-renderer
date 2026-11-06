import fs from "fs";
import { execSync } from "child_process";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const h = (type, style, children) => ({ type, props: { style, children } });

async function loadFonts() {
  const [
    interReg, interSemi, interBold,
    spaceMed, spaceBold,
    jakartaMed, jakartaBold, jakartaExtra,
    monoMed, monoBold
  ] = await Promise.all([
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-600-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk@5.0.8/files/space-grotesk-latin-500-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk@5.0.8/files/space-grotesk-latin-700-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans@5.0.8/files/plus-jakarta-sans-latin-500-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans@5.0.8/files/plus-jakarta-sans-latin-700-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans@5.0.8/files/plus-jakarta-sans-latin-800-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-500-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-700-normal.woff").then(r => r.arrayBuffer())
  ]);
  return [
    { name: "Inter", data: interReg, weight: 400, style: "normal" },
    { name: "Inter", data: interSemi, weight: 600, style: "normal" },
    { name: "Inter", data: interBold, weight: 700, style: "normal" },
    { name: "Space Grotesk", data: spaceMed, weight: 500, style: "normal" },
    { name: "Space Grotesk", data: spaceBold, weight: 700, style: "normal" },
    { name: "Plus Jakarta Sans", data: jakartaMed, weight: 500, style: "normal" },
    { name: "Plus Jakarta Sans", data: jakartaBold, weight: 700, style: "normal" },
    { name: "Plus Jakarta Sans", data: jakartaExtra, weight: 800, style: "normal" },
    { name: "JetBrains Mono", data: monoMed, weight: 500, style: "normal" },
    { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" }
  ];
}

const THEMES = [
  {
    id: "neo-brutalist",
    name: "Neo-Brutalist Pop",
    fontDisplay: "Space Grotesk",
    fontBody: "Plus Jakarta Sans",
    bg: "#FFFFFF",
    canvasGrid: "#F1F5F9",
    ink: "#09090B",
    muted: "#3F3F46",
    accent: "#2563EB",
    accentText: "#FFFFFF",
    accentSoft: "#EFF6FF",
    secondary: "#FACC15",
    secondaryText: "#09090B",
    cardBg: "#FFFFFF",
    cardBorder: "3px solid #09090B",
    cardShadow: "10px 10px 0px #09090B",
    cardRadius: "24px",
    codeBg: "#09090B",
    codeText: "#F8FAFC",
    probColor: "#E11D48",
    probBg: "#FFE4E6",
    solColor: "#059669",
    solBg: "#D1FAE5"
  },
  {
    id: "swiss-editorial",
    name: "Swiss International Grid",
    fontDisplay: "Inter",
    fontBody: "Inter",
    bg: "#FFFFFF",
    canvasGrid: "#E2E8F0",
    ink: "#09090B",
    muted: "#475569",
    accent: "#FF3B00",
    accentText: "#FFFFFF",
    accentSoft: "#FFF5F2",
    secondary: "#0047FF",
    secondaryText: "#FFFFFF",
    cardBg: "#F8FAFC",
    cardBorder: "2px solid #0F172A",
    cardShadow: "none",
    cardRadius: "12px",
    codeBg: "#0F172A",
    codeText: "#F8FAFC",
    probColor: "#DC2626",
    probBg: "#FEF2F2",
    solColor: "#0047FF",
    solBg: "#EFF6FF"
  },
  {
    id: "bento-studio",
    name: "Modern Bento Studio",
    fontDisplay: "Plus Jakarta Sans",
    fontBody: "Plus Jakarta Sans",
    bg: "#FFFFFF",
    canvasGrid: "#F1F5F9",
    ink: "#0F172A",
    muted: "#475569",
    accent: "#4F46E5",
    accentText: "#FFFFFF",
    accentSoft: "#EEF2FF",
    secondary: "#06B6D4",
    secondaryText: "#FFFFFF",
    cardBg: "#F8FAFC",
    cardBorder: "2px solid #CBD5E1",
    cardShadow: "0px 16px 36px rgba(15, 23, 42, 0.07)",
    cardRadius: "32px",
    codeBg: "#0F172A",
    codeText: "#F1F5F9",
    probColor: "#E11D48",
    probBg: "#FFF1F2",
    solColor: "#0D9488",
    solBg: "#F0FDFA"
  },
  {
    id: "fintech-emerald",
    name: "FinTech Emerald Deck",
    fontDisplay: "Plus Jakarta Sans",
    fontBody: "Inter",
    bg: "#FFFFFF",
    canvasGrid: "#ECFDF5",
    ink: "#064E3B",
    muted: "#334155",
    accent: "#059669",
    accentText: "#FFFFFF",
    accentSoft: "#ECFDF5",
    secondary: "#10B981",
    secondaryText: "#FFFFFF",
    cardBg: "#F8FAFC",
    cardBorder: "2px solid #A7F3D0",
    cardShadow: "0px 14px 30px rgba(5, 150, 105, 0.08)",
    cardRadius: "28px",
    codeBg: "#022C22",
    codeText: "#ECFDF5",
    probColor: "#EA580C",
    probBg: "#FFF7ED",
    solColor: "#059669",
    solBg: "#D1FAE5"
  },
  {
    id: "creative-agency",
    name: "Creative Agency Editorial",
    fontDisplay: "Space Grotesk",
    fontBody: "Plus Jakarta Sans",
    bg: "#FFFFFF",
    canvasGrid: "#F5F3FF",
    ink: "#1E1B4B",
    muted: "#4B5563",
    accent: "#7C3AED",
    accentText: "#FFFFFF",
    accentSoft: "#F5F3FF",
    secondary: "#F59E0B",
    secondaryText: "#09090B",
    cardBg: "#FAFAFA",
    cardBorder: "2px solid #DDD6FE",
    cardShadow: "8px 8px 0px #7C3AED",
    cardRadius: "26px",
    codeBg: "#1E1B4B",
    codeText: "#F5F3FF",
    probColor: "#E11D48",
    probBg: "#FFE4E6",
    solColor: "#7C3AED",
    solBg: "#EDE9FE"
  }
];

function renderCodeWindow(codeStr, fileName = "solution.ts", statusLabel = "PRODUCTION", theme, slideNum = 1, minHeight = "0px") {
  const rawLines = String(codeStr || "").split("\n").slice(0, 11);
  const accentColor = slideNum === 2 ? "#FB7185" : slideNum === 3 ? "#34D399" : "#60A5FA";

  const codeRows = rawLines.map((line, idx) => {
    const trimmed = line.trim();
    const isComment = trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*");
    const isBadHeader = trimmed.includes("❌");
    const isGoodHeader = trimmed.includes("✅");
    const isHighlight = /^(const|let|var|function|async|await|return|import|export|if|else|class|interface|SELECT|FROM|WHERE|void)\b/.test(trimmed);

    let lineColor = theme.codeText;
    if (isBadHeader) lineColor = "#FB7185";
    else if (isGoodHeader) lineColor = "#34D399";
    else if (isComment) lineColor = "#94A3B8";
    else if (isHighlight) lineColor = accentColor;

    return h("div", {
      display: "flex",
      alignItems: "flex-start",
      width: "100%",
      marginBottom: idx < rawLines.length - 1 ? "12px" : "0px"
    }, [
      h("div", {
        display: "flex",
        width: "48px",
        fontFamily: "JetBrains Mono",
        fontSize: "23px",
        color: "#64748B",
        flexShrink: 0
      }, String(idx + 1).padStart(2, "0")),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "25px",
        fontWeight: isComment && !isBadHeader && !isGoodHeader ? 500 : 700,
        color: lineColor,
        lineHeight: 1.48,
        whiteSpace: "pre-wrap",
        flex: 1
      }, line)
    ]);
  });

  return h("div", {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.codeBg,
    border: theme.id === "neo-brutalist" ? "3px solid #09090B" : "2px solid #1E293B",
    boxShadow: theme.id === "neo-brutalist" ? "8px 8px 0px #09090B" : "0px 12px 30px rgba(15,23,42,0.14)",
    borderRadius: "22px",
    width: "100%",
    minHeight,
    overflow: "hidden"
  }, [
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.12)",
      padding: "20px 30px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#FB7185", marginRight: "10px" }, ""),
        h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#FACC15", marginRight: "10px" }, ""),
        h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#34D399", marginRight: "20px" }, ""),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "21px",
          fontWeight: 700,
          color: "#E2E8F0"
        }, String(fileName || "draftcoding.ts"))
      ]),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "18px",
        fontWeight: 700,
        color: "#FFFFFF",
        backgroundColor: slideNum === 2 ? "#E11D48" : slideNum === 3 ? "#059669" : theme.accent,
        padding: "6px 16px",
        borderRadius: "99px"
      }, String(statusLabel))
    ]),
    h("div", {
      display: "flex",
      flexDirection: "column",
      padding: "32px 34px",
      width: "100%",
      boxSizing: "border-box"
    }, codeRows)
  ]);
}

// Dedicated Animated Cover Thumbnail Frame Builder for Reels (1080x1920) before Slide 1
function buildReelsThumbnailTree(thumbnail, topic, slides, theme, stepIndex = 5, totalSteps = 6) {
  const isBrutalist = theme.id === "neo-brutalist" || theme.id === "creative-agency";
  const stepRatio = Math.min(1, (stepIndex + 1) / 4);
  const thumb = thumbnail || {};
  const category = String(thumb.category || slides?.[0]?.tag || "TECH INSIGHT").toUpperCase();
  const badgeText = String(thumb.badge || `EXCLUSIVE CASE STUDY • ${theme.name.toUpperCase()}`);
  const titleTop = String(thumb.title_top || topic || "BEDAH ARSITEKTUR");
  const highlightWord = String(thumb.highlight || "SKALA PRODUKSI");
  const titleBottom = String(thumb.title_bottom || slides?.[0]?.headline || "TANPA DRAMA & BOTTLENECK");
  const subtitle = String(thumb.subtitle || slides?.[0]?.body || "Panduan praktis engineering & desain dari tim @draftcoding.id");
  const statValue = String(thumb.stat_value || "99.4%");
  const statLabel = String(thumb.stat_label || "PRODUCTION SCORE");
  const metrics = Array.isArray(thumb.visual_metrics) && thumb.visual_metrics.length >= 2
    ? thumb.visual_metrics.slice(0, 2)
    : [
        { label: "Performa & Stabilitas", before: "34%", after: "98%" },
        { label: "Efisiensi Kode & UI", before: "Lambat", after: "Optimal" }
      ];

  const topMasthead = h("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottom: `3px solid ${theme.ink}`,
    paddingBottom: "32px"
  }, [
    h("div", { display: "flex", alignItems: "center" }, [
      h("div", {
        display: "flex",
        backgroundColor: theme.ink,
        color: "#FFFFFF",
        padding: "12px 24px",
        borderRadius: "10px",
        fontFamily: "JetBrains Mono",
        fontSize: "21px",
        fontWeight: 700,
        marginRight: "14px"
      }, "COVER EDITION"),
      h("div", {
        display: "flex",
        backgroundColor: theme.accentSoft,
        color: theme.accent,
        border: `2px solid ${theme.accent}`,
        padding: "10px 22px",
        borderRadius: "10px",
        fontFamily: "JetBrains Mono",
        fontSize: "21px",
        fontWeight: 700
      }, category)
    ]),
    h("div", {
      display: "flex",
      backgroundColor: theme.secondary,
      color: theme.secondaryText,
      border: isBrutalist ? "2px solid #09090B" : "none",
      boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
      padding: "10px 24px",
      borderRadius: "99px",
      fontFamily: "JetBrains Mono",
      fontSize: "21px",
      fontWeight: 700
    }, "✦ THUMBNAIL // 00")
  ]);

  const heroSection = h("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
    padding: "48px 0px"
  }, [
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        alignSelf: "flex-start",
        backgroundColor: theme.accentSoft,
        color: theme.accent,
        padding: "10px 24px",
        borderRadius: "99px",
        fontFamily: "JetBrains Mono",
        fontSize: "21px",
        fontWeight: 700,
        marginBottom: "28px"
      }, `⚡ ${badgeText}`),
      h("div", {
        display: "flex",
        fontFamily: theme.fontDisplay,
        fontSize: "66px",
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: "-0.03em",
        color: theme.ink,
        marginBottom: "18px"
      }, titleTop.toUpperCase()),
      h("div", { display: "flex", alignItems: "center", marginBottom: "18px" }, [
        h("div", {
          display: "flex",
          backgroundColor: theme.accent,
          color: "#FFFFFF",
          border: isBrutalist ? "3px solid #09090B" : "none",
          boxShadow: isBrutalist ? "8px 8px 0px #09090B" : "none",
          padding: "12px 32px",
          borderRadius: "18px",
          fontFamily: theme.fontDisplay,
          fontSize: "70px",
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          marginRight: "22px"
        }, highlightWord.toUpperCase()),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "52px",
          fontWeight: 700,
          color: theme.accent
        }, "↗")
      ]),
      h("div", {
        display: "flex",
        fontFamily: theme.fontDisplay,
        fontSize: "58px",
        fontWeight: 700,
        lineHeight: 1.14,
        letterSpacing: "-0.025em",
        color: theme.ink,
        marginBottom: "26px"
      }, titleBottom),
      h("div", {
        display: "flex",
        fontFamily: theme.fontBody,
        fontSize: "33px",
        fontWeight: 500,
        lineHeight: 1.45,
        color: theme.muted
      }, subtitle)
    ]),

    h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.cardBg,
      border: theme.cardBorder,
      boxShadow: theme.cardShadow,
      borderRadius: theme.cardRadius,
      padding: "42px 44px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #E2E8F0",
        paddingBottom: "22px",
        marginBottom: "28px",
        width: "100%"
      }, [
        h("div", { display: "flex", alignItems: "center" }, [
          h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#FB7185", marginRight: "8px" }, ""),
          h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#FACC15", marginRight: "8px" }, ""),
          h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#34D399", marginRight: "16px" }, ""),
          h("div", {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "20px",
            fontWeight: 700,
            color: theme.ink
          }, `TOPIC PREVIEW // ${String(topic || "").toUpperCase().slice(0, 26)}`)
        ]),
        h("div", {
          display: "flex",
          backgroundColor: theme.solBg,
          color: theme.solColor,
          padding: "8px 18px",
          borderRadius: "99px",
          fontFamily: "JetBrains Mono",
          fontSize: "18px",
          fontWeight: 700
        }, "● VERIFIED")
      ]),
      h("div", {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "24px"
      }, metrics.map((m, idx) =>
        h("div", {
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          border: "2px solid #E2E8F0",
          borderRadius: "18px",
          padding: "22px 26px",
          marginBottom: idx === 0 ? "16px" : "0px",
          width: "100%",
          boxSizing: "border-box"
        }, [
          h("div", {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "12px"
          }, [
            h("div", {
              display: "flex",
              fontFamily: theme.fontBody,
              fontSize: "24px",
              fontWeight: 700,
              color: theme.ink
            }, String(m.label)),
            h("div", { display: "flex", alignItems: "center" }, [
              h("div", {
                display: "flex",
                backgroundColor: theme.probBg,
                color: theme.probColor,
                padding: "6px 14px",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: "19px",
                fontWeight: 700,
                marginRight: "12px"
              }, `❌ ${m.before}`),
              h("div", {
                display: "flex",
                backgroundColor: theme.solBg,
                color: theme.solColor,
                padding: "6px 14px",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: "19px",
                fontWeight: 700
              }, `✅ ${m.after}`)
            ])
          ]),
          h("div", {
            display: "flex",
            width: "100%",
            height: "12px",
            backgroundColor: "#E2E8F0",
            borderRadius: "99px",
            overflow: "hidden"
          }, [
            h("div", {
              width: `${Math.round((idx === 0 ? 94 : 88) * stepRatio)}%`,
              height: "12px",
              backgroundColor: theme.accent,
              borderRadius: "99px"
            }, "")
          ])
        ])
      )),
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: theme.codeBg,
        color: "#FFFFFF",
        borderRadius: "18px",
        padding: "24px 32px",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          color: "#94A3B8"
        }, `BENCHMARK // ${statLabel}`),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "40px",
          fontWeight: 700,
          color: "#34D399"
        }, statValue)
      ])
    ])
  ]);

  const footer = h("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderTop: "2px solid #E2E8F0",
    paddingTop: "32px"
  }, [
    h("div", { display: "flex", alignItems: "center" }, [
      h("div", {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "60px",
        height: "60px",
        borderRadius: "14px",
        backgroundColor: theme.accent,
        color: "#FFFFFF",
        fontFamily: "JetBrains Mono",
        fontSize: "26px",
        fontWeight: 700,
        marginRight: "20px"
      }, "DC"),
      h("div", { display: "flex", flexDirection: "column" }, [
        h("div", { display: "flex", fontFamily: theme.fontDisplay, fontSize: "28px", fontWeight: 700, color: theme.ink }, "@draftcoding.id"),
        h("div", { display: "flex", fontFamily: "JetBrains Mono", fontSize: "20px", fontWeight: 500, color: theme.muted }, "WEB • ANDROID • UI/UX • ARDUINO")
      ])
    ]),
    h("div", {
      display: "flex",
      backgroundColor: theme.accent,
      color: "#FFFFFF",
      padding: "14px 28px",
      borderRadius: "99px",
      fontFamily: "JetBrains Mono",
      fontSize: "22px",
      fontWeight: 700
    }, "MULAI SLIDE 01 ➔")
  ]);

  return h("div", {
    width: "1080px",
    height: "1920px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    color: theme.ink,
    fontFamily: theme.fontBody,
    padding: "115px 72px 125px 72px",
    border: `12px solid ${theme.canvasGrid}`,
    boxSizing: "border-box"
  }, [topMasthead, heroSection, footer]);
}

// Animated Frame Builder for Reels Format A (Kinetic Slide Entrance & Micro-Motion)
function buildAnimatedReelsSlideTree(slide, totalSlides = 4, theme, stepIndex = 7, totalSteps = 8) {
  const slideNum = slide.slide_num || 1;
  const stepRatio = Math.min(1, (stepIndex + 1) / 5); // Completes entrance by frame 4, holds 5..7
  const showTakeaway = stepIndex >= 3;
  const cursorChar = stepIndex % 2 === 0 ? " ▋" : "";

  // Animated Segmented Progress Bar
  const segments = [];
  for (let i = 1; i <= totalSlides; i++) {
    const isPast = i < slideNum;
    const isCurrent = i === slideNum;
    const fillPct = isPast ? 100 : isCurrent ? Math.round(((stepIndex + 1) / totalSteps) * 100) : 0;

    segments.push(
      h("div", {
        flex: 1,
        height: "10px",
        borderRadius: "99px",
        backgroundColor: "#E2E8F0",
        marginRight: i < totalSlides ? "14px" : "0px",
        display: "flex",
        overflow: "hidden"
      }, [
        h("div", {
          width: `${fillPct}%`,
          height: "10px",
          borderRadius: "99px",
          backgroundColor: theme.accent
        }, "")
      ])
    );
  }

  const labels = ["✦ STUDIO BRIEF", "⚡ ROOT CAUSE", "★ ARCHITECTURE", "🚀 PARTNER SPEC"];
  const isBrutalist = theme.id === "neo-brutalist" || theme.id === "creative-agency";

  const topHeader = h("div", {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, [
    h("div", { display: "flex", width: "100%", marginBottom: "38px" }, segments),
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", {
          display: "flex",
          backgroundColor: theme.accent,
          color: theme.accentText,
          border: isBrutalist ? "2px solid #09090B" : "none",
          boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
          padding: "10px 24px",
          borderRadius: "10px",
          fontFamily: "JetBrains Mono",
          fontSize: "21px",
          fontWeight: 700,
          marginRight: "14px"
        }, String(slide.tag || "#OSCS").toUpperCase()),
        h("div", {
          display: "flex",
          backgroundColor: slideNum === 2 ? theme.probBg : slideNum === 3 ? theme.solBg : theme.secondary,
          color: slideNum === 2 ? theme.probColor : slideNum === 3 ? theme.solColor : theme.secondaryText,
          border: isBrutalist ? "2px solid #09090B" : `1px solid ${theme.accent}`,
          padding: "10px 20px",
          borderRadius: "999px",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700
        }, labels[(slideNum - 1) % 4])
      ]),
      h("div", {
        display: "flex",
        backgroundColor: theme.accentSoft,
        color: theme.accent,
        border: `2px solid ${theme.accent}`,
        padding: "8px 20px",
        borderRadius: "99px",
        fontFamily: "JetBrains Mono",
        fontSize: "24px",
        fontWeight: 700
      }, `0${slideNum} / 0${totalSlides}`)
    ])
  ]);

  // Progressive Code Reveal for kinetic feel
  const fullCodeLines = String(slide.code || "").split("\n");
  const visibleCount = Math.max(1, Math.ceil(fullCodeLines.length * stepRatio));
  const animatedCode = fullCodeLines.slice(0, visibleCount).join("\n") + cursorChar;

  let centerContent;

  if (slideNum === 1) {
    const sparkles = stepIndex % 2 === 0 ? "✦ ★ ✦" : "★ ✦ ★";
    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.cardBg,
      border: theme.cardBorder,
      boxShadow: theme.cardShadow,
      borderRadius: theme.cardRadius,
      padding: "56px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "28px"
      }, [
        h("div", {
          display: "flex",
          backgroundColor: theme.accentSoft,
          color: theme.accent,
          padding: "10px 22px",
          borderRadius: "10px",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700
        }, `THEME // ${theme.name.toUpperCase()}`),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "32px",
          fontWeight: 700,
          color: theme.accent
        }, sparkles)
      ]),
      h("div", {
        display: "flex",
        fontFamily: theme.fontDisplay,
        fontSize: "66px",
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: "-0.03em",
        color: theme.ink,
        marginBottom: "28px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        borderLeft: `8px solid ${theme.accent}`,
        backgroundColor: theme.accentSoft,
        padding: "24px 30px",
        borderRadius: "0px 18px 18px 0px",
        fontFamily: theme.fontBody,
        fontSize: "34px",
        fontWeight: 500,
        lineHeight: 1.48,
        color: theme.muted,
        marginBottom: "38px",
        width: "100%",
        boxSizing: "border-box"
      }, String(slide.body || "")),
      slide.code ? renderCodeWindow(animatedCode, slide.file_name || "overview.ts", "INSIGHT", theme, 1) : null,
      showTakeaway && slide.key_takeaway ? h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "30px",
        backgroundColor: theme.secondary,
        color: theme.secondaryText,
        border: isBrutalist ? "2px solid #09090B" : "none",
        borderRadius: "18px",
        padding: "22px 28px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          marginRight: "16px"
        }, "💡 FOCUS:"),
        h("div", {
          display: "flex",
          fontFamily: theme.fontBody,
          fontSize: "26px",
          fontWeight: 700,
          flex: 1
        }, String(slide.key_takeaway))
      ]) : null
    ].filter(Boolean));
  } else if (slideNum === 4 && Array.isArray(slide.deliverables) && slide.deliverables.length > 0) {
    const visibleDeliverables = Math.max(1, Math.ceil(slide.deliverables.length * stepRatio));
    const bentoItems = slide.deliverables.slice(0, visibleDeliverables).map((item, idx) =>
      h("div", {
        display: "flex",
        alignItems: "center",
        backgroundColor: idx % 2 === 0 ? theme.accentSoft : "#F8FAFC",
        border: isBrutalist ? "2px solid #09090B" : `2px solid ${theme.canvasGrid}`,
        boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
        borderRadius: "18px",
        padding: "24px 28px",
        marginBottom: "18px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "46px",
          height: "46px",
          borderRadius: "12px",
          backgroundColor: theme.accent,
          color: "#FFFFFF",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          marginRight: "20px",
          flexShrink: 0
        }, `0${idx + 1}`),
        h("div", {
          display: "flex",
          fontFamily: theme.fontBody,
          fontSize: "30px",
          fontWeight: 700,
          color: theme.ink,
          flex: 1
        }, String(item)),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "28px",
          fontWeight: 700,
          color: theme.solColor
        }, "✓")
      ])
    );

    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.cardBg,
      border: theme.cardBorder,
      boxShadow: theme.cardShadow,
      borderRadius: theme.cardRadius,
      padding: "56px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        fontFamily: theme.fontDisplay,
        fontSize: "58px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        color: theme.ink,
        marginBottom: "22px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontFamily: theme.fontBody,
        fontSize: "34px",
        fontWeight: 500,
        lineHeight: 1.48,
        color: theme.muted,
        marginBottom: "38px"
      }, String(slide.body || "")),
      h("div", {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "28px"
      }, bentoItems),
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.accent,
        color: "#FFFFFF",
        border: isBrutalist ? "2px solid #09090B" : "none",
        borderRadius: "18px",
        padding: "24px 32px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "23px",
          fontWeight: 700
        }, "WEB • ANDROID • UI/UX • IOT"),
        h("div", {
          display: "flex",
          backgroundColor: theme.secondary,
          color: theme.secondaryText,
          padding: "10px 22px",
          borderRadius: "99px",
          fontFamily: "JetBrains Mono",
          fontSize: "21px",
          fontWeight: 700
        }, "KONSULTASI GRATIS ↗")
      ])
    ]);
  } else {
    const isProb = slideNum === 2;
    const statusColor = isProb ? theme.probColor : theme.solColor;
    const statusBg = isProb ? theme.probBg : theme.solBg;

    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.cardBg,
      border: theme.cardBorder,
      boxShadow: theme.cardShadow,
      borderRadius: theme.cardRadius,
      padding: "56px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        alignItems: "center",
        backgroundColor: statusBg,
        color: statusColor,
        padding: "12px 24px",
        borderRadius: "12px",
        fontFamily: "JetBrains Mono",
        fontSize: "21px",
        fontWeight: 700,
        marginBottom: "26px",
        alignSelf: "flex-start"
      }, isProb ? "⚠️ BOTTLENECK // MASALAH TEKNIS" : "✅ CLEAN ARCHITECTURE // SOLUSI"),
      h("div", {
        display: "flex",
        fontFamily: theme.fontDisplay,
        fontSize: "60px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        color: theme.ink,
        marginBottom: "24px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontFamily: theme.fontBody,
        fontSize: "35px",
        fontWeight: 500,
        lineHeight: 1.5,
        color: theme.muted,
        marginBottom: "38px"
      }, String(slide.body || "")),
      slide.code ? renderCodeWindow(
        animatedCode,
        slide.file_name || (isProb ? "bottleneck.ts" : "optimized.ts"),
        isProb ? "ANTI-PATTERN" : "PRODUCTION",
        theme,
        slideNum
      ) : null,
      showTakeaway && slide.key_takeaway ? h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "30px",
        backgroundColor: statusBg,
        border: `2px solid ${statusColor}`,
        borderRadius: "16px",
        padding: "22px 28px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          color: statusColor,
          marginRight: "16px"
        }, isProb ? "❌ DAMPAK:" : "🚀 HASIL:"),
        h("div", {
          display: "flex",
          fontFamily: theme.fontBody,
          fontSize: "27px",
          fontWeight: 700,
          color: theme.ink,
          flex: 1
        }, String(slide.key_takeaway))
      ]) : null
    ].filter(Boolean));
  }

  const footer = h("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderTop: "2px solid #E2E8F0",
    paddingTop: "34px"
  }, [
    h("div", { display: "flex", alignItems: "center" }, [
      h("div", {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "60px",
        height: "60px",
        borderRadius: "14px",
        backgroundColor: theme.accent,
        color: "#FFFFFF",
        border: isBrutalist ? "2px solid #09090B" : "none",
        boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
        fontFamily: "JetBrains Mono",
        fontSize: "26px",
        fontWeight: 700,
        marginRight: "20px"
      }, "DC"),
      h("div", { display: "flex", flexDirection: "column" }, [
        h("div", { display: "flex", fontFamily: theme.fontDisplay, fontSize: "28px", fontWeight: 700, color: theme.ink }, "@draftcoding.id"),
        h("div", { display: "flex", fontFamily: "JetBrains Mono", fontSize: "20px", fontWeight: 500, color: theme.muted }, "SOFTWARE & IOT AGENCY  •  #OSCS")
      ])
    ]),
    h("div", {
      display: "flex",
      backgroundColor: slideNum === totalSlides ? theme.accent : "#09090B",
      color: "#FFFFFF",
      border: isBrutalist ? "2px solid #09090B" : "none",
      boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
      padding: "14px 28px",
      borderRadius: "99px",
      fontFamily: "JetBrains Mono",
      fontSize: "22px",
      fontWeight: 700
    }, slideNum === totalSlides ? "DM @DRAFTCODING.ID ↗" : "NEXT →")
  ]);

  return h("div", {
    width: "1080px",
    height: "1920px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    color: theme.ink,
    fontFamily: theme.fontBody,
    padding: "115px 72px 125px 72px",
    border: `12px solid ${theme.canvasGrid}`,
    boxSizing: "border-box"
  }, [topHeader, centerContent, footer]);
}

// Animated Frame Builder for Reels Format B (Interactive Live Code Refactor & Performance Meter)
function buildTypewriterTree(data, theme, typedCode, progressRatio) {
  const headline = data.slides?.[0]?.headline || data.topic;
  const fileName = data.slides?.[2]?.file_name || "refactor.ts";
  const takeaway = data.slides?.[2]?.key_takeaway || "Clean Architecture & Optimal Performance";
  const isBrutalist = theme.id === "neo-brutalist" || theme.id === "creative-agency";

  // Animated Performance Health Score: starts at 28% (Red) during problem phase, surges to 98% (Emerald) during solution phase!
  const isSolutionPhase = progressRatio >= 0.42;
  const rawScore = !isSolutionPhase
    ? 28
    : Math.min(98, Math.round(28 + ((progressRatio - 0.42) / 0.45) * 70));
  const meterColor = rawScore < 50 ? "#E11D48" : rawScore < 80 ? "#F59E0B" : "#10B981";
  const meterBg = rawScore < 50 ? "#FFE4E6" : rawScore < 80 ? "#FEF3C7" : "#D1FAE5";
  const meterLabel = rawScore < 50 ? "⚠️ BOTTLENECK DETECTED" : rawScore < 85 ? "⚡ REFACTORING CODE..." : "🚀 PRODUCTION OPTIMIZED";

  return h("div", {
    width: "1080px",
    height: "1920px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    color: theme.ink,
    fontFamily: theme.fontBody,
    padding: "115px 72px 125px 72px",
    border: `12px solid ${theme.canvasGrid}`,
    boxSizing: "border-box"
  }, [
    // Top Header
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        width: "100%",
        height: "10px",
        backgroundColor: "#E2E8F0",
        borderRadius: "99px",
        marginBottom: "36px",
        overflow: "hidden"
      }, [
        h("div", {
          width: `${Math.max(6, Math.round(progressRatio * 100))}%`,
          height: "10px",
          backgroundColor: theme.accent,
          borderRadius: "99px"
        }, "")
      ]),
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
      }, [
        h("div", { display: "flex", alignItems: "center" }, [
          h("div", {
            display: "flex",
            backgroundColor: theme.accent,
            color: "#FFFFFF",
            border: isBrutalist ? "2px solid #09090B" : "none",
            boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
            padding: "10px 24px",
            borderRadius: "10px",
            fontFamily: "JetBrains Mono",
            fontSize: "21px",
            fontWeight: 700,
            marginRight: "14px"
          }, "⌨️ LIVE REFACTOR"),
          h("div", {
            display: "flex",
            backgroundColor: theme.secondary,
            color: theme.secondaryText,
            border: isBrutalist ? "2px solid #09090B" : "none",
            padding: "10px 20px",
            borderRadius: "99px",
            fontFamily: "JetBrains Mono",
            fontSize: "20px",
            fontWeight: 700
          }, String(data.slides?.[0]?.tag || "#OSCS"))
        ]),
        h("div", {
          display: "flex",
          backgroundColor: theme.accentSoft,
          color: theme.accent,
          border: `2px solid ${theme.accent}`,
          padding: "8px 20px",
          borderRadius: "99px",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700
        }, `${Math.round(progressRatio * 100)}%`)
      ])
    ]),

    // Center Content: Headline + Animated Performance Meter + Live IDE
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        fontFamily: theme.fontDisplay,
        fontSize: "56px",
        fontWeight: 700,
        lineHeight: 1.14,
        letterSpacing: "-0.03em",
        color: theme.ink,
        marginBottom: "28px"
      }, String(headline)),

      // Animated Live Health / Performance Meter Card
      h("div", {
        display: "flex",
        flexDirection: "column",
        backgroundColor: meterBg,
        border: `2px solid ${meterColor}`,
        borderRadius: "20px",
        padding: "22px 28px",
        marginBottom: "30px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "14px"
        }, [
          h("div", {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "21px",
            fontWeight: 700,
            color: meterColor
          }, meterLabel),
          h("div", {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "28px",
            fontWeight: 700,
            color: meterColor
          }, `SCORE: ${rawScore}/100`)
        ]),
        h("div", {
          display: "flex",
          width: "100%",
          height: "14px",
          backgroundColor: "#FFFFFF",
          borderRadius: "99px",
          overflow: "hidden"
        }, [
          h("div", {
            width: `${rawScore}%`,
            height: "14px",
            backgroundColor: meterColor,
            borderRadius: "99px"
          }, "")
        ])
      ]),

      // Live IDE Code Window
      renderCodeWindow(
        typedCode,
        fileName,
        isSolutionPhase ? "CLEAN CODE" : "DIAGNOSING",
        theme,
        isSolutionPhase ? 3 : 2,
        "620px"
      ),

      // Animated Outcome Banner
      h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "28px",
        backgroundColor: isSolutionPhase ? theme.solBg : theme.accentSoft,
        border: `2px solid ${isSolutionPhase ? theme.solColor : theme.accent}`,
        borderRadius: "18px",
        padding: "22px 28px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          color: isSolutionPhase ? theme.solColor : theme.accent,
          marginRight: "16px"
        }, isSolutionPhase ? "🚀 OUTCOME:" : "⏳ STATUS:"),
        h("div", {
          display: "flex",
          fontFamily: theme.fontBody,
          fontSize: "26px",
          fontWeight: 700,
          color: theme.ink,
          flex: 1
        }, isSolutionPhase ? String(takeaway) : "Menganalisis bottleneck & merakit solusi clean code...")
      ])
    ]),

    // Footer
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      borderTop: "2px solid #E2E8F0",
      paddingTop: "34px"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "60px",
          height: "60px",
          borderRadius: "14px",
          backgroundColor: theme.accent,
          color: "#FFFFFF",
          border: isBrutalist ? "2px solid #09090B" : "none",
          boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
          fontFamily: "JetBrains Mono",
          fontSize: "26px",
          fontWeight: 700,
          marginRight: "20px"
        }, "DC"),
        h("div", { display: "flex", flexDirection: "column" }, [
          h("div", { display: "flex", fontFamily: theme.fontDisplay, fontSize: "28px", fontWeight: 700, color: theme.ink }, "@draftcoding.id"),
          h("div", { display: "flex", fontFamily: "JetBrains Mono", fontSize: "20px", fontWeight: 500, color: theme.muted }, "WEB • ANDROID • UI/UX • ARDUINO")
        ])
      ]),
      h("div", {
        display: "flex",
        backgroundColor: theme.accent,
        color: "#FFFFFF",
        border: isBrutalist ? "2px solid #09090B" : "none",
        boxShadow: isBrutalist ? "4px 4px 0px #09090B" : "none",
        padding: "14px 28px",
        borderRadius: "99px",
        fontFamily: "JetBrains Mono",
        fontSize: "22px",
        fontWeight: 700
      }, "DM @DRAFTCODING.ID ↗")
    ])
  ]);
}

async function renderTreeToPngFile(tree, fonts, outPath) {
  const svg = await satori(tree, { width: 1080, height: 1920, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1080 } });
  fs.writeFileSync(outPath, resvg.render().asPng());
}

async function sendTelegramVideo(botToken, chatId, videoPath, caption) {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", caption);
  form.append("width", "1080");
  form.append("height", "1920");
  form.append("supports_streaming", "true");
  const bytes = fs.readFileSync(videoPath);
  form.append("video", new Blob([bytes], { type: "video/mp4" }), videoPath.split("/").pop());

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
    method: "POST",
    body: form
  }).then(r => r.json());

  if (!res.ok) {
    throw new Error("Gagal kirim video ke Telegram: " + JSON.stringify(res));
  }
}

async function main() {
  const data = JSON.parse(process.env.INPUT_JSON);
  const chatId = process.env.CHAT_ID;
  const videoMode = (process.env.VIDEO_MODE || "all").toLowerCase();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const fonts = await loadFonts();

  const themeIndex = typeof data.themeIndex === "number" ? data.themeIndex : Math.floor(Math.random() * THEMES.length);
  const theme = THEMES[themeIndex % THEMES.length];

  // 1. Render Format A: Kinetic Animated Slide Reels + Dynamic Multi-Transitions
  if (videoMode === "all" || videoMode === "a") {
    // 0. Render Cover Thumbnail Clip first (2.2s at 30fps)
    const thumbDir = "/tmp/reels_a_thumb";
    fs.mkdirSync(thumbDir, { recursive: true });
    const thumbSteps = 6;
    for (let s = 0; s < thumbSteps; s++) {
      const tree = buildReelsThumbnailTree(data.thumbnail, data.topic, data.slides, theme, s, thumbSteps);
      const frameName = `frame_${String(s).padStart(3, "0")}.png`;
      await renderTreeToPngFile(tree, fonts, `${thumbDir}/${frameName}`);
    }
    execSync(
      `ffmpeg -y -framerate 2.7 -i ${thumbDir}/frame_%03d.png ` +
      `-c:v libx264 -preset fast -crf 18 -r 30 -pix_fmt yuv420p -t 2.4 /tmp/clip_thumb.mp4`,
      { stdio: "inherit" }
    );

    const stepsPerSlide = 8; // 8 frames at 2.5fps = 3.2s per slide clip
    for (let i = 0; i < data.slides.length; i++) {
      const slideDir = `/tmp/reels_a_s${i}`;
      fs.mkdirSync(slideDir, { recursive: true });
      const slide = { ...data.slides[i], slide_num: i + 1 };

      for (let s = 0; s < stepsPerSlide; s++) {
        const tree = buildAnimatedReelsSlideTree(slide, data.slides.length, theme, s, stepsPerSlide);
        const frameName = `frame_${String(s).padStart(3, "0")}.png`;
        await renderTreeToPngFile(tree, fonts, `${slideDir}/${frameName}`);
      }

      // Encode animated slide clip (3.2s at 30fps)
      execSync(
        `ffmpeg -y -framerate 2.5 -i ${slideDir}/frame_%03d.png ` +
        `-c:v libx264 -preset fast -crf 18 -r 30 -pix_fmt yuv420p -t 3.2 /tmp/clip_${i}.mp4`,
        { stdio: "inherit" }
      );
    }

    // Join Thumbnail + 4 animated slide clips with dynamic transitions
    execSync(
      `ffmpeg -y ` +
      `-i /tmp/clip_thumb.mp4 -i /tmp/clip_0.mp4 -i /tmp/clip_1.mp4 -i /tmp/clip_2.mp4 -i /tmp/clip_3.mp4 ` +
      `-f lavfi -t 14.5 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
      `-filter_complex "` +
      `[0:v][1:v]xfade=transition=fade:duration=0.4:offset=2.0[v01];` +
      `[v01][2:v]xfade=transition=smoothleft:duration=0.4:offset=4.8[v02];` +
      `[v02][3:v]xfade=transition=circleopen:duration=0.4:offset=7.6[v03];` +
      `[v03][4:v]xfade=transition=wipeup:duration=0.4:offset=10.4,format=yuv420p[vout]" ` +
      `-map "[vout]" -map 5:a -c:v libx264 -preset fast -crf 18 -r 30 -c:a aac -shortest /tmp/reels_format_A.mp4`,
      { stdio: "inherit" }
    );

    await sendTelegramVideo(
      botToken,
      chatId,
      "/tmp/reels_format_A.mp4",
      `🎬 REELS FORMAT A — ${data.topic}\n🎨 Theme: ${theme.name} (Kinetic Slide Motion 1080x1920)`
    );
  }

  // 2. Render Format B: Interactive Before vs After Live Refactor & Performance Meter
  if (videoMode === "all" || videoMode === "b") {
    fs.mkdirSync("/tmp/reels_b", { recursive: true });
    const fullCode = [
      `// ❌ BEFORE (${data.slides[1]?.file_name || "bottleneck.ts"})`,
      String(data.slides[1]?.code || "").trim(),
      "",
      `// ✅ AFTER (${data.slides[2]?.file_name || "optimized.ts"})`,
      String(data.slides[2]?.code || "").trim()
    ].join("\n");

    const totalTypingFrames = 38;
    const totalHoldFrames = 14;
    for (let f = 0; f < totalTypingFrames + totalHoldFrames; f++) {
      const ratio = Math.min(1, (f + 1) / totalTypingFrames);
      const charCount = Math.floor(fullCode.length * ratio);
      const showCursor = f % 2 === 0;
      const typedSlice = fullCode.slice(0, charCount) + (showCursor ? "▋" : " ");
      const totalProgress = (f + 1) / (totalTypingFrames + totalHoldFrames);
      const tree = buildTypewriterTree(data, theme, typedSlice, totalProgress);
      const frameIndex = String(f).padStart(3, "0");
      await renderTreeToPngFile(tree, fonts, `/tmp/reels_b/frame_${frameIndex}.png`);
    }

    execSync(
      `ffmpeg -y -framerate 5 -i /tmp/reels_b/frame_%03d.png ` +
      `-f lavfi -t 10.4 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
      `-c:v libx264 -preset fast -crf 18 -r 30 -pix_fmt yuv420p -c:a aac -shortest /tmp/reels_format_B.mp4`,
      { stdio: "inherit" }
    );

    await sendTelegramVideo(
      botToken,
      chatId,
      "/tmp/reels_format_B.mp4",
      `⌨️ REELS FORMAT B — ${data.topic}\n🎨 Theme: ${theme.name} (Live Refactor + Score Animation 1080x1920)`
    );
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
