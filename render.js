import fs from "fs";
import { execSync } from "child_process";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const h = (type, style, children) => ({ type, props: { style, children } });

async function loadFonts() {
  const [interReg, interBold, monoMed] = await Promise.all([
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-500-normal.woff").then(r => r.arrayBuffer())
  ]);
  return [
    { name: "Inter", data: interReg, weight: 400, style: "normal" },
    { name: "Inter", data: interBold, weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: monoMed, weight: 500, style: "normal" }
  ];
}

function buildReelsSlideTree(slide, totalSlides = 4) {
  const slideNum = slide.slide_num || 1;
  const segments = [];
  for (let i = 1; i <= totalSlides; i++) {
    segments.push(
      h("div", {
        flex: 1,
        height: "8px",
        borderRadius: "99px",
        backgroundColor: i <= slideNum ? "#FFFFFF" : "#27272A",
        marginRight: i < totalSlides ? "14px" : "0px"
      }, "")
    );
  }

  return h("div", {
    width: "1080px",
    height: "1920px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#09090B",
    color: "#FFFFFF",
    fontFamily: "Inter",
    padding: "130px 80px 140px 80px",
    boxSizing: "border-box"
  }, [
    // Top section: Segmented progress + Editorial Pill
    h("div", {
      display: "flex",
      flexDirection: "column",
      width: "100%"
    }, [
      h("div", {
        display: "flex",
        width: "100%",
        marginBottom: "48px"
      }, segments),
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
      }, [
        h("div", {
          display: "flex",
          backgroundColor: "#FFFFFF",
          color: "#09090B",
          padding: "14px 32px",
          borderRadius: "999px",
          fontSize: "26px",
          fontWeight: 700
        }, String(slide.tag || "#OSCS • @draftcoding.id").toUpperCase()),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "88px",
          fontWeight: 700,
          color: "#27272A"
        }, `0${slideNum}`)
      ])
    ]),

    // Center Content Card
    h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#121215",
      border: "2px solid #27272A",
      borderRadius: "36px",
      padding: "64px",
      width: "100%"
    }, [
      h("div", {
        display: "flex",
        fontSize: "68px",
        fontWeight: 700,
        lineHeight: 1.15,
        color: "#FFFFFF",
        marginBottom: "36px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontSize: "40px",
        fontWeight: 400,
        lineHeight: 1.5,
        color: "#A1A1AA",
        marginBottom: slide.code ? "48px" : "0px"
      }, String(slide.body || "")),
      slide.code ? h("div", {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#09090B",
        border: "2px solid #3F3F46",
        borderRadius: "24px",
        padding: "36px",
        width: "100%"
      }, [
        h("div", {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #27272A",
          paddingBottom: "20px",
          marginBottom: "24px",
          width: "100%"
        }, [
          h("div", { display: "flex", alignItems: "center" }, [
            h("div", { width: "18px", height: "18px", borderRadius: "99px", backgroundColor: "#FFFFFF", marginRight: "12px" }, ""),
            h("div", { width: "18px", height: "18px", borderRadius: "99px", backgroundColor: "#71717A", marginRight: "12px" }, ""),
            h("div", { width: "18px", height: "18px", borderRadius: "99px", backgroundColor: "#3F3F46" }, "")
          ]),
          h("div", {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "22px",
            color: "#71717A"
          }, "draftcoding.ts")
        ]),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "30px",
          lineHeight: 1.6,
          color: "#F4F4F5",
          whiteSpace: "pre-wrap"
        }, String(slide.code))
      ]) : null
    ].filter(Boolean)),

    // Footer Signature
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      borderTop: "2px solid #27272A",
      paddingTop: "40px"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          color: "#09090B",
          fontSize: "28px",
          fontWeight: 700,
          marginRight: "20px"
        }, "DC"),
        h("div", { display: "flex", flexDirection: "column" }, [
          h("div", { display: "flex", fontSize: "30px", fontWeight: 700, color: "#FFFFFF" }, "@draftcoding.id"),
          h("div", { display: "flex", fontSize: "22px", color: "#71717A" }, "Website • Android • UI/UX • Arduino")
        ])
      ]),
      h("div", {
        display: "flex",
        border: "2px solid #FFFFFF",
        color: "#FFFFFF",
        padding: "14px 28px",
        borderRadius: "999px",
        fontSize: "24px",
        fontWeight: 700
      }, slideNum === totalSlides ? "DM KAMI ✦" : "NEXT ➔")
    ])
  ]);
}

