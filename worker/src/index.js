import satori from "@cf-wasm/satori";
import { Resvg } from "@cf-wasm/resvg";
import { neon } from "@neondatabase/serverless";

const PILLARS = [
  "Architecture & Web Performance (Kenapa website bisnis lambat, boros server, atau gagal konversi beserta solusi engineering-nya)",
  "UI/UX Design System & Frontend Engineering (Gap antara desain Figma vs hasil kodingan production, micro-interactions, dan aksesibilitas)",
  "Mobile Android & Scalable Backend (Arsitektur aplikasi Android modern, API security, state management, dan offline-first)",
  "IoT & Embedded Systems / Arduino (Otomasi industri/kampus/bisnis dengan ESP32/Arduino, optimasi sensor, dan integrasi dashboard real-time)",
  "Realita Software Agency & Engineering Culture (Cara @draftcoding.id menangani tech debt, estimasi proyek, dan menyelamatkan proyek mangkrak)"
];

let fontCache = null;
async function loadFonts() {
  if (fontCache) return fontCache;
  const [interReg, interSemi, interBold, monoReg, monoBold] = await Promise.all([
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-600-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-400-normal.woff").then(r => r.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.8/files/jetbrains-mono-latin-700-normal.woff").then(r => r.arrayBuffer())
  ]);
  fontCache = [
    { name: "Inter", data: interReg, weight: 400, style: "normal" },
    { name: "Inter", data: interSemi, weight: 600, style: "normal" },
    { name: "Inter", data: interBold, weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: monoReg, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" }
  ];
  return fontCache;
}

const h = (type, style, children) => ({ type, props: { style, children } });

function renderCodeWindow(codeStr, fileName = "solution.ts", statusLabel = "PRODUCTION") {
  const rawLines = String(codeStr || "").split("\n").slice(0, 7);
  const codeRows = rawLines.map((line, idx) => {
    const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
    return h("div", {
      display: "flex",
      alignItems: "flex-start",
      width: "100%",
      marginBottom: idx < rawLines.length - 1 ? "10px" : "0px"
    }, [
      h("div", {
        display: "flex",
        width: "44px",
        fontFamily: "JetBrains Mono",
        fontSize: "22px",
        color: "#52525B",
        flexShrink: 0
      }, String(idx + 1).padStart(2, "0")),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "24px",
        fontWeight: isComment ? 400 : 700,
        color: isComment ? "#71717A" : "#F4F4F5",
        lineHeight: 1.45,
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
    borderRadius: "20px",
    width: "100%",
    overflow: "hidden"
  }, [
    // Terminal Header Bar
    h("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#0E0E11",
      borderBottom: "1px solid #222225",
      padding: "18px 28px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", { display: "flex", alignItems: "center" }, [
        h("div", { width: "12px", height: "12px", borderRadius: "99px", backgroundColor: "#FFFFFF", marginRight: "8px" }, ""),
        h("div", { width: "12px", height: "12px", borderRadius: "99px", backgroundColor: "#52525B", marginRight: "8px" }, ""),
        h("div", { width: "12px", height: "12px", borderRadius: "99px", backgroundColor: "#27272A", marginRight: "18px" }, ""),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700,
          color: "#D4D4D8"
        }, String(fileName || "draftcoding.ts"))
      ]),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "17px",
        fontWeight: 700,
        color: "#A1A1AA",
        backgroundColor: "#18181B",
        border: "1px solid #27272A",
        padding: "4px 12px",
        borderRadius: "6px"
      }, String(statusLabel))
    ]),
    // Code Lines Body
    h("div", {
      display: "flex",
      flexDirection: "column",
      padding: "28px 30px",
      width: "100%",
      boxSizing: "border-box"
    }, codeRows)
  ]);
}

