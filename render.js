import fs from "fs";
import { execSync } from "child_process";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const h = (type, style, children) => ({ type, props: { style, children } });

async function loadFonts() {
  const [interReg, interSemi, interBold, monoReg, monoBold] = await Promise.all([
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-600-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-400-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-700-normal.woff").then(r => r.arrayBuffer())
  ]);
  return [
    { name: "Inter", data: interReg, weight: 400, style: "normal" },
    { name: "Inter", data: interSemi, weight: 600, style: "normal" },
    { name: "Inter", data: interBold, weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: monoReg, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" }
  ];
}

function renderCodeWindow(codeStr, fileName = "solution.ts", statusLabel = "PRODUCTION", minHeight = "0px") {
  const rawLines = String(codeStr || "").split("\n").slice(0, 12);
  const codeRows = rawLines.map((line, idx) => {
    const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
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
        fontSize: "24px",
        color: "#52525B",
        flexShrink: 0
      }, String(idx + 1).padStart(2, "0")),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "26px",
        fontWeight: isComment ? 400 : 700,
        color: isComment ? "#71717A" : "#F4F4F5",
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        flex: 1
      }, line)
    ]);
  });

  return h("div", {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#070708",
    border: "1px solid #27272A",
    borderRadius: "24px",
    width: "100%",
    minHeight,
    overflow: "hidden"
  }, [
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#0E0E11",
      borderBottom: "1px solid #222225",
      padding: "22px 32px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#FFFFFF", marginRight: "10px" }, ""),
        h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#52525B", marginRight: "10px" }, ""),
        h("div", { width: "14px", height: "14px", borderRadius: "99px", backgroundColor: "#27272A", marginRight: "20px" }, ""),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          color: "#D4D4D8"
        }, String(fileName || "draftcoding.ts"))
      ]),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "19px",
        fontWeight: 700,
        color: "#A1A1AA",
        backgroundColor: "#18181B",
        border: "1px solid #27272A",
        padding: "6px 14px",
        borderRadius: "8px"
      }, String(statusLabel))
    ]),
    h("div", {
      display: "flex",
      flexDirection: "column",
      padding: "34px 36px",
      width: "100%",
      boxSizing: "border-box"
    }, codeRows)
  ]);
}