function buildTypewriterTree(topic, headline, subbody, typedCode, progressRatio) {
  return h("div", {
    width: "1080px",
    height: "1920px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#09090B",
    color: "#FFFFFF",
    fontFamily: "Inter",
    padding: "130px 80px 140px 80px",
    boxSizing: "border-box"
  }, [
    // Header
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        width: "100%",
        height: "8px",
        backgroundColor: "#27272A",
        borderRadius: "99px",
        marginBottom: "48px"
      }, [
        h("div", {
          width: `${Math.max(5, Math.round(progressRatio * 100))}%`,
          height: "8px",
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
        h("div", {
          display: "flex",
          backgroundColor: "#FFFFFF",
          color: "#09090B",
          padding: "14px 32px",
          borderRadius: "999px",
          fontSize: "24px",
          fontWeight: 700
        }, "LIVE CODE // @DRAFTCODING.ID"),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "26px",
          color: "#A1A1AA"
        }, "#OSCS")
      ])
    ]),

    // Middle Hook + Terminal
    h("div", { display: "flex", flexDirection: "column", width: "100%" }, [
      h("div", {
        display: "flex",
        fontSize: "64px",
        fontWeight: 700,
        lineHeight: 1.18,
        color: "#FFFFFF",
        marginBottom: "28px"
      }, String(headline)),
      h("div", {
        display: "flex",
        fontSize: "36px",
        lineHeight: 1.45,
        color: "#A1A1AA",
        marginBottom: "48px"
      }, String(subbody)),

      // Monochrome Terminal Box
      h("div", {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#121215",
        border: "2px solid #FFFFFF",
        borderRadius: "28px",
        padding: "44px",
        width: "100%",
        minHeight: "640px"
      }, [
        h("div", {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #27272A",
          paddingBottom: "24px",
          marginBottom: "32px",
          width: "100%"
        }, [
          h("div", { display: "flex", alignItems: "center" }, [
            h("div", { width: "20px", height: "20px", borderRadius: "99px", backgroundColor: "#FFFFFF", marginRight: "14px" }, ""),
            h("div", { width: "20px", height: "20px", borderRadius: "99px", backgroundColor: "#71717A", marginRight: "14px" }, ""),
            h("div", { width: "20px", height: "20px", borderRadius: "99px", backgroundColor: "#3F3F46" }, "")
          ]),
          h("div", {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "24px",
            color: "#A1A1AA"
          }, "solution.ts — bash")
        ]),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "32px",
          lineHeight: 1.65,
          color: "#FFFFFF",
          whiteSpace: "pre-wrap"
        }, typedCode)
      ])
    ]),

    // Footer
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      borderTop: "2px solid #27272A",
      paddingTop: "40px"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          color: "#09090B",
          fontSize: "28px",
          fontWeight: 700,
          marginRight: "20px"
        }, "DC"),
        h("div", { display: "flex", flexDirection: "column" }, [
          h("div", { display: "flex", fontSize: "30px", fontWeight: 700, color: "#FFFFFF" }, "@draftcoding.id"),
          h("div", { display: "flex", fontSize: "22px", color: "#71717A" }, "Serving 100+ Clients • Konsultasi Gratis")
        ])
      ]),
      h("div", {
        display: "flex",
        backgroundColor: "#FFFFFF",
        color: "#09090B",
        padding: "14px 28px",
        borderRadius: "999px",
        fontSize: "24px",
        fontWeight: 700
      }, "DM SEKARANG ✦")
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
      `-loop 1 -t 3.4 -i /tmp/reels_a/slide_0.png ` +
      `-loop 1 -t 3.4 -i /tmp/reels_a/slide_1.png ` +
      `-loop 1 -t 3.4 -i /tmp/reels_a/slide_2.png ` +
      `-loop 1 -t 3.4 -i /tmp/reels_a/slide_3.png ` +
      `-f lavfi -t 12.4 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
      `-filter_complex "` +
      `[0:v][1:v]xfade=transition=fade:duration=0.4:offset=3.0[v01];` +
      `[v01][2:v]xfade=transition=fade:duration=0.4:offset=6.0[v02];` +
      `[v02][3:v]xfade=transition=fade:duration=0.4:offset=9.0,format=yuv420p[vout]" ` +
      `-map "[vout]" -map 4:a -c:v libx264 -preset fast -crf 20 -r 30 -c:a aac -shortest /tmp/reels_format_A.mp4`,
      { stdio: "inherit" }
    );

    await sendTelegramVideo(
      botToken,
      chatId,
      "/tmp/reels_format_A.mp4",
      `🎬 REELS FORMAT A (Slide Transition 1080x1920)\nTopik: ${data.topic}`
    );
  }

  if (videoMode === "all" || videoMode === "b") {
    fs.mkdirSync("/tmp/reels_b", { recursive: true });
    const fullCode = [
      `// Topik: ${data.topic}`,
      String(data.slides[1]?.code || "// Masalah umum:"),
      "",
      String(data.slides[2]?.code || "// Solusi @draftcoding.id:"),
      "",
      "// Butuh Website / Android / UI-UX / Arduino?",
      "// DM @draftcoding.id sekarang!"
    ].join("\n");

    const totalTypingFrames = 36;
    const totalHoldFrames = 14;
    for (let f = 0; f < totalTypingFrames + totalHoldFrames; f++) {
      const ratio = Math.min(1, (f + 1) / totalTypingFrames);
      const charCount = Math.floor(fullCode.length * ratio);
      const showCursor = f % 2 === 0;
      const typedSlice = fullCode.slice(0, charCount) + (showCursor ? " █" : "  ");
      const totalProgress = (f + 1) / (totalTypingFrames + totalHoldFrames);
      const tree = buildTypewriterTree(
        data.topic,
        data.slides[0]?.headline || data.topic,
        data.slides[2]?.body || data.slides[0]?.body || "",
        typedSlice,
        totalProgress
      );
      const frameIndex = String(f).padStart(3, "0");
      await renderTreeToPngFile(tree, fonts, `/tmp/reels_b/frame_${frameIndex}.png`);
    }

    execSync(
      `ffmpeg -y -framerate 5 -i /tmp/reels_b/frame_%03d.png ` +
      `-f lavfi -t 10 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
      `-c:v libx264 -preset fast -crf 20 -r 30 -pix_fmt yuv420p -c:a aac -shortest /tmp/reels_format_B.mp4`,
      { stdio: "inherit" }
    );

    await sendTelegramVideo(
      botToken,
      chatId,
      "/tmp/reels_format_B.mp4",
      `⌨️ REELS FORMAT B (Typewriter Live Code 1080x1920)\nTopik: ${data.topic}`
    );
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