async function renderSlidePng(slide, totalSlides = 4) {
  const fonts = await loadFonts();
  const slideNum = slide.slide_num || 1;

  // Segmented Top Progress Bar
  const segments = [];
  for (let i = 1; i <= totalSlides; i++) {
    segments.push(
      h("div", {
        flex: 1,
        height: "6px",
        borderRadius: "99px",
        backgroundColor: i <= slideNum ? "#FFFFFF" : "#1F1F23",
        marginRight: i < totalSlides ? "12px" : "0px"
      }, "")
    );
  }

  // Top Header
  const topHeader = h("div", {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, [
    h("div", {
      display: "flex",
      width: "100%",
      marginBottom: "32px"
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
          padding: "8px 20px",
          borderRadius: "6px",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700,
          marginRight: "14px"
        }, String(slide.tag || "#OSCS").toUpperCase()),
        h("div", {
          display: "flex",
          border: "1px solid #27272A",
          backgroundColor: "#0E0E11",
          color: "#A1A1AA",
          padding: "8px 18px",
          borderRadius: "6px",
          fontFamily: "JetBrains Mono",
          fontSize: "19px"
        }, slideNum === 1 ? "EDITORIAL BRIEF" : slideNum === 2 ? "ROOT CAUSE" : slideNum === 3 ? "ARCHITECTURE" : "ENGINEERING PARTNER")
      ]),
      h("div", {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: "24px",
        fontWeight: 700,
        color: "#71717A"
      }, `0${slideNum} / 0${totalSlides}`)
    ])
  ]);

  // Center Body varies by slide role for authentic designer layout
  let centerContent;

  if (slideNum === 1) {
    // SLIDE 1: High-Impact Editorial Cover
    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
      flex: 1,
      padding: "24px 0px"
    }, [
      h("div", {
        display: "flex",
        fontSize: "66px",
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: "-0.03em",
        color: "#FFFFFF",
        marginBottom: "32px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        borderLeft: "4px solid #FFFFFF",
        paddingLeft: "28px",
        fontSize: "34px",
        fontWeight: 400,
        lineHeight: 1.48,
        color: "#A1A1AA",
        marginBottom: "42px"
      }, String(slide.body || "")),
      slide.code ? renderCodeWindow(slide.code, slide.file_name || "overview.ts", "INSIGHT") : null,
      slide.key_takeaway ? h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "24px",
        backgroundColor: "#121215",
        border: "1px solid #27272A",
        borderRadius: "12px",
        padding: "18px 24px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginRight: "14px"
        }, "✦ FOCUS:"),
        h("div", {
          display: "flex",
          fontSize: "24px",
          color: "#D4D4D8",
          flex: 1
        }, String(slide.key_takeaway))
      ]) : null
    ].filter(Boolean));
  } else if (slideNum === 4 && Array.isArray(slide.deliverables) && slide.deliverables.length > 0) {
    // SLIDE 4: Executive Agency Spec & Deliverables Card
    const items = slide.deliverables.slice(0, 4).map(item =>
      h("div", {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#09090B",
        border: "1px solid #27272A",
        borderRadius: "14px",
        padding: "20px 24px",
        marginBottom: "14px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "34px",
          height: "34px",
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          color: "#050505",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700,
          marginRight: "18px",
          flexShrink: 0
        }, "✓"),
        h("div", {
          display: "flex",
          fontSize: "27px",
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
      borderRadius: "24px",
      padding: "48px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        fontSize: "52px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        color: "#FFFFFF",
        marginBottom: "20px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontSize: "30px",
        lineHeight: 1.45,
        color: "#A1A1AA",
        marginBottom: "34px"
      }, String(slide.body || "")),
      h("div", {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "20px"
      }, items),
      h("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        color: "#050505",
        borderRadius: "14px",
        padding: "20px 28px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700
        }, "WEB • ANDROID • UI/UX • ARDUINO"),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "22px",
          fontWeight: 700
        }, "FREE CONSULTATION →")
      ])
    ]);
  } else {
    // SLIDE 2 & 3: Problem Breakdown & Engineering Architecture
    centerContent = h("div", {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0C0C0F",
      border: "1px solid #252529",
      borderRadius: "24px",
      padding: "48px",
      width: "100%",
      boxSizing: "border-box"
    }, [
      h("div", {
        display: "flex",
        fontSize: "54px",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        color: "#FFFFFF",
        marginBottom: "22px"
      }, String(slide.headline || "")),
      h("div", {
        display: "flex",
        fontSize: "32px",
        fontWeight: 400,
        lineHeight: 1.5,
        color: "#A1A1AA",
        marginBottom: "36px"
      }, String(slide.body || "")),
      slide.code ? renderCodeWindow(
        slide.code,
        slide.file_name || (slideNum === 2 ? "bottleneck.ts" : "optimized.ts"),
        slideNum === 2 ? "BOTTLENECK" : "CLEAN CODE"
      ) : null,
      slide.key_takeaway ? h("div", {
        display: "flex",
        alignItems: "center",
        marginTop: "28px",
        backgroundColor: "#141418",
        border: "1px solid #2E2E34",
        borderRadius: "12px",
        padding: "18px 24px",
        width: "100%",
        boxSizing: "border-box"
      }, [
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "20px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginRight: "14px"
        }, slideNum === 2 ? "⚠ IMPACT:" : "✓ RESULT:"),
        h("div", {
          display: "flex",
          fontSize: "24px",
          fontWeight: 600,
          color: "#E4E4E7",
          flex: 1
        }, String(slide.key_takeaway))
      ]) : null
    ].filter(Boolean));
  }

  // Bottom Footer
  const footer = h("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderTop: "1px solid #222225",
    paddingTop: "28px"
  }, [
    h("div", { display: "flex", alignItems: "center" }, [
      h("div", {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "52px",
        height: "52px",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        color: "#050505",
        fontFamily: "JetBrains Mono",
        fontSize: "24px",
        fontWeight: 700,
        marginRight: "18px"
      }, "DC"),
      h("div", { display: "flex", flexDirection: "column" }, [
        h("div", {
          display: "flex",
          fontSize: "26px",
          fontWeight: 700,
          color: "#FFFFFF"
        }, "@draftcoding.id"),
        h("div", {
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "18px",
          color: "#71717A"
        }, "SOFTWARE & IOT AGENCY  •  #OSCS")
      ])
    ]),
    h("div", {
      display: "flex",
      backgroundColor: slideNum === totalSlides ? "#FFFFFF" : "#121215",
      color: slideNum === totalSlides ? "#050505" : "#FFFFFF",
      border: "1px solid #FFFFFF",
      padding: "12px 24px",
      borderRadius: "8px",
      fontFamily: "JetBrains Mono",
      fontSize: "20px",
      fontWeight: 700
    }, slideNum === totalSlides ? "DM @DRAFTCODING.ID ↗" : "SWIPE →")
  ]);

  const tree = h("div", {
    width: "1080px",
    height: "1350px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#050505",
    color: "#FFFFFF",
    fontFamily: "Inter",
    padding: "64px",
    border: "1px solid #1F1F23",
    boxSizing: "border-box"
  }, [topHeader, centerContent, footer]);

  const svg = await satori(tree, { width: 1080, height: 1350, fonts });
  const resvg = await Resvg.async(svg, { fitTo: { mode: "width", value: 1080 } });
  return resvg.render().asPng();
}