function buildReelsSlideTree(slide, totalSlides = 4) {
  const slideNum = slide.slide_num || 1;
  const segments = [];
  for (let i = 1; i <= totalSlides; i++) {
    segments.push(
      h("div", {
        flex: 1,
        height: "6px",
        borderRadius: "99px",
        backgroundColor: i <= slideNum ? "#FFFFFF" : "#1F1F23",
        marginRight: i < totalSlides ? "14px" : "0px"
      }, "")
    );
  }

  const topHeader = h("div", {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, [
    h("div", {
      display: "flex",
      width: "100%",
      marginBottom: "42px"
    }, segments),
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", {
          display: "flex",
          backgroundColor: "#FFFFFF",
          color: "#050505",
          padding: "10px 24px",
          borderRadius: "8px",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          marginRight: "16px"
        }, String(slide.tag || "#OSCS").toUpperCase()),
        h("div", {
          display: "flex",
          border: "1px solid #27272A",
          backgroundColor: "#0E0E11",
          color: "#A1A1AA",
          padding: "10px 20px",
          borderRadius: "8px",
          fontFamily: "JetBrains Mono",
          fontSize: "20px"
        }, slideNum === 1 ? "EDITORIAL BRIEF" : slideNum === 2 ? "ROOT CAUSE" : slideNum === 3 ? "ARCHITECTURE" : "PARTNER")
      ]),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "28px",
        fontWeight: 700,
        color: "#71717A"
      }, `0${slideNum} / 0${totalSlides}`)
    ])
  ]);

  let centerContent;
  if (slideNum === 1) {
    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%"
    }, [
      h("div", {
        display: "flex",
        fontSize: "74px",
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: "-0.03em",
        color: "#FFFFFF",
        marginBottom: "40px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        borderLeft: "5px solid #FFFFFF",
        paddingLeft: "32px",
        fontSize: "38px",
        fontWeight: 400,
        lineHeight: 1.5,
        color: "#A1A1AA",
        marginBottom: "52px"
      }, String(slide.body || "")),
      slide.code ? renderCodeWindow(slide.code, slide.file_name || "overview.ts", "INSIGHT") : null,
      slide.key_takeaway ? h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "32px",
        backgroundColor: "#121215",
        border: "1px solid #27272A",
        borderRadius: "16px",
        padding: "24px 30px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginRight: "16px"
        }, "✦ FOCUS:"),
        h("div", {
          display: "flex",
          fontSize: "26px",
          color: "#D4D4D8",
          flex: 1
        }, String(slide.key_takeaway))
      ]) : null
    ].filter(Boolean));
  } else if (slideNum === 4 && Array.isArray(slide.deliverables) && slide.deliverables.length > 0) {
    const items = slide.deliverables.slice(0, 4).map(item =>
      h("div", {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#09090B",
        border: "1px solid #27272A",
        borderRadius: "16px",
        padding: "26px 30px",
        marginBottom: "18px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          color: "#050505",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          marginRight: "22px",
          flexShrink: 0
        }, "✓"),
        h("div", {
          display: "flex",
          fontSize: "30px",
          fontWeight: 600,
          color: "#F4F4F5",
          flex: 1
        }, String(item))
      ])
    );

    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0E0E11",
      border: "1px solid #27272A",
      borderRadius: "28px",
      padding: "56px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        fontSize: "58px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        color: "#FFFFFF",
        marginBottom: "24px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontSize: "34px",
        lineHeight: 1.48,
        color: "#A1A1AA",
        marginBottom: "42px"
      }, String(slide.body || "")),
      h("div", {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "28px"
      }, items),
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        color: "#050505",
        borderRadius: "16px",
        padding: "24px 32px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "24px",
          fontWeight: 700
        }, "WEB • ANDROID • UI/UX • IOT"),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "24px",
          fontWeight: 700
        }, "CONSULTATION →")
      ])
    ]);
  } else {
    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0C0C0F",
      border: "1px solid #252529",
      borderRadius: "28px",
      padding: "56px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        fontSize: "60px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        color: "#FFFFFF",
        marginBottom: "28px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontSize: "36px",
        fontWeight: 400,
        lineHeight: 1.5,
        color: "#A1A1AA",
        marginBottom: "44px"
      }, String(slide.body || "")),
      slide.code ? renderCodeWindow(
        slide.code,
        slide.file_name || (slideNum === 2 ? "bottleneck.ts" : "optimized.ts"),
        slideNum === 2 ? "BOTTLENECK" : "CLEAN CODE"
      ) : null,
      slide.key_takeaway ? h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "32px",
        backgroundColor: "#141418",
        border: "1px solid #2E2E34",
        borderRadius: "16px",
        padding: "24px 30px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginRight: "16px"
        }, slideNum === 2 ? "⚠ IMPACT:" : "✓ RESULT:"),
        h("div", {
          display: "flex",
          fontSize: "26px",
          fontWeight: 600,
          color: "#E4E4E7",
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
    borderTop: "1px solid #222225",
    paddingTop: "36px"
  }, [
    h("div", { display: "flex", alignItems: "center" }, [
      h("div", {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "58px",
        height: "58px",
        borderRadius: "12px",
        backgroundColor: "#FFFFFF",
        color: "#050505",
        fontFamily: "JetBrains Mono",
        fontSize: "26px",
        fontWeight: 700,
        marginRight: "20px"
      }, "DC"),
      h("div", { display: "flex", flexDirection: "column" }, [
        h("div", { display: "flex", fontSize: "28px", fontWeight: 700, color: "#FFFFFF" }, "@draftcoding.id"),
        h("div", { display: "flex", fontFamily: "JetBrains Mono", fontSize: "20px", color: "#71717A" }, "SOFTWARE & IOT AGENCY  •  #OSCS")
      ])
    ]),
    h("div", {
      display: "flex",
      backgroundColor: slideNum === totalSlides ? "#FFFFFF" : "#121215",
      color: slideNum === totalSlides ? "#050505" : "#FFFFFF",
      border: "1px solid #FFFFFF",
      padding: "14px 28px",
      borderRadius: "10px",
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
    backgroundColor: "#050505",
    color: "#FFFFFF",
    fontFamily: "Inter",
    padding: "120px 76px 130px 76px",
    boxSizing: "border-box"
  }, [topHeader, centerContent, footer]);
}

function buildTypewriterTree(data, typedCode, progressRatio) {
  const headline = data.slides?.[0]?.headline || data.topic;
  const subbody = data.slides?.[2]?.body || data.slides?.[0]?.body || "";
  const fileName = data.slides?.[2]?.file_name || "refactor.ts";
  const takeaway = data.slides?.[2]?.key_takeaway || "Clean Architecture & Scalable Performance";

  return h("div", {
    width: "1080px",
    height: "1920px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#050505",
    color: "#FFFFFF",
    fontFamily: "Inter",
    padding: "120px 76px 130px 76px",
    boxSizing: "border-box"
  }, [
    // Header
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        width: "100%",
        height: "6px",
        backgroundColor: "#1F1F23",
        borderRadius: "99px",
        marginBottom: "42px"
      }, [
        h("div", {
          width: `${Math.max(5, Math.round(progressRatio * 100))}%`,
          height: "6px",
          backgroundColor: "#FFFFFF",
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
            backgroundColor: "#FFFFFF",
            color: "#050505",
            padding: "10px 24px",
            borderRadius: "8px",
            fontFamily: "JetBrains Mono",
            fontSize: "22px",
            fontWeight: 700,
            marginRight: "16px"
          }, "LIVE REFACTOR"),
          h("div", {
            display: "flex",
            border: "1px solid #27272A",
            backgroundColor: "#0E0E11",
            color: "#A1A1AA",
            padding: "10px 20px",
            borderRadius: "8px",
            fontFamily: "JetBrains Mono",
            fontSize: "20px"
          }, String(data.slides?.[0]?.tag || "#OSCS"))
        ]),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "24px",
          color: "#71717A"
        }, `${Math.round(progressRatio * 100)}%`)
      ])
    ]),

    // Middle Hook + Line-Numbered Live IDE
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        fontSize: "60px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.03em",
        color: "#FFFFFF",
        marginBottom: "24px"
      }, String(headline)),
      h("div", {
        display: "flex",
        fontSize: "34px",
        lineHeight: 1.48,
        color: "#A1A1AA",
        marginBottom: "44px"
      }, String(subbody)),

      renderCodeWindow(typedCode, fileName, "LIVE SESSION", "640px"),

      h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "30px",
        backgroundColor: "#121215",
        border: "1px solid #27272A",
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
          color: "#FFFFFF",
          marginRight: "16px"
        }, "✦ OUTCOME:"),
        h("div", {
          display: "flex",
          fontSize: "26px",
          fontWeight: 600,
          color: "#E4E4E7",
          flex: 1
        }, String(takeaway))
      ])
    ]),

    // Footer
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      borderTop: "1px solid #222225",
      paddingTop: "36px"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "58px",
          height: "58px",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          color: "#050505",
          fontFamily: "JetBrains Mono",
          fontSize: "26px",
          fontWeight: 700,
          marginRight: "20px"
        }, "DC"),
        h("div", { display: "flex", flexDirection: "column" }, [
          h("div", { display: "flex", fontSize: "28px", fontWeight: 700, color: "#FFFFFF" }, "@draftcoding.id"),
          h("div", { display: "flex", fontFamily: "JetBrains Mono", fontSize: "20px", color: "#71717A" }, "WEB • ANDROID • UI/UX • ARDUINO")
        ])
      ]),
      h("div", {
        display: "flex",
        backgroundColor: "#FFFFFF",
        color: "#050505",
        padding: "14px 28px",
        borderRadius: "10px",
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

  if (videoMode === "all" || videoMode === "a") {
    fs.mkdirSync("/tmp/reels_a", { recursive: true });
    for (let i = 0; i < data.slides.length; i++) {
      const slide = { ...data.slides[i], slide_num: i + 1 };
      const tree = buildReelsSlideTree(slide, data.slides.length);
      await renderTreeToPngFile(tree, fonts, `/tmp/reels_a/slide_${i}.png`);
    }

    execSync(
      `ffmpeg -y ` +
      `-loop 1 -t 3.5 -i /tmp/reels_a/slide_0.png ` +
      `-loop 1 -t 3.5 -i /tmp/reels_a/slide_1.png ` +
      `-loop 1 -t 3.5 -i /tmp/reels_a/slide_2.png ` +
      `-loop 1 -t 3.5 -i /tmp/reels_a/slide_3.png ` +
      `-f lavfi -t 12.8 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
      `-filter_complex "` +
      `[0:v][1:v]xfade=transition=fade:duration=0.4:offset=3.1[v01];` +
      `[v01][2:v]xfade=transition=fade:duration=0.4:offset=6.2[v02];` +
      `[v02][3:v]xfade=transition=fade:duration=0.4:offset=9.3,format=yuv420p[vout]" ` +
      `-map "[vout]" -map 4:a -c:v libx264 -preset fast -crf 18 -r 30 -c:a aac -shortest /tmp/reels_format_A.mp4`,
      { stdio: "inherit" }
    );

    await sendTelegramVideo(
      botToken,
      chatId,
      "/tmp/reels_format_A.mp4",
      `🎬 REELS FORMAT A — ${data.topic} (1080x1920)`
    );
  }

  if (videoMode === "all" || videoMode === "b") {
    fs.mkdirSync("/tmp/reels_b", { recursive: true });
    const fullCode = [
      `// ❌ BEFORE (${data.slides[1]?.file_name || "legacy.ts"})`,
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
      const typedSlice = fullCode.slice(0, charCount) + (showCursor ? "█" : " ");
      const totalProgress = (f + 1) / (totalTypingFrames + totalHoldFrames);
      const tree = buildTypewriterTree(data, typedSlice, totalProgress);
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
      `⌨️ REELS FORMAT B — ${data.topic} (1080x1920)`
    );
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