async function triggerGithubReels(env, chatId, data, videoMode = "all") {
  if (!env.GITHUB_TOKEN) return false;
  const res = await fetch(
    "https://api.github.com/repos/Kuncups/draftcoding-video-renderer/actions/workflows/render.yml/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "draftcoding-content-bot",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ref: "main",
        inputs: {
          chat_id: String(chatId),
          video_mode: videoMode,
          data_json: JSON.stringify({
            topic: data.topic,
            slides: data.slides
          })
        }
      })
    }
  );
  return res.status === 204;
}

async function generateAndSend(env, customTopic = null, targetChatId = null, mode = "both") {
  const chatId = targetChatId || env.TELEGRAM_CHAT_ID;
  const sql = neon(env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS posts_history (
      id SERIAL PRIMARY KEY,
      topic TEXT NOT NULL,
      pillar TEXT,
      caption TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const recentRows = await sql`SELECT topic FROM posts_history ORDER BY id DESC LIMIT 25`;
  const recentTopics = recentRows.map(r => r.topic).join(" | ") || "Belum ada";
  const pillar = PILLARS[recentRows.length % PILLARS.length];

  const systemPrompt = `Anda adalah Principal Software Engineer & Creative Copywriter di @draftcoding.id, software agency di Indonesia yang mengerjakan Website, Desain UI/UX, Aplikasi Android, dan Proyek Arduino/IoT (#OSCS).

PRINSIP COPYWRITING & ANTI-SLOP (WAJIB DIPATUHI):
1. DILARANG KERAS menulis kalimat klise AI seperti: "Di era digital yang serba cepat", "Wujudkan ide digitalmu tanpa pusing", "Paragraf pembuka yang asik", "Jangan khawatir", "Solusi cerdas untuk bisnis Anda".
2. Gunakan bahasa engineer & desainer Indonesia yang tajam, konkret, kasual tapi berbobot (sapa audiens dengan "Drafter" atau "Gais").
3. Sebutkan metrik, skenario nyata, atau istilah teknis yang spesifik (misal: LCP > 4 detik, N+1 query, state bocor di React/Flutter, sensor DHT22/ESP32 delay, revisi layout Figma, konversi checkout drop).
4. Potongan kode ("code") HARUS berupa kode nyata yang bersih, singkat (4-5 baris), idiomatik (TypeScript, Kotlin, CSS, SQL, atau C++ Arduino), BUKAN kalimat deskripsi biasa.
5. Output HANYA raw JSON object yang valid tanpa markdown backticks.`;

  const userPrompt = `Buat 1 konten Carousel & Reels Instagram profesional (4 slide) untuk @draftcoding.id.
${customTopic ? `TOPIK KHUSUS YANG DIMINTA: "${customTopic}"` : `PILAR KONTEN HARI INI: "${pillar}"`}

Topik yang SUDAH PERNAH dibuat dan TIDAK BOLEH diulang: [${recentTopics}].

Kembalikan JSON valid dengan field berikut (isi dengan konten asli yang tajam & spesifik sesuai topik, JANGAN menyalin instruksi):
- "topic": string (judul topik spesifik, 3-6 kata)
- "slides": array berisi tepat 4 object slide:
  * Slide 1 (slide_num: 1):
    - "tag": string pendek (misal "WEB PERF", "UI/UX AUDIT", "ANDROID ARCH", "IOT SYSTEM", "AGENCY LIFE")
    - "headline": Hook tajam & spesifik (5-9 kata, langsung menohok masalah/fakta teknis)
    - "body": Penjelasan konteks masalah secara konkret dalam 2 kalimat padat.
    - "file_name": nama file relevan (misal "lighthouse-audit.ts", "checkout-flow.tsx", "esp32_ telemetry.ino")
    - "code": 4 baris kode nyata yang merepresentasikan topik tersebut
    - "key_takeaway": 1 kalimat kesimpulan pendek (maks 10 kata)
  * Slide 2 (slide_num: 2):
    - "tag": "ROOT CAUSE"
    - "headline": Penyebab teknis atau kesalahan arsitektur yang sering terjadi (5-8 kata)
    - "body": Bedah kenapa kesalahan ini bikin produk lambat, bug, atau klien boncos (2 kalimat konkret).
    - "file_name": nama file tempat bug/masalah terjadi (misal "bad-query.ts", "unoptimized.kt")
    - "code": 4-5 baris contoh kode anti-pattern / masalah nyata di lapangan
    - "key_takeaway": dampak buruknya secara terukur (misal "Response time bengkak 3.2 detik & user kabur")
  * Slide 3 (slide_num: 3):
    - "tag": "BEST PRACTICE"
    - "headline": Pendekatan engineering bersih yang dipakai tim @draftcoding.id (5-8 kata)
    - "body": Penjelasan teknis singkat bagaimana solusi ini menyelesaikan masalah di Slide 2 (2 kalimat).
    - "file_name": nama file solusi (misal "optimized-query.ts", "clean-arch.kt")
    - "code": 4-5 baris kode produksi yang rapi, modern, dan efisien
    - "key_takeaway": hasil peningkatannya secara terukur (misal "Latency turun 80%, kode mudah di-maintain")
  * Slide 4 (slide_num: 4):
    - "tag": "@DRAFTCODING.ID"
    - "headline": Ajakan kolaborasi spesifik sesuai topik di atas (5-8 kata, tidak generik)
    - "body": Bagaimana tim @draftcoding.id membantu Drafter mengeksekusi proyek ini dari nol sampai rilis tanpa drama.
    - "deliverables": array berisi tepat 4 string deliverable nyata yang relevan dengan topik (contoh: ["Arsitektur Clean Code & Scalable", "Desain UI/UX Figma Siap Koding", "Optimasi Performa & Keamanan API", "Full Source Code + Garansi Support"])
- "caption": string (Caption Instagram lengkap 3 paragraf:
  Paragraf 1: Cerita/observasi pembuka yang langsung nyambung dengan topik untuk para Drafter.
  Paragraf 2: 3 poin ringkasan teknis/bisnis menggunakan bullet "•".
  Paragraf 3: Penutup & ajakan konsultasi gratis di @draftcoding.id untuk pembuatan Website, UI/UX, Aplikasi Android, atau Arduino/IoT, diikuti baris baru berisi hashtag relevan + #draftcoding #oscs #softwareagency #developerindonesia)`;

  const aiRes = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  let data;
  if (aiRes && typeof aiRes.response === "object" && aiRes.response !== null) {
    data = aiRes.response;
  } else {
    const rawText = typeof aiRes === "string" ? aiRes : String(aiRes?.response || JSON.stringify(aiRes));
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gagal parse JSON dari AI: " + rawText.slice(0, 200));
    data = JSON.parse(jsonMatch[0]);
  }

  const wantImage = mode === "image" || mode === "both";
  const wantReels = mode === "both" || mode.startsWith("reels_");

  if (wantImage) {
    const dateStr = new Date().toISOString().slice(0, 10);
    const form = new FormData();
    form.append("chat_id", String(chatId));

    const media = [];
    for (let i = 0; i < data.slides.length; i++) {
      const slide = data.slides[i];
      slide.slide_num = i + 1;
      const pngBytes = await renderSlidePng(slide, data.slides.length);
      const fileKey = `file${i}`;
      const fileName = `${dateStr}_draftcoding_0${i + 1}.png`;
      form.append(fileKey, new Blob([pngBytes], { type: "image/png" }), fileName);
      media.push({
        type: "document",
        media: `attach://${fileKey}`,
        caption: i === data.slides.length - 1 ? `🖤🤍 ${data.topic} — 4 Slide Lossless PNG (1080x1350)` : undefined
      });
    }
    form.append("media", JSON.stringify(media));

    const tgDocRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMediaGroup`, {
      method: "POST",
      body: form
    }).then(r => r.json());

    if (!tgDocRes.ok) {
      throw new Error("Telegram sendMediaGroup error: " + JSON.stringify(tgDocRes));
    }
  }

  let reelsNote = "";
  let reelsTriggered = false;
  if (wantReels) {
    const videoMode = mode === "reels_a" ? "a" : mode === "reels_b" ? "b" : "all";
    reelsTriggered = await triggerGithubReels(env, chatId, data, videoMode);
    const label = videoMode === "a" ? "Video Reels Format A" : videoMode === "b" ? "Video Reels Format B" : "2 Video Reels (Format A & B)";
    reelsNote = `\n\n🎬 [Sedang merender ${label} 1080x1920, masuk dalam ~35 detik...]`;
  }

  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: String(chatId),
      text: `📝 CAPTION INSTAGRAM (${data.topic}):\n\n${data.caption}${reelsNote}`
    })
  });

  await sql`
    INSERT INTO posts_history (topic, pillar, caption)
    VALUES (${data.topic}, ${customTopic ? "Custom" : pillar}, ${data.caption})
  `;

  return { ok: true, topic: data.topic, mode, reelsTriggered };
}

async function sendSelectionMenu(env, chatId, customTopic = null) {
  const topicLabel = customTopic ? `\n📌 Topik: *${customTopic}*` : "\n📌 Topik: *Otomatis (Sesuai Pilar Editorial)*";
  const tParam = customTopic ? customTopic.slice(0, 42) : "";

  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      parse_mode: "Markdown",
      text: `🖤🤍 *Studio Konten @draftcoding.id*${topicLabel}\n\nPilih format konten yang ingin diproduksi:`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🖼️ Gambar Carousel Saja (4 PNG)", callback_data: `gen|image|${tParam}` }
          ],
          [
            { text: "🎬 Reels A (Slide)", callback_data: `gen|reels_a|${tParam}` },
            { text: "⌨️ Reels B (Live Code)", callback_data: `gen|reels_b|${tParam}` }
          ],
          [
            { text: "🎥 Kedua Video Reels Saja (A & B)", callback_data: `gen|reels_all|${tParam}` }
          ],
          [
            { text: "🔥 Paket Lengkap (Gambar + Semua Reels)", callback_data: `gen|both|${tParam}` }
          ]
        ]
      }
    })
  });
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(generateAndSend(env, null, null, "both"));
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/trigger") {
      try {
        const topic = url.searchParams.get("topic") || null;
        const mode = url.searchParams.get("mode") || "both";
        const res = await generateAndSend(env, topic, null, mode);
        return Response.json(res);
      } catch (err) {
        return Response.json({ ok: false, error: err.message, stack: err.stack }, { status: 500 });
      }
    }

    if (request.method === "POST" && url.pathname === "/webhook") {
      const update = await request.json();

      if (update.callback_query) {
        const cb = update.callback_query;
        const chatId = cb.message.chat.id;
        const [, mode, customTopic] = (cb.data || "").split("|");

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: cb.id,
            text: "Diproses..."
          })
        });

        const modeNames = {
          image: "🖼️ 4 Slide Gambar PNG",
          reels_a: "🎬 Video Reels Format A (Slide)",
          reels_b: "⌨️ Video Reels Format B (Live Code)",
          reels_all: "🎥 2 Video Reels (Format A & B)",
          both: "🔥 Paket Lengkap (4 Slide PNG + 2 Video Reels)"
        };

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `⏳ Meracik ${modeNames[mode] || "konten"}${customTopic ? ` — "${customTopic}"` : ""}...`
          })
        });

        ctx.waitUntil(
          generateAndSend(env, customTopic || null, chatId, mode || "both").catch(async err => {
            await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, text: "❌ Error: " + err.message })
            });
          })
        );
        return Response.json({ ok: true });
      }

      const msg = update.message;
      if (!msg || !msg.text) return Response.json({ ok: true });

      const chatId = msg.chat.id;
      const text = msg.text.trim();

      if (text === "/start" || text === "/menu" || text === "/generate") {
        await sendSelectionMenu(env, chatId, null);
        return Response.json({ ok: true });
      }

      if (text.startsWith("/buat")) {
        const customTopic = text.replace(/^\/buat\s*/i, "").trim() || null;
        await sendSelectionMenu(env, chatId, customTopic);
        return Response.json({ ok: true });
      }

      const directMatch = text.match(/^\/(gambar|reelsa|reelsb|reels|semua)(?:\s+(.*))?$/i);
      if (directMatch) {
        const cmd = directMatch[1].toLowerCase();
        const customTopic = (directMatch[2] || "").trim() || null;
        const modeMap = {
          gambar: "image",
          reels: "reels_all",
          reelsa: "reels_a",
          reelsb: "reels_b",
          semua: "both"
        };
        const chosenMode = modeMap[cmd];

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `⏳ Memproses /${cmd}${customTopic ? ` (${customTopic})` : ""}...`
          })
        });

        ctx.waitUntil(
          generateAndSend(env, customTopic, chatId, chosenMode).catch(async err => {
            await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, text: "❌ Error: " + err.message })
            });
          })
        );
        return Response.json({ ok: true });
      }

      if (!text.startsWith("/")) {
        await sendSelectionMenu(env, chatId, text);
        return Response.json({ ok: true });
      }

      return Response.json({ ok: true });
    }

    return new Response("Draftcoding.id Studio Bot Active 🚀", { status: 200 });
  }
};
