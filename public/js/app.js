/* ============================================================
   ASSETS — รูปทั้งหมดอยู่ที่นี่ที่เดียว
   ตอนนี้เป็นรูปจากไฟล์ซิปที่ฝังเป็น data URI
   อยากเปลี่ยนเป็นไฟล์จริง ให้แทนค่าด้วย path/URL ได้เลย เช่น  bowl: 'img/Empty_Bowl.png'
   *Food = ภาพวัตถุดิบที่ตัดเฉพาะส่วนอาหาร (ไม่มีถาด) ใช้ตอนวางในชาม
   ============================================================ */

/* ============================================================
   ข้อมูลเมนู — ปรับตำแหน่ง/ชื่อ/สีได้ตรงนี้
   ============================================================ */
// น้ำซุป (เลือกได้หลายชนิด — ในหม้อจะแบ่งเป็นช่องตามจำนวนซุปที่เลือก)
const SOUPS = [
  { id: "red", img: "soupRed", th: "ซุปหม่าล่า<br>แดงเสฉวน", x: 45, y: 197 },
  {
    id: "white",
    img: "soupWhite",
    th: "ซุปหม่าล่าขาว<br>ออริจินัล",
    x: 45,
    y: 432,
  },
  { id: "bone", img: "soupBone", th: "ซุปกระดูกหมู", x: 45, y: 667 },
  { id: "shabu", img: "soupShabu", th: "ซุปชาบูดำ", x: 45, y: 0 },
  { id: "milk", img: "soupMilk", th: "ซุปหม่าล่าน้ำนม", x: 45, y: 0 },
];
/* ============================================================
   SOUP FX — ผิวน้ำซุปวาดสดด้วย canvas (ไม่ใช้รูปถ่าย) แล้วใช้เป็นพื้นผิวในชาม/หม้อ
   สูตรแต่ละซุปอยู่ใน SOUP_FX: base=สีกลาง/สีขอบ · haze=ความขุ่น [r,g,b,a] · slick=คราบน้ำมัน
   items = ของลอย (flake พริกป่น, pod พริกแห้ง, pepper พริกไทยเสฉวน, drop หยดน้ำมัน, scallion ต้นหอม, sesame งา, herb สมุนไพร, goji เก๋ากี้)
   n=จำนวน s=[เล็กสุด,ใหญ่สุด] c=สี · gloss=ความมันเงา · seed=ค่าสุ่ม (เปลี่ยนแล้วลายเปลี่ยน)
   ซุปใหม่: เพิ่มสูตรใน SOUP_FX ตาม id ถ้าไม่มีสูตรจะใช้รูปถ่ายแทนอัตโนมัติ
   ============================================================ */
const SOUP_FX = {
  red: {
    seed: 11,
    base: ["#701a0d", "#260504"],
    haze: [
      [160, 34, 16, 0.2],
      [28, 4, 3, 0.25],
      [220, 80, 30, 0.1],
    ],
    hazeN: 60,
    slick: [255, 80, 30, 0.2],
    gloss: 0.3,
    items: [
      { t: "drop", n: 34, s: [7, 17], c: [255, 120, 40, 0.5] },
      { t: "pod", n: 9, s: [46, 70], c: "#a31f12" },
      {
        t: "flake",
        n: 230,
        s: [5, 11],
        c: ["#c0281b", "#8a170d", "#d9441f", "#5e0e08"],
      },
      { t: "pepper", n: 34, s: [6, 9] },
      { t: "sesame", n: 40 },
    ],
  },
  white: {
    seed: 23,
    base: ["#ecd3aa", "#b78b5e"],
    haze: [
      [255, 242, 214, 0.28],
      [170, 120, 70, 0.2],
    ],
    hazeN: 55,
    slick: [232, 92, 30, 0.24],
    gloss: 0.3,
    items: [
      { t: "drop", n: 62, s: [6, 15], c: [215, 85, 25, 0.55] },
      { t: "flake", n: 90, s: [4, 8], c: ["#d9531c", "#b83a14"] },
      { t: "pepper", n: 12, s: [5, 8] },
      { t: "sesame", n: 22 },
    ],
  },
  bone: {
    seed: 37,
    base: ["#f3ebd8", "#cbb893"],
    haze: [
      [255, 252, 242, 0.32],
      [200, 180, 140, 0.16],
    ],
    hazeN: 50,
    slick: [255, 238, 170, 0.2],
    gloss: 0.36,
    items: [{ t: "drop", n: 56, s: [8, 20], c: [255, 236, 170, 0.55] }],
  },
  shabu: {
    seed: 41,
    base: ["#2d190f", "#0a0403"],
    haze: [
      [96, 54, 26, 0.24],
      [0, 0, 0, 0.28],
    ],
    hazeN: 50,
    slick: [255, 170, 70, 0.14],
    gloss: 0.42,
    items: [{ t: "drop", n: 42, s: [6, 14], c: [210, 120, 40, 0.42] }],
  },
  milk: {
    seed: 53,
    base: ["#f1b48e", "#c0603a"],
    haze: [
      [255, 218, 188, 0.3],
      [170, 70, 35, 0.22],
    ],
    hazeN: 55,
    slick: [235, 70, 25, 0.32],
    gloss: 0.32,
    items: [
      { t: "drop", n: 34, s: [7, 16], c: [255, 110, 40, 0.5] },
      { t: "flake", n: 95, s: [4, 9], c: ["#c0281b", "#e0501f"] },
      { t: "pepper", n: 14, s: [5, 8] },
      { t: "scallion", n: 6, s: [7, 10] },
    ],
  },
};
SOUPS.forEach((d) => {
  d.fx = SOUP_FX[d.id];
});
const soupTexCache = {};
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/* ผสมสูตรซุปหลายชนิดเป็นซุปเดียว (ใช้ในหน้าผลลัพธ์): สีพื้นเฉลี่ย + หย่อมสีของแต่ละซุปแบบหินอ่อน + ความขุ่น/คราบมัน/ของลอยจากทุกซุป */
function mixSoup(ids) {
  const ds = ids.map((id) => SOUPS.find((s) => s.id === id));
  if (ds.some((d) => !d.fx)) return null;
  const k = ds.length,
    avgHex = (i) =>
      "#" +
      [0, 1, 2]
        .map((c) =>
          Math.round(ds.reduce((a, d) => a + hexRgb(d.fx.base[i])[c], 0) / k)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("");
  const sl = [0, 1, 2, 3]
    .map((c) => ds.reduce((a, d) => a + d.fx.slick[c], 0) / k)
    .map((v, i) => (i < 3 ? Math.round(v) : v));
  return {
    id: ids.join("+"),
    fx: {
      seed: ds.reduce((a, d) => a + d.fx.seed, 0),
      base: [avgHex(0), avgHex(1)],
      haze: ds.flatMap((d) => d.fx.haze),
      hazeN: Math.round((ds.reduce((a, d) => a + d.fx.hazeN, 0) / k) * 1.1),
      slick: sl,
      gloss: ds.reduce((a, d) => a + d.fx.gloss, 0) / k,
      marble: ds.map((d) => d.fx.base[0]),
      items: ds.flatMap((d) =>
        d.fx.items.map((it) => ({
          ...it,
          n: Math.max(2, Math.round((it.n / k) * 1.2)),
        })),
      ),
    },
  };
}
function soupTex(d) {
  if (soupTexCache[d.id]) return soupTexCache[d.id];
  const W = 800,
    H = 500,
    cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d"),
    fx = d.fx;
  let seed = fx.seed || 1;
  const R = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }; // สุ่มแบบกำหนดค่าตั้งต้น ได้ลายเดิมทุกครั้ง
  const rr = (a, b) => a + R() * (b - a),
    pick = (a) => a[Math.floor(R() * a.length)],
    TAU = Math.PI * 2;
  const pt = () => {
    const a = R() * TAU,
      r = Math.sqrt(R()) * 0.95;
    return [
      W / 2 + (Math.cos(a) * r * W) / 2,
      H / 2 + (Math.sin(a) * r * H) / 2,
    ];
  }; // จุดสุ่มในวงรี
  const rgba = (c, k = 1) => `rgba(${c[0]},${c[1]},${c[2]},${c[3] * k})`,
    clear = (c) => `rgba(${c[0]},${c[1]},${c[2]},0)`;
  // พื้นน้ำซุป
  let gr = g.createRadialGradient(
    W * 0.42,
    H * 0.4,
    10,
    W / 2,
    H / 2,
    W * 0.62,
  );
  gr.addColorStop(0, fx.base[0]);
  gr.addColorStop(1, fx.base[1]);
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  // ความขุ่น/ลายเมฆในน้ำซุป
  const blob = (x, y, r, ratio, c) => {
    g.save();
    g.translate(x, y);
    g.rotate(R() * 3);
    g.scale(1, ratio);
    const b = g.createRadialGradient(0, 0, 0, 0, 0, r);
    b.addColorStop(0, rgba(c));
    b.addColorStop(0.5, rgba(c, 0.45));
    b.addColorStop(1, clear(c));
    g.fillStyle = b;
    g.fillRect(-r, -r, r * 2, r * 2);
    g.restore();
  };
  (fx.marble || []).forEach((col) => {
    const c = hexRgb(col);
    for (let i = 0; i < 34; i++) {
      const [x, y] = pt();
      blob(x, y, rr(70, 180), rr(0.45, 0.9), [c[0], c[1], c[2], 0.5]);
    }
  }); // ซุปผสม: หย่อมสีของแต่ละซุปเกลี่ยเข้าหากัน
  for (let i = 0; i < fx.hazeN; i++) {
    const [x, y] = pt();
    blob(x, y, rr(50, 150), rr(0.55, 0.9), pick(fx.haze));
  }
  // คราบน้ำมันบนผิว
  for (let i = 0; i < 10; i++) {
    const [x, y] = pt();
    blob(x, y, rr(90, 200), rr(0.22, 0.42), fx.slick);
  }
  for (let i = 0; i < 2200; i++) {
    const [x, y] = pt();
    g.fillStyle = R() < 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.07)";
    g.fillRect(x, y, rr(1, 3), rr(1, 3));
  } // เม็ดละเอียดให้ผิวไม่เรียบเกินไป
  // ของลอย
  const draw = {
    flake: (x, y, s, c) => {
      g.save();
      g.translate(x, y);
      g.rotate(R() * TAU);
      g.beginPath();
      const n = 5 + Math.floor(R() * 3);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU,
          rad = s * (0.55 + R() * 0.6),
          px = Math.cos(a) * rad * 1.3,
          py = Math.sin(a) * rad * 0.8;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.closePath();
      g.fillStyle = pick(c);
      g.fill();
      g.strokeStyle = "rgba(0,0,0,.35)";
      g.lineWidth = 1;
      g.stroke();
      g.fillStyle = "rgba(255,255,255,.2)";
      g.beginPath();
      g.ellipse(-s * 0.2, -s * 0.2, s * 0.3, s * 0.13, 0, 0, TAU);
      g.fill();
      g.restore();
    },
    pepper: (x, y, s) => {
      g.save();
      g.translate(x, y);
      const p = g.createRadialGradient(-s * 0.3, -s * 0.3, s * 0.1, 0, 0, s);
      p.addColorStop(0, "#7a5238");
      p.addColorStop(0.6, "#3c2417");
      p.addColorStop(1, "#1c0f08");
      g.fillStyle = p;
      g.beginPath();
      g.ellipse(0, 0, s, s * 0.85, R() * 3, 0, TAU);
      g.fill();
      g.fillStyle = "rgba(255,255,255,.45)";
      g.beginPath();
      g.ellipse(-s * 0.3, -s * 0.35, s * 0.22, s * 0.12, -0.5, 0, TAU);
      g.fill();
      g.restore();
    },
    pod: (x, y, len, col) => {
      g.save();
      g.translate(x, y);
      g.rotate(R() * TAU);
      g.lineCap = "round";
      const bend = (R() - 0.5) * len * 0.5;
      [
        [len * 0.2, "rgba(40,5,2,.75)", 0],
        [len * 0.15, col, 0],
        [len * 0.04, "rgba(255,160,140,.55)", -len * 0.04],
      ].forEach(([w, st, dy]) => {
        g.strokeStyle = st;
        g.lineWidth = w;
        g.beginPath();
        g.moveTo(-len / 2, dy);
        g.quadraticCurveTo(0, bend + dy, len / 2, dy);
        g.stroke();
      });
      g.restore();
    },
    scallion: (x, y, s) => {
      g.save();
      g.translate(x, y);
      g.scale(1, 0.8);
      g.rotate(R() * 3);
      g.lineWidth = s * 0.35;
      g.strokeStyle = "#7fb544";
      g.beginPath();
      g.arc(0, 0, s, 0, TAU);
      g.stroke();
      g.lineWidth = s * 0.12;
      g.strokeStyle = "rgba(225,246,170,.75)";
      g.beginPath();
      g.arc(0, 0, s, 0.3, 2.2);
      g.stroke();
      g.restore();
    },
    drop: (x, y, r, c) => {
      g.save();
      g.translate(x, y);
      g.scale(1, 0.78);
      const b = g.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.05, 0, 0, r);
      b.addColorStop(0, rgba(c, 0.5));
      b.addColorStop(0.8, rgba(c));
      b.addColorStop(
        1,
        `rgba(${(c[0] * 0.5) | 0},${(c[1] * 0.5) | 0},${(c[2] * 0.5) | 0},${c[3]})`,
      );
      g.fillStyle = b;
      g.beginPath();
      g.arc(0, 0, r, 0, TAU);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,.28)";
      g.lineWidth = 1;
      g.stroke();
      g.fillStyle = "rgba(255,255,255,.7)";
      g.beginPath();
      g.ellipse(-r * 0.35, -r * 0.4, r * 0.25, r * 0.13, -0.6, 0, TAU);
      g.fill();
      g.restore();
    },
    sesame: (x, y, s) => {
      g.save();
      g.translate(x, y);
      g.rotate(R() * 3);
      g.fillStyle = "#efe3c4";
      g.strokeStyle = "rgba(0,0,0,.3)";
      g.beginPath();
      g.ellipse(0, 0, s * 1.6, s * 0.85, 0, 0, TAU);
      g.fill();
      g.stroke();
      g.restore();
    },
    herb: (x, y, s) => {
      g.save();
      g.translate(x, y);
      g.rotate(R() * 3);
      g.fillStyle = pick(["#4e8c2f", "#6aa83c", "#356b22"]);
      g.beginPath();
      g.ellipse(0, 0, s * 1.3, s * 0.6, 0, 0, TAU);
      g.fill();
      g.restore();
    },
    goji: (x, y, s) => {
      g.save();
      g.translate(x, y);
      g.rotate(R() * 3);
      const p = g.createRadialGradient(-s * 0.3, -s * 0.2, 1, 0, 0, s * 1.2);
      p.addColorStop(0, "#ff7a45");
      p.addColorStop(1, "#a8230f");
      g.fillStyle = p;
      g.beginPath();
      g.ellipse(0, 0, s * 1.3, s * 0.7, 0, 0, TAU);
      g.fill();
      g.fillStyle = "rgba(255,255,255,.5)";
      g.beginPath();
      g.ellipse(-s * 0.4, -s * 0.25, s * 0.3, s * 0.12, 0, 0, TAU);
      g.fill();
      g.restore();
    },
  };
  const K = 1.5; // ขนาดของลอยโดยรวม (เพิ่ม = ของลอยใหญ่ขึ้น)
  fx.items.forEach((it) => {
    for (let i = 0, n = Math.round(it.n * 1.25); i < n; i++) {
      const [x, y] = pt(),
        s = (it.s ? rr(it.s[0], it.s[1]) : 3) * K;
      g.save();
      g.shadowColor = "rgba(0,0,0,.4)";
      g.shadowBlur = 4;
      g.shadowOffsetX = 1;
      g.shadowOffsetY = 2;
      draw[it.t](x, y, s, it.c);
      g.restore();
    }
  });
  // ขอบเงาให้มีมิติ + ขอบผิวน้ำ + ประกายมัน
  g.save();
  g.translate(W / 2, H / 2);
  g.scale(1, H / W);
  const v = g.createRadialGradient(0, 0, W * 0.22, 0, 0, W * 0.56);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,.5)");
  g.fillStyle = v;
  g.fillRect(-W / 2, -W / 2, W, W);
  g.restore();
  g.strokeStyle = "rgba(255,255,255,.18)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(W / 2, H / 2, W / 2 - 6, H / 2 - 6, 0, 0, TAU);
  g.stroke();
  const hl = g.createRadialGradient(
    W * 0.3,
    H * 0.25,
    5,
    W * 0.3,
    H * 0.25,
    W * 0.35,
  );
  hl.addColorStop(0, `rgba(255,255,255,${fx.gloss || 0.2})`);
  hl.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = hl;
  g.fillRect(0, 0, W, H);
  return (soupTexCache[d.id] = cv.toDataURL("image/jpeg", 0.92));
}
// piece = รูปชิ้นเดี่ยวที่คีบลงชาม · pw = ความกว้างของชิ้นในชาม (px) · ถ้าไม่มี piece จะใช้รูป xxxFood เดิม (เช่นกลุ่มเส้น)
// วัตถุดิบ — ใส่ซ้ำได้ไม่จำกัด · g = น้ำหนักต่อ 1 การใส่ (กรัม) · rc = ชื่อสั้นบนใบออเดอร์ (ไม่ใส่ก็ได้) · เรียงเป็นหน้าละ 4 ชนิด (หน้าใหม่เกิดอัตโนมัติเมื่อเพิ่มรายการ)
// เพิ่มวัตถุดิบใหม่: ใส่รูปใน ASSETS (xxxTray = รูปถาด, xxxFood = รูปอาหารที่ตัดแล้ว) แล้วเพิ่มบรรทัดตรงนี้
const INGS = [
  {
    id: "bok",
    piece: "bokPiece",
    pw: 143,
    g: 100,
    rc: "ผักกวางตุ้ง",
    img: "bokTray",
    food: "bokFood",
    th: "ผักกวางตุ้งไต้หวัน",
    en: "Bok Choy",
  },
  {
    id: "cab",
    piece: "cabPiece",
    pw: 170,
    g: 120,
    img: "cabTray",
    food: "cabFood",
    th: "ผักกาดขาว",
    en: "Cabbage",
  },
  {
    id: "wat",
    piece: "watPiece",
    pw: 170,
    g: 80,
    img: "watTray",
    food: "watFood",
    th: "ผักบุ้ง",
    en: "Water spinach",
  },
  {
    id: "wak",
    piece: "wakPiece",
    pw: 113,
    g: 50,
    img: "wakTray",
    food: "wakFood",
    th: "สาหร่ายวากาเมะ",
    en: "Wakame",
  },
  {
    id: "enoki",
    piece: "enokiPiece",
    pw: 97,
    g: 60,
    img: "enokiTray",
    food: "enokiFood",
    th: "เห็ดเข็มทอง",
    en: "Enoki",
  },
  {
    id: "oyster",
    piece: "oysterPiece",
    pw: 88,
    g: 90,
    img: "oysterTray",
    food: "oysterFood",
    th: "เห็ดออรินจิ",
    en: "King oyster mushroom",
  },
  {
    id: "lotus",
    piece: "lotusPiece",
    pw: 64,
    g: 70,
    img: "lotusTray",
    food: "lotusFood",
    th: "รากบัว",
    en: "Lotus root",
  },
  {
    id: "corn",
    piece: "cornPiece",
    pw: 117,
    g: 80,
    img: "cornTray",
    food: "cornFood",
    th: "ข้าวโพดอ่อน",
    en: "Baby corn",
  },
  {
    id: "beef",
    ripe: "beefRipe",
    piece: "beefPiece",
    pw: 90,
    g: 100,
    img: "beefTray",
    food: "beefFood",
    th: "เนื้อวัวสไลซ์",
    en: "Sliced beef",
  },
  {
    id: "belly",
    ripe: "bellyRipe",
    piece: "bellyPiece",
    pw: 106,
    g: 110,
    img: "bellyTray",
    food: "bellyFood",
    th: "หมูสามชั้นสไลซ์",
    en: "Sliced pork belly",
  },
  {
    id: "collar",
    ripe: "collarRipe",
    piece: "collarPiece",
    pw: 90,
    g: 120,
    img: "collarTray",
    food: "collarFood",
    th: "คอหมูสไลซ์",
    en: "Pork collar",
  },
  {
    id: "saus",
    piece: "sausPiece",
    pw: 46,
    g: 90,
    img: "sausTray",
    food: "sausFood",
    th: "ไส้กรอกค็อกเทล",
    en: "Cocktail sausage",
  },
  {
    id: "cheese",
    piece: "cheesePiece",
    pw: 46,
    g: 100,
    img: "cheeseTray",
    food: "cheeseFood",
    th: "เต้าหู้ชีส",
    en: "Cheese tofu",
  },
  {
    id: "roll",
    piece: "rollPiece",
    pw: 59,
    g: 50,
    img: "rollTray",
    food: "rollFood",
    th: "ฟองเต้าหู้ม้วนทอด",
    en: "Fried tofu curd roll",
  },
  {
    id: "jelly",
    piece: "jellyPiece",
    pw: 77,
    g: 60,
    img: "jellyTray",
    food: "jellyFood",
    th: "แมงกะพรุน",
    en: "Jellyfish",
  },
  {
    id: "kelp",
    piece: "kelpPiece",
    pw: 140,
    g: 70,
    img: "kelpTray",
    food: "kelpFood",
    th: "เส้นสาหร่ายเคลป์",
    en: "Kelp noodles",
  },
  {
    id: "glass",
    piece: "glassPiece",
    pw: 140,
    g: 80,
    img: "glassTray",
    food: "glassFood",
    th: "วุ้นเส้น",
    en: "Glass noodles",
  },
  {
    id: "inst",
    piece: "instPiece",
    pw: 140,
    g: 120,
    img: "instTray",
    food: "instFood",
    th: "บะหมี่กึ่งสำเร็จรูป",
    en: "Instant noodles",
  },
  {
    id: "sweet",
    piece: "sweetPiece",
    pw: 140,
    g: 90,
    img: "sweetTray",
    food: "sweetFood",
    th: "เส้นมันเทศ",
    en: "Sweet potato noodles",
  },
];
// ตำแหน่งการ์ด 4 ช่องต่อหน้า (2x2) และจำนวนหน้า
const SLOTS = [
  { x: 1362, y: 212 },
  { x: 1614, y: 212 },
  { x: 1362, y: 532 },
  { x: 1614, y: 532 },
];
INGS.forEach((d, i) => {
  d.page = i >> 2;
  d.x = SLOTS[i & 3].x;
  d.y = SLOTS[i & 3].y;
});
const PAGES = Math.ceil(INGS.length / 4);
const PRICE_PER_100G = 39; // ราคา 39 บาทต่อ 100 กรัม (1 ขีด) — คิดตามน้ำหนักจริง ไม่ปัดขึ้น
// น้ำซุปหน้า Base Soup: ตารางละ 3 คอลัมน์ x 2 แถว (รองรับ 6 ชนิด) — เพิ่มซุปใหม่แค่เพิ่มรายการใน SOUPS
const SOUP_COLS = [1302, 1486, 1670],
  SOUP_ROWS = [196, 449];
SOUPS.forEach((d, i) => {
  d.x = SOUP_COLS[i % 3];
  d.y = SOUP_ROWS[Math.floor(i / 3) % 2];
});
// เครื่องปรุง (ลงถ้วยน้ำจิ้ม) — color = สีผสมในถ้วย, specks = เม็ดตกแต่ง
const SAUCES = [
  {
    id: "sesame",
    img: "sesame",
    th: "ซอสงา",
    x: 525,
    y: 132,
    color: [224, 168, 92],
    specks: [],
  },
  {
    id: "garlic",
    img: "garlic",
    th: "กระเทียม",
    x: 675,
    y: 132,
    color: [232, 220, 176],
    specks: ["#fff6d8", "#f2e3b0"],
  },
  {
    id: "chilli",
    img: "chilli",
    th: "พริกสด",
    x: 824,
    y: 132,
    color: [168, 48, 31],
    specks: ["#c92a1a", "#3f8f2b", "#e8472b"],
  },
  {
    id: "sukki",
    img: "sukki",
    th: "น้ำจิ้มสุกี้",
    x: 974,
    y: 132,
    color: [194, 69, 27],
    specks: [],
  },
  {
    id: "corian",
    img: "corian",
    th: "ผักชี",
    x: 0,
    y: 0,
    color: [96, 150, 62],
    specks: ["#3f8f2b", "#5fae3e", "#7ccf55"],
  },
  {
    id: "malaoil",
    img: "malaoil",
    th: "น้ำมันหม่าล่า",
    x: 0,
    y: 0,
    color: [176, 32, 20],
    specks: ["#c0392b", "#ff6b4a"],
  },
  {
    id: "soy",
    img: "soy",
    th: "ซีอิ๊วขาว",
    x: 0,
    y: 0,
    color: [66, 32, 16],
    specks: [],
  },
  {
    id: "worce",
    img: "worce",
    th: "ซอสวูสเตอร์",
    x: 0,
    y: 0,
    color: [84, 40, 20],
    specks: [],
  },
];
// เครื่องปรุงแสดงทีละ 4 ชนิด เกินนั้นเลื่อนไปทางขวาด้วยปุ่ม ‹ › (หรือเลื่อนเมาส์/ทัชแพด) — ตำแหน่งเรียงในแทร็กอัตโนมัติ
const SAUCE_PER_PAGE = 4,
  SAUCE_STEP = 150,
  SAUCE_VIEW_W = 600;
SAUCES.forEach((d, i) => {
  d.x = 25 + i * SAUCE_STEP;
  d.y = 20;
});
const SPAGES = Math.ceil(SAUCES.length / SAUCE_PER_PAGE);

// สีของวัตถุดิบตอนสุก (CSS filter): sep=เซเปีย sat=ความอิ่มสี bri=ความสว่าง hue=เลื่อนเฉดสี t=เวลาที่ใช้สุก (สัดส่วนของเวลาต้ม — ผักสุกไว เนื้อสุกช้า)
const COOK_DEFAULT = { sep: 0.2, sat: 1, bri: 0.92, hue: 0, t: 0.7 };
const COOK = {
  bok: { sep: 0, sat: 1.3, bri: 0.78, hue: -6, t: 0.45 }, // ผักสุก: เขียวเข้มขึ้น
  cab: { sep: 0.4, sat: 1.1, bri: 0.96, hue: 0, t: 0.55 }, // กะหล่ำ/ผักกาดขาว: เหลืองใสขึ้น
  wat: { sep: 0, sat: 1.2, bri: 0.74, hue: -4, t: 0.4 },
  wak: { sep: 0, sat: 1.6, bri: 1.2, hue: 22, t: 0.3 }, // วากาเมะ: ลวกแล้วเขียวสด
  enoki: { sep: 0.35, sat: 1.05, bri: 0.9, hue: 0, t: 0.5 },
  oyster: { sep: 0.55, sat: 1.1, bri: 0.78, hue: 0, t: 0.6 },
  lotus: { sep: 0.4, sat: 1.2, bri: 0.94, hue: 0, t: 0.8 },
  corn: { sep: 0.1, sat: 1.4, bri: 1.0, hue: 0, t: 0.6 },
  beef: { sep: 0, sat: 1, bri: 1, hue: 0, t: 0.95 }, // ใช้ภาพ ripe แทนฟิลเตอร์   // เนื้อ: แดง → น้ำตาลเทา
  belly: { sep: 0, sat: 1, bri: 1, hue: 0, t: 0.9 }, // ใช้ภาพ ripe แทนฟิลเตอร์
  collar: { sep: 0, sat: 1, bri: 1, hue: 0, t: 0.95 }, // ใช้ภาพ ripe แทนฟิลเตอร์
  saus: { sep: 0.1, sat: 1.25, bri: 0.8, hue: -4, t: 0.8 },
  cheese: { sep: 0.35, sat: 1.1, bri: 0.92, hue: 0, t: 0.7 },
  roll: { sep: 0.45, sat: 1.3, bri: 0.88, hue: 0, t: 0.75 },
  jelly: { sep: 0.3, sat: 0.3, bri: 1.08, hue: 0, t: 0.65 },
  kelp: { sep: 0.25, sat: 1, bri: 0.95, hue: 0, t: 0.8 },
  glass: { sep: 0.25, sat: 1, bri: 0.92, hue: 0, t: 0.8 },
  inst: { sep: 0.15, sat: 1.25, bri: 0.84, hue: 0, t: 1 },
  sweet: { sep: 0.3, sat: 1.15, bri: 0.9, hue: 0, t: 0.85 },
};
// โอกาสที่ชิ้นอาหารจะ [ลอย, จมครึ่ง, จมมิด] ตอนต้ม — ผักใบลอยง่าย เนื้อ/เส้น/ของหนักจมง่าย
const SINK = {
  bok: [0.7, 0.25, 0.05],
  cab: [0.6, 0.3, 0.1],
  wat: [0.6, 0.3, 0.1],
  wak: [0.35, 0.4, 0.25],
  enoki: [0.45, 0.4, 0.15],
  oyster: [0.3, 0.45, 0.25],
  lotus: [0.15, 0.35, 0.5],
  corn: [0.15, 0.35, 0.5],
  beef: [0.25, 0.4, 0.35],
  belly: [0.25, 0.4, 0.35],
  collar: [0.2, 0.4, 0.4],
  saus: [0.1, 0.3, 0.6],
  cheese: [0.15, 0.3, 0.55],
  roll: [0.4, 0.4, 0.2],
  jelly: [0.2, 0.4, 0.4],
  kelp: [0.2, 0.4, 0.4],
  glass: [0.15, 0.4, 0.45],
  inst: [0.2, 0.4, 0.4],
  sweet: [0.15, 0.4, 0.45],
};
function pickDepth(id) {
  const p = SINK[id] || [0.5, 0.3, 0.2],
    r = Math.random();
  return r < p[0] ? 0 : r < p[0] + p[1] ? 1 : 2;
}
const cookOf = (id) => Object.assign({}, COOK_DEFAULT, COOK[id]);
const cookFilter = (c, raw) =>
  raw
    ? "sepia(0) saturate(1) brightness(1) hue-rotate(0deg)"
    : `sepia(${c.sep}) saturate(${c.sat}) brightness(${c.bri}) hue-rotate(${c.hue}deg)`;

/* ============================================================ State */
let foodMade = 0; // จำนวนชิ้นที่วางในชามแล้ว
const state = { ings: [], soups: [], sauces: [], spice: 1, spiceSet: false }; // spice: 0=MILD 1=MEDIUM 2=HOT 3=HELL   // soups = id น้ำซุปที่เลือก (หลายชนิดได้)   // ings = รายการ id ตามลำดับที่ใส่ (ซ้ำได้)
const $ = (s) => document.querySelector(s);
const stage = $("#stage"),
  ghost = $("#ghost");
let scale = 1;

/* ปรับเวทีให้พอดีหน้าจอ */
function fit() {
  const w = innerWidth,
    h = innerHeight;
  scale = Math.min(w / 1920, h / 1080);
  const ox = (w - 1920 * scale) / 2,
    oy = (h - 1080 * scale) / 2;
  stage.style.transform = `translate(${ox}px,${oy}px) scale(${scale})`;
}
addEventListener("resize", fit);
fit();

/* ใส่รูปหลัก */
$("#play").style.setProperty("--tile", `url("${ASSETS.bgTile}")`);
$("#logo").src = ASSETS.logo;
$("#si1").src = ASSETS.s1;
$("#si2").src = ASSETS.s3;
$("#si3").src = ASSETS.s2; // สลับขั้นตอน 2 (เครื่องปรุง) กับ 3 (น้ำซุป)
$("#potImg").src = ASSETS.pot;
$("#bowlImg").src = ASSETS.bowlPlastic;
$("#sbowlImg").src = ASSETS.sbowl;

/* สร้างรายการที่ลากได้ */
const play = $("#play");
function makeItem(d, kind) {
  const el = document.createElement("div");
  el.className = "item";
  el.dataset.kind = kind;
  el.dataset.id = d.id;
  if (kind === "ing") el.dataset.page = d.page;
  let html;
  if (kind === "soup") {
    el.style.cssText = `left:${d.x}px;top:${d.y}px;width:180px`;
    html = `<img class="ic" src="${ASSETS[d.img]}" width="125" height="125" alt=""><div class="plus" style="left:123px;top:0">+</div><div style="margin-top:22px;font-size:23px">${d.th}</div>`;
  } else if (kind === "ing") {
    el.style.cssText = `left:${d.x}px;top:${d.y}px;width:250px`;
    html = `<img class="ic" src="${ASSETS[d.img]}" width="200" height="200" alt=""><div class="plus" style="left:188px;top:8px">+</div><div class="cnt"></div><div><span class="tag">${d.th}</span></div><div class="en">${d.en}</div><div class="gr">${d.g} g</div>`;
  } else {
    el.style.cssText = `left:${d.x}px;top:${d.y}px;width:100px`; // เครื่องปรุง: พิกัดอยู่ในแทร็กที่เลื่อนได้
    html = `<img class="ic" src="${ASSETS[d.img]}" width="98" height="98" alt=""><div style="margin-top:14px;font-size:23px;white-space:nowrap">${d.th}</div>`;
  }
  el.innerHTML = html;
  (kind === "sauce" ? $("#sauceTrack") : play).appendChild(el);
  el.addEventListener("pointerdown", (e) => startDrag(e, d, kind, el));
}
SOUPS.forEach((d) => makeItem(d, "soup"));
INGS.forEach((d) => makeItem(d, "ing"));
SAUCES.forEach((d) => makeItem(d, "sauce"));
/* แถวเครื่องปรุงเลื่อนได้ */
let sPage = 0;
function sGo(p) {
  sPage = Math.max(0, Math.min(SPAGES - 1, p));
  $("#sauceTrack").style.transform = `translateX(${-sPage * SAUCE_VIEW_W}px)`;
  $("#sPrev").disabled = sPage === 0;
  $("#sNext").disabled = sPage === SPAGES - 1;
}
$("#sPrev").addEventListener("click", () => sGo(sPage - 1));
$("#sNext").addEventListener("click", () => sGo(sPage + 1));
let wheelT = 0;
$("#sauceView").addEventListener(
  "wheel",
  (e) => {
    // เลื่อนด้วยเมาส์/ทัชแพด
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 8) return;
    e.preventDefault();
    if (performance.now() - wheelT > 450) {
      wheelT = performance.now();
      sGo(sPage + (d > 0 ? 1 : -1));
    }
  },
  { passive: false },
);
sGo(0);

/* ============================================================ Drag & Drop
   ใช้ Pointer Events จึงรองรับทั้งเมาส์และทัชบนมือถือ
   ถ้าขยับน้อยกว่า 6px ถือว่าเป็นการ "แตะ" แล้วใส่ให้เลย */
/* ที่คีบอาหาร (SVG วาดเอง) — ใช้เป็นเคอร์เซอร์ตอนชี้การ์ดวัตถุดิบ และเป็นตัวคีบตอนลาก
   ปลายคีบอยู่ที่พิกัด (50,178) ของ viewBox 0 0 100 200 */
const TONGS_PATHS = `<g fill="none" stroke-linecap="round">
  <path d="M53 10 C74 62 68 122 56 178" stroke="#6b7078" stroke-width="12"/><path d="M47 10 C26 62 32 122 44 178" stroke="#6b7078" stroke-width="12"/>
  <path d="M53 10 C74 62 68 122 56 178" stroke="#dfe3e8" stroke-width="8"/><path d="M47 10 C26 62 32 122 44 178" stroke="#eef0f3" stroke-width="8"/>
  <path d="M55 20 C70 66 65 118 56 168" stroke="#fff" stroke-opacity=".7" stroke-width="2"/></g>
  <circle cx="50" cy="12" r="8" fill="#9aa0a8" stroke="#6b7078" stroke-width="3"/><rect x="38" y="172" width="12" height="12" rx="4" fill="#c9ced4" stroke="#6b7078" stroke-width="2"/><rect x="50" y="172" width="12" height="12" rx="4" fill="#c9ced4" stroke="#6b7078" stroke-width="2"/>`;
const TONGS_SVG = `<svg class="tg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">${TONGS_PATHS}</svg>`;
{
  const cur = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g transform="translate(28 50) rotate(32) scale(.24) translate(-50 -178)">${TONGS_PATHS}</g></svg>`;
  const st = document.createElement("style");
  st.textContent = `.item[data-kind="ing"]{cursor:url("data:image/svg+xml;utf8,${encodeURIComponent(cur)}") 28 50, grab}`;
  document.head.appendChild(st);
}

/* ช้อน (SVG วาดเอง) — เคอร์เซอร์ตอนชี้เครื่องปรุง และเป็นตัวตักตอนลาก (ปลายช้อนอยู่ที่พิกัด (40,160) ของ viewBox 0 0 120 200) */
const spoonSvg = (
  d,
) => `<path d="M98 8 L52 138" stroke="#6b7078" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M98 8 L52 138" stroke="#e3e6ea" stroke-width="7" stroke-linecap="round" fill="none"/>
  <ellipse cx="40" cy="160" rx="33" ry="25" transform="rotate(-20 40 160)" fill="#d4d8dd" stroke="#6b7078" stroke-width="3"/>
  <ellipse cx="40" cy="158" rx="27" ry="19" transform="rotate(-20 40 158)" fill="${d ? `rgb(${d.color})` : "#aab0b8"}"/>
  ${
    d
      ? `<ellipse cx="30" cy="150" rx="10" ry="5" transform="rotate(-30 30 150)" fill="rgba(255,255,255,.45)"/>` +
        d.specks
          .slice(0, 3)
          .map(
            (c, i) =>
              `<circle cx="${30 + i * 9}" cy="${157 + (i % 2) * 6}" r="3.2" fill="${c}"/>`,
          )
          .join("")
      : ""
  }`;
{
  const cur = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g transform="translate(16 46) scale(.26) translate(-40 -160)">${spoonSvg(null)}</g></svg>`;
  const st = document.createElement("style");
  st.textContent = `.item[data-kind="sauce"]{cursor:url("data:image/svg+xml;utf8,${encodeURIComponent(cur)}") 16 46, grab}`;
  document.head.appendChild(st);
}

let drag = null,
  busy = false; // busy = กำลังเล่นแอนิเมชันรีเซ็ต ห้ามลาก
function startDrag(e, d, kind, el) {
  if (busy || el.classList.contains("used")) return;
  e.preventDefault();
  drag = { d, kind, el, sx: e.clientX, sy: e.clientY, moved: false };
  const key = kind === "soup" || kind === "sauce" ? d.img : d.img;
  ghost.innerHTML =
    kind === "ing"
      ? `<img src="${ASSETS[d.piece || d.food]}" style="display:block;width:${d.pw}px;transition:transform .12s" alt="">${TONGS_SVG}` // หยิบเป็นชิ้น + ที่คีบ
      : kind === "sauce"
        ? `<svg class="sp" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">${spoonSvg(d)}</svg>` // ตักเครื่องปรุงด้วยช้อน
        : `<img src="${ASSETS[key]}" width="120" alt="">`;
}
addEventListener("pointermove", (e) => {
  if (!drag) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) {
    drag.moved = true;
    ghost.style.display = "block";
    document.body.classList.add("dragging");
  }
  if (drag.moved) {
    const r = stage.getBoundingClientRect();
    ghost.style.left = (e.clientX - r.left) / scale + "px";
    ghost.style.top = (e.clientY - r.top) / scale + "px";
    const t = targetFor(drag.kind);
    if (drag.kind === "sauce") {
      ghost.querySelector(".sp").style.transform =
        `rotate(${hit($("#sbowl"), e) ? -32 : 0}deg)`;
    } // เอียงช้อนเทลงถ้วย
    if (drag.kind === "ing" && drag.d.piece) {
      // พรีวิวมุมเอียงของชิ้นขณะลากอยู่เหนือชาม
      const br = $("#bowl").getBoundingClientRect(),
        inside = hit($("#bowl"), e);
      const px = Math.max(
          10,
          Math.min(90, ((e.clientX - br.left) / br.width) * 100),
        ),
        py = Math.max(
          15,
          Math.min(78, ((e.clientY - br.top) / br.height) * 100),
        );
      ghost.querySelector("img").style.transform =
        `rotate(${inside ? radialAngle(px, py) : 0}deg)`;
    }
    ["bowl", "sbowl", "pot"].forEach((id) =>
      $("#" + id).classList.toggle("over", t === id && hit($("#" + id), e)),
    );
  }
});
function targetFor(kind) {
  return kind === "sauce" ? "sbowl" : kind === "soup" ? "pot" : "bowl";
} // น้ำซุปลงหม้อ / เครื่องปรุงลงถ้วย / วัตถุดิบลงชาม
function hit(el, e) {
  const r = el.getBoundingClientRect(),
    p = 24 * scale;
  return (
    e.clientX > r.left - p &&
    e.clientX < r.right + p &&
    e.clientY > r.top - p &&
    e.clientY < r.bottom + p
  );
}
addEventListener("pointerup", (e) => {
  if (!drag) return;
  const { d, kind, moved } = drag;
  const t = targetFor(kind),
    ok = hit($("#" + t), e);
  ghost.style.display = "none";
  document.body.classList.remove("dragging");
  ["bowl", "sbowl", "pot"].forEach((id) =>
    $("#" + id).classList.remove("over"),
  );
  drag = null;
  // ลากวางลงชาม: ชิ้นอาหารจะอยู่ตรงตำแหน่งที่ปล่อยเมาส์/นิ้ว (เป็น % ของชาม) — ถ้าแตะปุ่ม + จะจัดตำแหน่งให้อัตโนมัติ
  let pos = null;
  if (kind === "ing" && moved && ok) {
    const r = $("#bowl").getBoundingClientRect();
    pos = {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  }
  if (!moved || ok) place(kind, d, pos, moved);
  else if (moved)
    toast(kind === "sauce" ? "ลากลงถ้วยสีขาวนะ" : "ลากลงชามใบใหญ่นะ");
});
addEventListener("pointercancel", () => {
  drag = null;
  ghost.style.display = "none";
  document.body.classList.remove("dragging");
});

/* ============================================================
   SOUND — เสียงสังเคราะห์ด้วย Web Audio ทั้งหมด (ไม่ต้องมีไฟล์เสียง)
   อยากใช้ไฟล์เสียงจริง: เปลี่ยนเนื้อใน sfx.ingredient / sfx.soup / sfx.sauce / sfx.reset
   เป็น new Audio('xxx.mp3').play() ได้เลย
   ============================================================ */
let actx = null,
  noiseBuf = null,
  muted = false;
function audio() {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
    const n = actx.sampleRate * 2;
    noiseBuf = actx.createBuffer(1, n, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }
  if (actx.state === "suspended") actx.resume();
  return actx;
}
function env(g, t, a, peak, dur) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}
function blip(c, t, f0, f1, dur, peak, type) {
  // ฟองน้ำ/หยดน้ำ: เสียงไซน์ที่ไล่ความถี่
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = type || "sine";
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, 0.008, peak, dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}
function noise(c, t, dur, f0, f1, q, peak) {
  // เสียงน้ำกระเซ็น/ไหล: noise ผ่านฟิลเตอร์ที่เลื่อนความถี่
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const f = c.createBiquadFilter(),
    g = c.createGain();
  f.type = "bandpass";
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, Math.min(0.05, dur / 3), peak, dur);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t, Math.random());
  s.stop(t + dur + 0.02);
}
const sfx = {
  ingredient() {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime; // วัตถุดิบตกลงน้ำซุป: ตุ้บ + น้ำกระเซ็น
    blip(c, t, 260, 70, 0.16, 0.5);
    noise(c, t, 0.28, 2200, 700, 0.9, 0.35);
    blip(c, t + 0.09, 520, 300, 0.1, 0.18);
    blip(c, t + 0.17, 640, 380, 0.09, 0.12);
  },
  soup() {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime; // เทซุป: น้ำไหลยาว + ฟองปุดๆ
    noise(c, t, 1.15, 600, 1100, 1.4, 0.38);
    noise(c, t + 0.1, 0.9, 1800, 900, 2.2, 0.12);
    for (let i = 0; i < 9; i++) {
      const bt = t + 0.08 + Math.random() * 0.95,
        f = 280 + Math.random() * 520;
      blip(c, bt, f, f * 1.7, 0.07, 0.11);
    }
    blip(c, t + 1.05, 200, 90, 0.2, 0.3);
  },
  sauce() {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime; // ปรุงน้ำจิ้ม: หยดน้ำ + ช้อนกระทบถ้วย
    blip(c, t, 1100, 420, 0.11, 0.32);
    noise(c, t, 0.12, 3000, 1500, 1.2, 0.12);
    blip(c, t + 0.14, 2600, 2500, 0.12, 0.07, "triangle");
    blip(c, t + 0.15, 3900, 3800, 0.1, 0.04, "triangle");
    blip(c, t + 0.3, 900, 500, 0.08, 0.14);
  },
  done() {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime; // ออเดอร์สำเร็จ: กริ๊งเครื่องคิดเงิน
    blip(c, t, 1568, 1560, 0.7, 0.22, "triangle");
    blip(c, t + 0.12, 2093, 2090, 0.8, 0.2, "triangle");
    blip(c, t, 3136, 3130, 0.4, 0.05, "sine");
    noise(c, t, 0.08, 5000, 4000, 1.5, 0.1);
  },
  boil(ms) {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime,
      d = ms / 1000; // น้ำเดือด: เสียงครืนต่ำ + ฟองปุดๆ + ไอน้ำ
    noise(c, t, d, 220, 320, 0.8, 0.1);
    noise(c, t, d, 5200, 4200, 0.6, 0.025);
    for (let i = 0; i < 46; i++) {
      const bt = t + Math.random() * (d - 0.2),
        f = 240 + Math.random() * 620;
      blip(
        c,
        bt,
        f,
        f * 1.8,
        0.06 + Math.random() * 0.05,
        0.07 + Math.random() * 0.05,
      );
    }
  },
  reveal(tier) {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime,
      N = [523, 659, 784, 1047, 1319, 1568, 2093, 2349]; // ไอเทมดรอป: ยิ่งหายากยิ่งเสียงยาว
    for (let i = 0; i < tier + 3; i++)
      blip(c, t + 0.1 + i * 0.11, N[i], N[i], 0.7, 0.16, "triangle");
    if (tier >= 2) noise(c, t + 0.1, 0.9, 2500, 7000, 1.2, 0.08);
    if (tier >= 3) blip(c, t + 0.1, 110, 45, 0.9, 0.4);
    if (tier >= 4) {
      blip(c, t + 0.7, 2093, 2093, 1.2, 0.12, "sine");
      noise(c, t + 0.3, 1.4, 1500, 9000, 1.5, 0.1);
    }
  },
  ding() {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime;
    blip(c, t, 1760 + Math.random() * 400, 1900, 0.35, 0.07, "triangle");
  },
  reset() {
    const c = audio();
    if (!c || muted) return;
    const t = c.currentTime; // ชามเลื่อนออก/เข้า: เสียงลมวูบ
    noise(c, t, 0.7, 250, 1400, 0.7, 0.22);
    noise(c, t + 0.72, 0.85, 1400, 300, 0.7, 0.2);
    blip(c, t + 1.45, 160, 110, 0.12, 0.18);
  },
};
addEventListener("pointerdown", audio, { once: true }); // ปลดล็อกเสียงเมื่อผู้เล่นแตะครั้งแรก (ข้อกำหนดของเบราว์เซอร์)
$("#mute").addEventListener("click", () => {
  muted = !muted;
  $("#mute").textContent = muted ? "🔇" : "🔊";
});

/* ============================================================ Game logic */
/* ตำแหน่งชิ้นในชาม: pos = จุดที่ผู้เล่นปล่อย (ถูกบีบให้อยู่ในวงน้ำซุป) · ไม่มี pos = วางไล่เป็นเกลียวจากกลางชาม */
/* หมุนชิ้นอาหารให้ "ชี้เข้าหาจุดรวมสายตา" ใต้ชาม (เหมือนภาพตัวอย่าง): กลางชาม = ตรง, ซ้าย = เอียงซ้าย, ขวา = เอียงขวา
   VANISH_Y = ความลึกของจุดรวม (% ของความสูงชาม, ยิ่งมากยิ่งเอียงน้อย) · MAX_TILT = เอียงสูงสุด (องศา) */
const VANISH_Y = 112,
  MAX_TILT = 50;
function radialAngle(x, y) {
  const dx = (x - 50.3) * 5.0,
    dy = (VANISH_Y - y) * 3.85; // แปลง % เป็นพิกเซลของชาม (500 x 385)
  return Math.round(
    Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, (Math.atan2(dx, dy) * 180) / Math.PI),
    ),
  );
}
function piecePos(d, pos) {
  const k = state.ings.length;
  let x, y;
  if (pos) {
    x = pos.x;
    y = pos.y;
  } else {
    const th = k * 2.39996 + 0.6,
      rr = Math.sqrt(((k % 16) + 2.5) / 18.5);
    x = 50.3 + Math.cos(th) * rr * 30;
    y = 47 + Math.sin(th) * rr * 21;
  }
  const dx = (x - 50.3) / 40,
    dy = (y - 47) / 30,
    n = Math.hypot(dx, dy);
  if (n > 1) {
    x = 50.3 + (dx / n) * 40;
    y = 47 + (dy / n) * 30;
  }
  return {
    id: d.id,
    x,
    y,
    rot: d.piece
      ? radialAngle(x, y) + Math.round(Math.sin(k * 7.3) * 3)
      : Math.round(Math.sin(k * 7.3) * 16),
  };
}
function place(kind, d, pos, moved) {
  if (kind === "ing") {
    state.ings.push(piecePos(d, pos));
    sfx.ingredient();
  } // ใส่ซ้ำได้
  else if (kind === "soup") {
    // เลือกซุปได้หลายชนิด: แตะซุปที่เลือกแล้วอีกครั้ง = เอาออก
    const i = state.soups.indexOf(d.id);
    if (i < 0) {
      state.soups.push(d.id);
      sfx.soup();
    } else if (!moved) state.soups.splice(i, 1);
    else return;
  } else {
    if (state.sauces.find((s) => s.id === d.id)) return;
    state.sauces.push({ id: d.id, dots: makeDots(d) });
    sfx.sauce();
  }
  render();
}
function makeDots(d) {
  if (!d.specks.length) return [];
  return Array.from({ length: 7 }, () => ({
    x: 8 + Math.random() * 78,
    y: 8 + Math.random() * 72,
    s: 5 + Math.random() * 7,
    c: d.specks[Math.floor(Math.random() * d.specks.length)],
  }));
}

function soupTint(ids) {
  // สีเฉลี่ยของซุปที่เลือก ใช้เป็นชั้นคลุมวัตถุดิบที่จมอยู่ใต้ผิวน้ำ
  const ds = ids
    .map((id) => SOUPS.find((s) => s.id === id))
    .filter((d) => d && d.fx);
  if (!ds.length) return "transparent";
  const c = [0, 1, 2].map((i) =>
    Math.round(ds.reduce((a, d) => a + hexRgb(d.fx.base[0])[i], 0) / ds.length),
  );
  return `rgba(${c[0]},${c[1]},${c[2]},.26)`;
}
function buildSoup(el, ids, mix) {
  const n = ids.length,
    mixed = n > 1 ? mixSoup(ids) : null;
  const wrap = (tex) =>
    `<div class="w" style="filter:drop-shadow(0 0 3px rgba(0,0,0,.6))"><div class="tx" style="background-image:url(${tex})"></div></div>`;
  const wedges = ids
    .map((id, i) => {
      const d = SOUPS.find((s) => s.id === id);
      let clip = "";
      if (n > 1) {
        const a0 = -90 + (i * 360) / n,
          a1 = -90 + ((i + 1) * 360) / n,
          pts = ["50% 50%"];
        for (let s = 0; s <= 14; s++) {
          const a = ((a0 + ((a1 - a0) * s) / 14) * Math.PI) / 180;
          pts.push(`${50 + 90 * Math.cos(a)}% ${50 + 90 * Math.sin(a)}%`);
        }
        clip = `clip-path:polygon(${pts.join(",")});`;
      }
      return `<div class="w" style="filter:drop-shadow(0 0 3px rgba(0,0,0,.6))"><div class="tx" style="background-image:url(${d.fx ? soupTex(d) : ASSETS[d.img]});${clip}"></div></div>`; // มีสูตร fx = วาดเอง · ไม่มี = ใช้รูปถ่าย
    })
    .join("");
  if (mix) {
    // ชามหน้าผลลัพธ์: ซุปหลายชนิดผสมเป็นเนื้อเดียว
    el.innerHTML = `<div class="fl"><div class="spin a">${mixed ? wrap(soupTex(mixed)) : wedges}</div></div><span class="sheen"></span>`;
  } else {
    // หม้อ: a = ชั้นนอก · b = ชั้นใน (หมุนเร็วตอนต้ม) · m = ซุปผสมที่ค่อยๆ โผล่ตอนต้ม
    el.innerHTML = `<div class="fl"><div class="spin a">${wedges}</div><div class="spin b">${wedges}</div>${mixed ? `<div class="spin m">${wrap(soupTex(mixed))}</div>` : ""}</div><span class="sheen"></span>`;
  }
}
function render() {
  // วัตถุดิบ: ป้ายจำนวนครั้งที่ใส่บนการ์ด + วางชิ้นใหม่ในชาม
  INGS.forEach((d) => {
    const n = state.ings.filter((x) => x.id === d.id).length,
      b = document.querySelector(`.item[data-id="${d.id}"] .cnt`);
    b.textContent = "×" + n;
    b.style.display = n ? "flex" : "none";
  });
  const fl = $("#foodLayer");
  for (let k = foodMade; k < state.ings.length; k++) {
    foodMade = k + 1;
    const o = state.ings[k],
      d = INGS.find((x) => x.id === o.id);
    const w = document.createElement("div");
    w.className = "pc" + (d.piece ? "" : " old");
    w.style.cssText = `left:${o.x}%;top:${o.y}%;width:${d.pw}px;z-index:${Math.round(o.y * 10) + k}`;
    const im = document.createElement("img");
    im.src = ASSETS[d.piece || d.food];
    im.style.transform = `rotate(${o.rot}deg)`;
    w.appendChild(im);
    fl.appendChild(w);
  }
  // น้ำซุป: ติดสถานะที่เลือก + วาดผิวซุปในชามและในหม้อ (หลายชนิด = แบ่งเป็นช่องเหมือนหม้อสุกี้หยวนยาง)
  SOUPS.forEach((d) =>
    document
      .querySelector(`.item[data-id="${d.id}"]`)
      .classList.toggle("sel", state.soups.includes(d.id)),
  );
  const sl = $("#soupLayer"),
    sig = state.soups.join();
  if (sl.dataset.cur !== sig) {
    sl.dataset.cur = sig;
    buildSoup(sl, state.soups, true);
    buildSoup($("#potSoup"), state.soups, false);
  }
  sl.classList.toggle(
    "on",
    state.soups.length > 0 && play.dataset.view === "result",
  );
  $("#potSoup").classList.toggle("on", state.soups.length > 0);
  const tint = soupTint(state.soups);
  $("#potVeil").style.setProperty("--veil", tint);
  $("#bowlVeil").style.setProperty(
    "--veil",
    play.dataset.view === "result" ? tint : "transparent",
  ); // สีน้ำซุปที่คลุมของที่จม
  // เครื่องปรุง: ผสมสีในถ้วยน้ำจิ้ม
  SAUCES.forEach((d) => {
    const el = document.querySelector(`.item[data-id="${d.id}"]`),
      used = !!state.sauces.find((s) => s.id === d.id);
    el.classList.toggle("used", used);
  });
  const mix = $("#sauceMix");
  if (state.sauces.length) {
    const cs = state.sauces.map((s) => SAUCES.find((x) => x.id === s.id).color);
    const avg = [0, 1, 2].map((i) =>
      Math.round(cs.reduce((a, c) => a + c[i], 0) / cs.length),
    );
    mix.style.background = `radial-gradient(ellipse at 40% 35%, rgb(${avg.map((v) => Math.min(255, v + 22))}) 0%, rgb(${avg}) 60%, rgb(${avg.map((v) => Math.round(v * 0.78))}) 100%)`;
    const prev = mix.querySelectorAll("i").length,
      all = state.sauces.flatMap((s) => s.dots);
    if (prev !== all.length) {
      mix.innerHTML = all
        .map(
          (p) =>
            `<i style="left:${p.x}%;top:${p.y}%;width:${p.s}px;height:${p.s}px;background:${p.c}"></i>`,
        )
        .join("");
    }
    mix.classList.add("on");
  } else {
    mix.classList.remove("on");
    mix.innerHTML = "";
  }
  // แถบขั้นตอนด้านบน
  const view = play.dataset.view;
  $("#st1").classList.add("on");
  $("#st2").classList.toggle("on", state.sauces.length > 0 || view !== "main"); // 2 = เครื่องปรุง
  $("#st3").classList.toggle("on", view === "soup"); // 3 = น้ำซุป
  $("#bNext").disabled = !state.ings.length;
  $("#bOk").disabled = !state.soups.length || !state.ings.length;
  renderReceipt();
}

/* ============================================================
   ORDER / RECEIPT — ใบออเดอร์ด้านซ้าย อัปเดตสดทุกครั้งที่ใส่ของ
   ราคา = น้ำหนักรวม(กรัม) x PRICE_PER_100G / 100  (ตัวอย่าง: 800 g = 8 ขีด x 39 = 312.00)
   ============================================================ */
let orderNo = 1;
try {
  orderNo = +localStorage.getItem("malatang_order") || 1;
} catch (e) {}
let lastSig = null;
function renderReceipt() {
  $("#rcNo").textContent = String(orderNo).padStart(3, "0");
  // รวมวัตถุดิบชนิดเดียวกันเป็นบรรทัดเดียว (เช่น ผักกวางตุ้ง 100 + 100 = 200 grams) เรียงตามลำดับที่ใส่ครั้งแรก
  const groups = [];
  state.ings.forEach((o) => {
    const d = INGS.find((x) => x.id === o.id);
    let g = groups.find((x) => x.d === d);
    if (!g) groups.push((g = { d, grams: 0 }));
    g.grams += d.g;
  });
  const sig = groups.map((g) => g.d.id + ":" + g.grams).join(),
    box = $("#rcRows");
  if (sig !== lastSig) {
    const grew = groups.length > box.children.length && !!groups.length;
    box.innerHTML = groups.length
      ? groups
          .map(
            (g) =>
              `<div class="rr"><span class="th">${g.d.rc || g.d.th}</span><span>${g.grams} grams</span></div>`,
          )
          .join("")
      : '<div class="rc-empty">— ยังไม่มีวัตถุดิบ —</div>';
    if (grew) box.scrollTop = box.scrollHeight;
    lastSig = sig;
  }
  const sk = state.sauces.map((s) => s.id).join(",");
  if ($("#rcSauce").dataset.k !== sk) {
    $("#rcSauce").dataset.k = sk;
    $("#rcSauce").innerHTML = state.sauces
      .map(
        (s) =>
          `<img src="${ASSETS[SAUCES.find((x) => x.id === s.id).img]}" alt="">`,
      )
      .join("");
  }
  const sok = state.soups.join();
  if ($("#rcSoup").dataset.k !== sok) {
    $("#rcSoup").dataset.k = sok;
    $("#rcSoup").innerHTML = state.soups
      .map(
        (id) =>
          `<img src="${ASSETS[SOUPS.find((x) => x.id === id).img]}" style="height:${state.soups.length > 2 ? 76 : 88}px" alt="">`,
      )
      .join("");
  }
  const grams = groups.reduce((a, g) => a + g.grams, 0);
  $("#rcTotal").textContent =
    ["MILD", "MEDIUM", "HOT", "HELL"][state.spice] || "MEDIUM";
  document.querySelector(".rc-total").style.display = state.spiceSet
    ? ""
    : "none"; // #rcTotal ตอนนี้แสดงระดับความเผ็ด (ราคายังคำนวณได้ด้วย PRICE_PER_100G)
}
$("#rcLogo").src = ASSETS.logo;

/* แบ่งหน้าวัตถุดิบ (หน้าละ 4 ชนิด) */
let page = 0;
$("#dots").innerHTML = Array.from(
  { length: PAGES },
  (_, i) => `<i data-p="${i}"></i>`,
).join("");
function showPage(p) {
  page = (p + PAGES) % PAGES;
  document.querySelectorAll('.item[data-kind="ing"]').forEach((el) => {
    el.style.display = +el.dataset.page === page ? "" : "none";
  });
  document
    .querySelectorAll("#dots i")
    .forEach((el, i) => el.classList.toggle("on", i === page));
}
$("#dots").addEventListener("click", (e) => {
  if (e.target.dataset.p !== undefined) showPage(+e.target.dataset.p);
});
$("#pPrev").addEventListener("click", () => showPage(page - 1));
$("#pNext").addEventListener("click", () => showPage(page + 1));
showPage(0);

/* สลับหน้า: main (วัตถุดิบ+เครื่องปรุง) <-> soup (เลือกน้ำซุป) */
const FOOT = {
  main: "ใช้ที่คีบหยิบวัตถุดิบไปวางตรงไหนของชามก็ได้ (ใส่ซ้ำได้) · ปรุงน้ำจิ้มลงถ้วยสีขาว · เสร็จแล้วกด ถัดไป",
  soup: "ลากน้ำซุปลงหม้อ เลือกได้หลายชนิด (แตะซ้ำเพื่อเอาออก) แล้วกด ยืนยันออเดอร์",
  result: "หม่าล่าของคุณพร้อมเสิร์ฟแล้ว!",
};
function setView(v) {
  play.dataset.view = v;
  stage.dataset.view = v;
  {
    const black = v === "result";
    if (setView._b !== black) {
      setView._b = black;
      $("#bowlImg").src = black ? ASSETS.bowl : ASSETS.bowlPlastic;
    }
  } // ชามพลาสติกตอนเลือกของ → ชามดำตอนเสิร์ฟ $('#foot').textContent = FOOT[v];
  render();
}
/* ถัดไป: ชามเลื่อนออกไปทางขวา แล้วหม้อเลื่อนเข้ามาจากขวา · ย้อนกลับ: หม้อออกไปทางขวา ชามเลื่อนกลับเข้ามา */
const SLIDE_OUT = {
    duration: 650,
    easing: "cubic-bezier(.55,0,.85,.4)",
    fill: "forwards",
  },
  SLIDE_IN = { duration: 850, easing: "cubic-bezier(.15,.8,.3,1)" };
const slideX = (el, from, to, opt) =>
  el.animate(
    [
      { transform: `translateX(${from}px)` },
      { transform: `translateX(${to}px)` },
    ],
    opt,
  );
function swapScene(outEl, inEl, nextView) {
  busy = true;
  sfx.reset();
  const a = slideX(outEl, 0, 1500, SLIDE_OUT);
  a.onfinish = () => {
    setView(nextView);
    a.cancel();
    const b = slideX(inEl, 1500, 0, SLIDE_IN);
    b.onfinish = () => {
      busy = false;
    };
  };
}
$("#bNext").addEventListener("click", () => {
  if (busy) return;
  if (state.ings.length) swapScene($("#bowls"), $("#pot"), "soup");
  else toast("ใส่วัตถุดิบก่อนนะ");
});
$("#bBack").addEventListener("click", () => {
  if (!busy) swapScene($("#pot"), $("#bowls"), "main");
});

/* ชามกับถ้วยน้ำจิ้มเลื่อนออกไปทางขวา แล้วชุดใหม่ที่ว่างเปล่าเลื่อนเข้ามาแทน (ใช้ทั้งตอน Reset และตอนส่งออเดอร์)
   onMid = ฟังก์ชันที่ทำตอนชามอยู่นอกจอ (ล้างค่า ฯลฯ) — ปรับระยะ/ความเร็วได้ที่ตัวเลขด้านล่าง */
const bowls = $("#bowls");
function swapBowls(onMid) {
  busy = true;
  sfx.reset();
  bowls.style.transition = "transform .7s cubic-bezier(.55,0,.85,.4)";
  bowls.style.transform = "translateX(1500px)";
  setTimeout(() => {
    onMid();
    bowls.style.transition = "none";
    bowls.style.transform = "translateX(-1300px)";
    void bowls.offsetWidth; // บังคับให้เบราว์เซอร์รับตำแหน่งใหม่ก่อนเริ่มแอนิเมชัน
    bowls.style.transition = "transform .85s cubic-bezier(.15,.8,.3,1)";
    bowls.style.transform = "none";
    setTimeout(() => {
      busy = false;
    }, 880);
  }, 720);
}
function clearOrder() {
  state.ings = [];
  state.soups = [];
  state.sauces = [];
  state.spice = 1;
  state.spiceSet = false;
  renderSpice();
  clearInterval(bubT);
  play.classList.remove("boiling", "steaming");
  $("#potSoup").classList.remove("boil");
  play.removeAttribute("data-rarity");
  play.removeAttribute("data-mbti");
  foodMade = 0;
  $("#sinkLayer").innerHTML = "";
  $("#potSink").innerHTML = "";
  $("#potFood").innerHTML = "";
  $("#potFx").innerHTML = "";
  ["#rHead", "#rTitle", "#rEn"].forEach((s) => $(s).classList.remove("pop"));
  $("#foodLayer").innerHTML = "";
  showPage(0);
  lastSig = null;
  sGo(0);
  setView("main");
}
$("#reset").addEventListener("click", () => {
  if (!busy) swapBowls(clearOrder);
}); // Reset = ล้างออเดอร์ปัจจุบัน (เลขออเดอร์เดิม)

function groups_for_order() {
  const m = {};
  state.ings.forEach((o) => {
    const d = INGS.find((x) => x.id === o.id);
    m[d.th] = (m[d.th] || 0) + d.g;
  });
  return Object.entries(m).map(([name, grams]) => ({ name, grams }));
}
/* ============================================================
   Generate Order → วัตถุดิบหล่นลงหม้อ → ต้ม → หน้าผลลัพธ์ (ชื่อ + ระดับความหายาก + glow)
   ============================================================ */
const receipt = $("#receipt");
let bubT = null,
  lastPlop = 0;
const DSP = "drop-shadow(0 5px 5px rgba(0,0,0,.45))",
  DSB = "drop-shadow(0 6px 6px rgba(0,0,0,.45))";
const BOIL_MS = 4500; // เวลาต้ม (มิลลิวินาที)

// ระดับความหายาก (สีตามตาราง) — w = น้ำหนักการสุ่ม (ตอนนี้สุ่มล้วนๆ)  gi/ri = ความแรงของแสงฟุ้ง/ลำแสง
const RARITIES = [
  {
    key: "common",
    label: "Common",
    color: "#FDFEFE",
    w: 50,
    gi: 0.3,
    ri: 0.1,
    n: 6,
    names: ["Everyday Mala", "Cozy Sichuan Bowl", "Little Lantern Mala"],
  },
  {
    key: "uncommon",
    label: "Uncommon",
    color: "#27AE60",
    w: 28,
    gi: 0.5,
    ri: 0.26,
    n: 10,
    names: ["Garden Fresh Mala", "Lucky Leaf Mala", "Jade Dragon Mala"],
  },
  {
    key: "rare",
    label: "Rare",
    color: "#2471A3",
    w: 14,
    gi: 0.62,
    ri: 0.36,
    n: 15,
    names: ["Ocean Breeze Mala", "Silk Road Mala", "Blue Lantern Mala"],
  },
  {
    key: "epic",
    label: "Epic",
    color: "#7D3C98",
    w: 6,
    gi: 0.72,
    ri: 0.44,
    n: 22,
    names: ["Midnight Dragon Mala", "Phoenix Fire Mala", "Violet Storm Mala"],
  },
  {
    key: "legendary",
    label: "Legendary",
    color: "#F1C40F",
    w: 2,
    gi: 0.88,
    ri: 0.55,
    n: 34,
    names: ["Emperor’s Golden Mala", "Sun God Mala", "Eternal Flame Mala"],
  },
];
function pickRarity() {
  const forced = RARITIES.find(
    (r) => r.key === location.hash.slice(1).toLowerCase(),
  ); // ทดสอบ: ต่อท้าย URL ด้วย #legendary ฯลฯ
  if (forced) return forced;
  let x = Math.random() * RARITIES.reduce((a, r) => a + r.w, 0);
  for (const r of RARITIES) {
    if ((x -= r.w) < 0) return r;
  }
  return RARITIES[0];
}
function groups_for_order() {
  const m = {};
  state.ings.forEach((o) => {
    const d = INGS.find((x) => x.id === o.id);
    m[d.th] = (m[d.th] || 0) + d.g;
  });
  return Object.entries(m).map(([name, grams]) => ({ name, grams }));
}

$("#bOk").addEventListener("click", () => {
  if (busy || !state.soups.length || !state.ings.length) return;
  busy = true;
  $("#stamp").classList.add("on");
  sfx.done();
  console.log("ORDER", {
    no: orderNo,
    items: groups_for_order(),
    soups: state.soups.slice(),
    spice: SPICE[state.spice],
    sauces: state.sauces.map((s) => s.id),
    total: (
      (state.ings.reduce((a, o) => a + INGS.find((x) => x.id === o.id).g, 0) *
        PRICE_PER_100G) /
      100
    ).toFixed(2),
  }); // <- ส่งเข้าระบบครัว/เครื่องพิมพ์ตรงนี้ได้
  setTimeout(() => {
    $("#stamp").classList.remove("on");
    startBoil();
  }, 1100);
});

function startBoil() {
  play.classList.add("boiling");
  const box = $("#potFood"),
    fx = $("#potFx"),
    n = state.ings.length,
    stag = Math.min(220, 2400 / n);
  let landed = 0;
  box.innerHTML = "";
  fx.innerHTML = "";
  state.ings.forEach((o, i) => {
    const d = INGS.find((x) => x.id === o.id),
      th = Math.random() * 6.283,
      rr = Math.sqrt(Math.random()) * 0.85;
    const lx = 50.2 + Math.cos(th) * rr * 30,
      ly = 47 + Math.sin(th) * rr * 22,
      rot = d.piece ? radialAngle(lx, ly) : o.rot;
    o.depth = pickDepth(d.id); // 0 ลอย · 1 จมครึ่ง · 2 จมมิด (จมจริงตอนต้ม)
    const w = document.createElement("div");
    w.className =
      "pc" + (d.piece ? "" : " old") + (o.depth === 1 ? " half" : "");
    w.dataset.id = d.id;
    w.style.cssText = `left:${lx}%;top:${ly}%;width:${d.pw * 0.9}px;z-index:${i};visibility:hidden`;
    const im = document.createElement("img");
    im.src = ASSETS[d.piece || d.food];
    im.style.cssText = `transform:rotate(${rot}deg);filter:${DSP} ${cookFilter(null, true)}`;
    w.appendChild(im);
    box.appendChild(w);
    if (d.ripe) {
      const rp = document.createElement("img");
      rp.className = "ripe";
      rp.src = ASSETS[d.ripe];
      rp.style.cssText = `transform:rotate(${rot}deg);opacity:0;filter:${DSP}`;
      w.appendChild(rp);
    }
    setTimeout(
      () => {
        w.style.visibility = "";
        const fall = (ly / 100) * 439 + 340,
          opt = {
            duration: 800 + Math.random() * 250,
            easing: "cubic-bezier(.45,0,.85,.55)",
            fill: "both",
          };
        im.animate(
          [
            { transform: `rotate(${rot - 50}deg)` },
            { transform: `rotate(${rot}deg)` },
          ],
          opt,
        );
        const an = w.animate(
          [
            { transform: `translateY(-${fall}px)`, opacity: 0 },
            { opacity: 1, offset: 0.12 },
            { transform: "none", opacity: 1 },
          ],
          opt,
        );
        an.onfinish = () => {
          an.cancel();
          im.getAnimations().forEach((x) => x.cancel());
          w.classList.add("float");
          const r = document.createElement("div");
          r.className = "rip";
          r.style.left = ((lx - 13.7) / 73) * 100 + "%";
          r.style.top = ((ly - 14.4) / 65.4) * 100 + "%";
          fx.appendChild(r);
          setTimeout(() => r.remove(), 850);
          if (performance.now() - lastPlop > 110) {
            lastPlop = performance.now();
            sfx.ingredient();
          }
          if (++landed === n) setTimeout(boilPhase, 350);
        };
      },
      300 + i * stag,
    );
  });
}
function sinkPiece(w, im, c, ms) {
  // ย้ายสำเนาไปไว้ใต้ชั้นผ้าคลุมซุป แล้วค่อยๆ ให้ของจริงจางหาย = จมลงไปใต้ผิวน้ำ
  const sc = w.cloneNode(true),
    sim = sc.querySelector("img");
  sc.classList.remove("float", "half");
  sc.classList.add("sunk");
  sc.style.opacity = 0;
  sc.style.transition = "opacity 1.1s";
  sim.style.transition = "none";
  sim.style.filter = getComputedStyle(im).filter;
  $("#potSink").appendChild(sc);
  void sc.offsetWidth;
  sim.style.transition = `filter ${Math.max(300, ms * 0.55)}ms ease-in-out`;
  sim.style.filter = `${DSP} ${cookFilter(c, false)}`;
  const orp = w.querySelector("img.ripe"),
    crp = sc.querySelector("img.ripe");
  if (orp && crp) {
    crp.style.transition = "none";
    crp.style.opacity = getComputedStyle(orp).opacity;
    void crp.offsetWidth;
    crp.style.transition = `opacity ${Math.max(300, ms * 0.55)}ms`;
    crp.style.opacity = 1;
    setTimeout(() => {
      sim.style.opacity = 0;
    }, ms + 60);
  }
  sc.style.opacity = 0.88;
  w.style.transition = "opacity 1.1s";
  w.style.opacity = 0;
  setTimeout(() => w.remove(), 1200);
}
function boilPhase() {
  play.classList.add("steaming");
  $("#potSoup").style.setProperty("--bm", BOIL_MS + "ms");
  $("#potSoup").classList.add("boil");
  sfx.boil(BOIL_MS);
  // เปลี่ยนโทนสีวัตถุดิบจากดิบ → สุก (แต่ละชนิดสุกไม่พร้อมกัน) แล้วมีประกายตอนได้ที่
  const dinged = new Set();
  $("#potFood")
    .querySelectorAll(".pc")
    .forEach((w) => {
      const im = w.querySelector("img"),
        c = cookOf(w.dataset.id),
        ms = BOIL_MS * c.t,
        sunk = state.ings[[...w.parentNode.children].indexOf(w)]?.depth === 2;
      im.style.transition = `filter ${ms}ms ease-in-out`;
      im.style.filter = `${DSP} ${cookFilter(c, false)}`;
      const rp = w.querySelector("img.ripe"); // เนื้อ: ค่อยๆ เปลี่ยนเป็นภาพเนื้อสุก
      if (rp) {
        rp.style.transition = `opacity ${ms}ms ease-in-out`;
        rp.style.opacity = 1;
        setTimeout(() => {
          im.style.opacity = 0;
        }, ms + 60);
      }
      if (sunk)
        setTimeout(() => sinkPiece(w, im, c, ms), Math.max(250, ms * 0.45)); // ชิ้นที่จมมิด: ค่อยๆ จมลงใต้ผิวซุปกลางช่วงที่กำลังสุก
      setTimeout(() => {
        if (!sunk) {
          const s = document.createElement("i");
          s.className = "cstar";
          s.style.left = w.style.left;
          s.style.top = w.style.top;
          $("#potFood").appendChild(s);
          setTimeout(() => s.remove(), 950);
        }
        if (!dinged.has(w.dataset.id)) {
          dinged.add(w.dataset.id);
          sfx.ding();
        }
      }, ms);
    });
  const f = $("#boilFill");
  f.style.transition = "none";
  f.style.width = "0";
  void f.offsetWidth;
  f.style.transition = `width ${BOIL_MS}ms linear`;
  f.style.width = "100%";
  const tips = [
      "ผักกำลังสุกอยู่นะ…",
      "น้ำซุปเริ่มเดือดแล้ว",
      "กลิ่นหม่าล่าหอมมาก!",
      "เกือบเสร็จแล้ว…",
    ],
    tip = $("#boilTip");
  tip.textContent = tips[0];
  let k = 0;
  const tt2 = setInterval(() => {
    tip.textContent = tips[Math.min(++k, tips.length - 1)];
  }, BOIL_MS / 4);
  const fx = $("#potFx");
  bubT = setInterval(() => {
    for (let i = 0; i < 2; i++) {
      const b = document.createElement("i");
      b.className = "bub";
      const s = 6 + Math.random() * 14;
      b.style.cssText = `left:${8 + Math.random() * 84}%;top:${10 + Math.random() * 80}%;width:${s}px;height:${s}px`;
      fx.appendChild(b);
      setTimeout(() => b.remove(), 750);
    }
  }, 110);
  setTimeout(() => {
    clearInterval(bubT);
    clearInterval(tt2);
    showResult();
  }, BOIL_MS);
}

/* หน้าผลลัพธ์: ชามหล่นลงมาพร้อมแสง glow ตามระดับ */
/* คำอธิบายชามหน้าผลลัพธ์ = ข้อเท็จจริงจากชามที่ผู้เล่นทำจริง (ซุป·ระดับเผ็ด·วัตถุดิบเด่น) + ประโยคตีความของ type
   ทำให้ข้อความตรงกับสิ่งที่เลือก ไม่พูดถึงของที่ไม่ได้อยู่ในชามหรือไม่มีในเกม */
const SOUP_SHORT = {
  red: "แดงเสฉวน",
  white: "หม่าล่าขาว",
  bone: "กระดูกหมู",
  shabu: "ชาบูดำ",
  milk: "น้ำนม",
}; // ชื่อซุปแบบสั้น (ซุปใหม่ที่ไม่ได้ใส่ใช้ชื่อเต็มจาก SOUPS)
function bowlFacts() {
  const soups = state.soups.map(
    (id) => SOUP_SHORT[id] || (SOUPS.find((s) => s.id === id) || {}).th || id,
  );
  const lv = ["MILD", "MEDIUM", "HOT", "HELL"][state.spice] || "MEDIUM";
  const g = {};
  state.ings.forEach((o) => {
    g[o.id] = (g[o.id] || 0) + INGS.find((x) => x.id === o.id).g;
  });
  const top = Object.entries(g)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => {
      const d = INGS.find((x) => x.id === id);
      return d.rc || d.th;
    });
  const soupTxt =
    soups.length > 2
      ? soups.slice(0, -1).join(" ") + " และ" + soups[soups.length - 1]
      : soups.join("และ");
  return (
    `ชามนี้ใช้ซุป${soupTxt}${state.spiceSet ? " ระดับ " + lv : ""}` +
    (top.length ? ` เน้น${top.join("กับ")}` : "")
  );
}
function fitBowlDesc() {
  // ข้อความยาวเกินกล่อง → ลดขนาดตัวอักษรทีละนิดจนพอดี (ต่ำสุด 20px)
  const el = $("#rBowlDesc");
  el.style.fontSize = "";
  let fs = 27;
  while (el.scrollHeight > el.clientHeight + 1 && fs > 20)
    el.style.fontSize = --fs + "px";
}
/* ============================================================
   ประโยคตีความตามน้ำซุปที่เลือก: ต่อ type × ซุป  (ลำดับ: red, white, bone, shabu, milk)
   เพิ่มซุปใหม่ → ใส่ id ใน SOUP_ORDER แล้วเติมประโยคท้ายแถวของแต่ละ type · ถ้ายังไม่มี ระบบใช้ประโยคตายตัวของ type แทน
   ============================================================ */
const SOUP_ORDER = ["red", "white", "bone", "shabu", "milk"];
const SOUP_LINES = {
  INTJ: [
    "ซุปแดงเสฉวนคือโจทย์ที่คุณคำนวณมาแล้วว่าทนได้ แรงพอจะตื่นแต่ยังคุมเกมในหัวไว้ได้เสมอ",
    "ซุปขาวออริจินัลให้ความชาหอมที่คาดเดาได้ เหมาะกับคนที่ชอบรู้ล่วงหน้าว่าคำต่อไปจะเป็นอย่างไร",
    "ซุปกระดูกหมูใสเรียบสะท้อนสไตล์คุณ ไม่ต้องตกแต่งเยอะ แค่รสลึกที่เชื่อถือได้ก็พอ",
    "ชาบูดำเข้มลึกอ่านยากเหมือนแผนในหัวคุณ คนข้างๆ เดาไม่ออกว่าคุณคิดอะไรอยู่",
    "ซุปน้ำนมคือการตัดสินใจนอกแผนที่หายากของคุณ ภายใต้ความเย็นชามีด้านที่อยากถูกปลอบอยู่ด้วย",
  ],
  INTP: [
    "ซุปแดงเสฉวนคือฐานทดลองที่คุณไว้ใจ แรงพอให้ใส่สูตรลับอะไรลงไปก็ยังเด่น",
    "ซุปขาวออริจินัลเป็นผืนผ้าใบสะอาดของคุณ เปิดทางให้น้ำจิ้มสูตรลับได้โชว์เต็มที่",
    "ซุปกระดูกหมูรสเรียบๆ คือห้องแล็บเงียบๆ ที่คุณอยู่กับความคิดตัวเองได้ทั้งมื้อ",
    "ชาบูดำเป็นของแปลกที่ถูกใจสมองช่างสงสัย คุณคงอยากรู้ว่ามันปรุงมาจากอะไรบ้าง",
    "ซุปน้ำนมคือการทดลองที่คุณอยากลองเป็นคนแรก และน่าจะกินไปจดไปว่ารสออกมาอย่างไร",
  ],
  ENTJ: [
    "ซุปแดงเสฉวนคือสนามรบที่คุณอยากนำทัพ เผ็ดแค่ไหนก็ลุยได้ ยิ่งท้าทายยิ่งสนุก",
    "ซุปขาวออริจินัลช่วยให้รสเนื้อพรีเมียมเด่นขึ้น คุณเลือกซุปด้วยเป้าหมายเสมอ ไม่ใช่แค่ความชอบ",
    "ซุปกระดูกหมูคือฐานที่แน่นพอจะรองรับเนื้อชิ้นใหญ่ คุณวางกลยุทธ์มื้อนี้ไว้ล่วงหน้าแล้ว",
    "ชาบูดำให้ความรู้สึกหรูและทรงอำนาจ เหมาะกับมื้อที่คุณเป็นคนสั่งทั้งโต๊ะ",
    "ซุปน้ำนมเหนือความคาดหมายสำหรับสายเด็ดขาด แต่คุณกล้าลองเพราะรู้ว่าตัวเองควบคุมได้",
  ],
  ENTP: [
    "ซุปแดงเสฉวนยังเป็นแค่จุดเริ่มต้น คุณคงกำลังคิดว่าจะใส่อะไรแปลกๆ ลงไปแล้วจะเกิดอะไรขึ้น",
    "ซุปขาวออริจินัลคือผืนผ้าใบสำหรับไอเดียบ้าๆ ของคุณ ยิ่งผสมแปลกยิ่งสนุก",
    "ซุปกระดูกหมูเป็นฐานสุดคลาสสิกที่คุณไม่ยอมให้เป็นแค่คลาสสิก ต้องมีอะไรป่วนนิดหน่อยแน่",
    "ชาบูดำดูลึกลับถูกใจจอมทดลอง คุณอยากรู้ว่าถ้าจับมันไปชนกับของแปลกจะเป็นอย่างไร",
    "ซุปน้ำนมคือของที่คนส่วนใหญ่ไม่กล้าลอง ซึ่งนั่นเป็นเหตุผลที่คุณเลือกมัน",
  ],
  INFJ: [
    "ซุปแดงเสฉวนคือความร้อนแรงที่คุณเลือกมาถ่วงสมดุลกับความนุ่มนวลข้างในใจ",
    "ซุปขาวออริจินัลคือสมดุลระหว่างความชากับความหอมที่ตรงกับตัวคุณพอดี ไม่โดดเด่นแต่ลึกซึ้ง",
    "ซุปกระดูกหมูให้ความอบอุ่นแบบเงียบๆ เหมือนที่คุณมอบให้คนรอบข้างโดยไม่ต้องบอก",
    "ชาบูดำสะท้อนด้านลึกลับของคุณ ภายนอกสงบแต่ข้างในมีเรื่องราวมากมาย",
    "ซุปน้ำนมคือการเยียวยาที่คุณมอบให้ตัวเองบ้าง หลังจากเอาใจคนอื่นมาทั้งสัปดาห์",
  ],
  INFP: [
    "คุณกล้าเลือกซุปแดงเสฉวนวันนี้ คงมีความรู้สึกอัดอั้นที่อยากให้พริกช่วยปลดปล่อยออกมา",
    "ซุปขาวออริจินัลนุ่มๆ ชาๆ เหมือนเพลงโปรดที่ฟังซ้ำได้ทั้งวัน คุณละเมียดทุกคำ",
    "ซุปกระดูกหมูอุ่นๆ คือกอดที่กินได้ เหมาะกับวันที่ใจเหนื่อยและอยากปลอบตัวเอง",
    "ชาบูดำมีเสน่ห์แบบนิยายลึกลับที่คุณชอบ กินช้าๆ แล้วปล่อยใจล่องลอยไปด้วย",
    "ซุปน้ำนมคือคำตอบของคนที่อยากให้มื้อนี้ปลอบโยนทุกอย่าง นุ่มละมุนสมกับใจของคุณ",
  ],
  ENFJ: [
    "ซุปแดงเสฉวนคือซุปที่คุณเลือกเพื่อให้ทั้งโต๊ะสนุก แล้วแอบเตรียมน้ำเย็นให้เพื่อนไว้ด้วย",
    "ซุปขาวออริจินัลเผ็ดชาพอดีให้ทุกคนกินได้ คุณเลือกรสที่ทั้งโต๊ะจะชอบ ไม่ใช่แค่ตัวเอง",
    "ซุปกระดูกหมูกินง่ายถูกใจทุกวัย คุณคงคอยตักให้คนอื่นก่อนที่จะตักให้ตัวเอง",
    "ชาบูดำเป็นซุปที่คุณชวนเพื่อนลองด้วยกัน แล้วเฝ้าดูสีหน้าว่าจะชอบกันหรือเปล่า",
    "ซุปน้ำนมนุ่มนวลช่วยให้โต๊ะอบอุ่นขึ้น คุณเลือกบรรยากาศของมื้อก่อนรสของตัวเอง",
  ],
  ENFP: [
    "ซุปแดงเสฉวนคือจุดเริ่มต้นของมื้อสุดมันส์ คุณพร้อมหัวเราะทั้งน้ำตาขณะกินพริกแน่นอน",
    "ซุปขาวออริจินัลช่วยให้คุณหยิบของแปลกใหม่ได้เต็มชามโดยรสไม่ตีกัน พลังงานเลยไม่ตก",
    "ซุปกระดูกหมูเป็นฐานสบายๆ ที่คุณเอาไปเล่าเรื่องสนุกกับเพื่อนได้ทั้งมื้อ",
    "ชาบูดำดึงดูดความอยากรู้อยากเห็นของคุณทันที ลองก่อนแล้วค่อยเล่าให้ทุกคนฟัง",
    "ซุปน้ำนมคือของใหม่ที่คุณอยากลองก่อนใคร แล้วต้องถ่ายรูปไปอวดเพื่อนแน่ๆ",
  ],
  ISTJ: [
    "ซุปแดงเสฉวนคือสูตรมาตรฐานที่คุณสั่งซ้ำได้ทุกครั้ง เพราะรู้ว่ารสนี้ไม่เคยทำให้ผิดหวัง",
    "ซุปขาวออริจินัลคือทางเลือกที่ถูกต้อง รสต้นตำรับ ไม่มีเซอร์ไพรส์ ตรงกับที่คุณต้องการ",
    "ซุปกระดูกหมูคือสูตรดั้งเดิมที่คุณไว้ใจ เรียบ มั่นคง และกินกี่ครั้งก็อร่อยเท่าเดิม",
    "ชาบูดำดูแปลกจากปกติ แต่คุณเลือกเพราะอ่านส่วนผสมแล้วเห็นว่าเชื่อถือได้",
    "ซุปน้ำนมคือการออกนอกกรอบครั้งใหญ่ของคุณ ถ้าอร่อยคุณจะจำไว้เป็นสูตรใหม่ที่ไว้ใจได้",
  ],
  ISFJ: [
    "ซุปแดงเสฉวนอาจแรงไปหน่อย แต่คุณคงชดเชยด้วยผักและเต้าหู้เยอะๆ เพื่อดูแลท้องตัวเอง",
    "ซุปขาวออริจินัลเผ็ดชาไม่โหดและกินได้ทั้งครอบครัว เหมาะกับคนที่ใส่ใจทุกคนบนโต๊ะ",
    "ซุปกระดูกหมูคือตัวเลือกของคนรักสุขภาพ อบอุ่น มีคอลลาเจน และอ่อนโยนต่อท้อง",
    "ชาบูดำให้รสเข้มข้นที่คุณชดเชยด้วยผักสดเยอะๆ ให้มื้อนี้สมดุลทั้งอร่อยและดีต่อตัว",
    "ซุปน้ำนมนุ่มละมุนคือการดูแลตัวเองแบบที่คุณมักให้คนอื่น วันนี้ถึงตาคุณบ้างแล้ว",
  ],
  ESTJ: [
    "ซุปแดงเสฉวนคือมาตรฐานของร้านหม่าล่า คุณสั่งตรงไปตรงมาและกินจบตามแผนได้ทั้งมื้อ",
    "ซุปขาวออริจินัลเป็นตัวเลือกที่ทุกคนยอมรับ คุณเลือกอย่างมีเหตุผลและทำให้โต๊ะเดินหน้าได้เร็ว",
    "ซุปกระดูกหมูคือรสที่ไม่ผิดพลาด คุ้มค่า อิ่ม และจัดการง่ายสำหรับมื้อที่ต้องมีประสิทธิภาพ",
    "ชาบูดำดูมีระดับและแตกต่าง แต่คุณเลือกเพราะรู้ว่าคุ้มและพิสูจน์แล้วว่าอร่อย",
    "ซุปน้ำนมไม่ใช่ตัวเลือกประจำของคุณ แต่เมื่อตัดสินใจแล้ว คุณลุยจนหมดชามแน่นอน",
  ],
  ESFJ: [
    "ซุปแดงเสฉวนคือซุปปาร์ตี้ที่คุณชวนเพื่อนมาแชร์ เผ็ดด้วยกันสนุกกว่าเผ็ดคนเดียว",
    "ซุปขาวออริจินัลคือรสที่เพื่อนทุกคนกินได้ คุณเลือกเพราะอยากให้ทุกคนมีความสุขพร้อมกัน",
    "ซุปกระดูกหมูอบอุ่นต้อนรับทุกคน เหมือนบรรยากาศบ้านที่คุณสร้างให้โต๊ะอยู่เสมอ",
    "ชาบูดำเป็นเมนูใหม่ที่คุณชวนทุกคนลองด้วยกัน พร้อมเล่าว่าอร่อยตรงไหนให้ฟัง",
    "ซุปน้ำนมนุ่มๆ เหมาะแชร์ทั้งโต๊ะ คุณคอยตักให้เพื่อนจนซุปเกือบหมดก่อนได้กินเอง",
  ],
  ISTP: [
    "ซุปแดงเสฉวนร้อนจัดไม่ใช่ปัญหา คุณคุมเวลาลวกได้แม่นจนแทบไม่ต้องใช้นาฬิกา",
    "ซุปขาวออริจินัลใสพอให้เห็นการลวกของคุณ เนื้อสุกพอดีโดยไม่ต้องพูดอะไรสักคำ",
    "ซุปกระดูกหมูรสสะอาดช่วยให้เท็กซ์เจอร์ของวัตถุดิบเด่น ตรงกับความละเอียดของคุณ",
    "ชาบูดำคือเครื่องมือชิ้นใหม่ที่คุณอยากลองทดสอบว่าแต่ละชิ้นสุกที่วินาทีไหน",
    "ซุปน้ำนมเป็นของแปลกที่คุณลองเงียบๆ แล้วตัดสินใจเองว่าชอบหรือไม่ โดยไม่ต้องถามใคร",
  ],
  ISFP: [
    "ซุปแดงเสฉวนสีเข้มเป็นพื้นหลังที่ทำให้สีผักในชามเด่นขึ้น เหมือนภาพที่คุณจัดมากับมือ",
    "ซุปขาวออริจินัลคือผืนผ้าใบสีครีม ให้คุณวางสีสันของวัตถุดิบได้อย่างอิสระ",
    "ซุปกระดูกหมูใสสะอาดทำให้ทุกชิ้นในชามดูสวย คุณเลือกจากความรู้สึกมากกว่าเหตุผล",
    "ชาบูดำเข้มลึกขับสีของวัตถุดิบให้โดดเด่น ชามของคุณเหมือนงานศิลปะย่อมๆ",
    "ซุปน้ำนมสีนวลละมุนตาถูกใจคุณมาก ชามนี้อาจได้ถูกถ่ายรูปก่อนที่คุณจะลงมือกิน",
  ],
  ESTP: [
    "ซุปแดงเสฉวนคือคำตอบเดียวของคนชอบเผ็ดดุ พริกยิ่งเยอะยิ่งดี ยิ่งชายิ่งมันส์",
    "ซุปขาวออริจินัลก็ไม่หลบ คุณเติมน้ำมันหม่าล่าเพิ่มจนรสแรงสมใจเหมือนซุปแดง",
    "ซุปกระดูกหมูเป็นแค่ฐานให้คุณเติมพริกต่อ เพราะรสอ่อนๆ ไม่พอสำหรับคุณ",
    "ชาบูดำคือความท้าทายใหม่ที่คุณพร้อมลุย ยังไม่ทันถามว่ามันคืออะไรก็สั่งไปแล้ว",
    "ซุปน้ำนมนุ่มเกินคาดสำหรับสายลุย แต่คุณกล้าลองเพราะไม่มีอะไรที่คุณไม่กล้าทำ",
  ],
  ESFP: [
    "ซุปแดงเสฉวนสีสดจัดจ้านถูกใจตัวตึง ทั้งโต๊ะรู้ว่าคุณมาถึงแล้วตั้งแต่ซุปยังไม่ทันเดือด",
    "ซุปขาวออริจินัลเป็นฉากหลังให้ชามอลังการของคุณ เครื่องเยอะแค่ไหนก็ยังดูดี",
    "ซุปกระดูกหมูพร้อมรับทุกท็อปปิ้งที่คุณใส่ เป็นเวทีที่ทำให้ชามคุณเป็นดาวเด่น",
    "ชาบูดำสร้างภาพถ่ายสวยแถมรสเข้มข้นให้ได้เล่าต่อ ไม่ผิดหวังสำหรับสายเอนเตอร์เทน",
    "ซุปน้ำนมสีครีมสวยถ่ายรูปขึ้น คุณเลือกเพราะอยากให้มื้อนี้ทั้งอร่อยและเป็นที่พูดถึง",
  ],
};
const SOUP_MIX =
  "หม้อสองรสของคุณคือการจับคู่สิ่งตรงข้ามให้อยู่ร่วมกันได้อย่างลงตัว ไม่ต้องเลือกฝั่งใดฝั่งหนึ่งก็อร่อยครบ";
function soupLine(type) {
  if (state.soups.length > 1) return SOUP_MIX;
  const i = SOUP_ORDER.indexOf(state.soups[0]),
    row = SOUP_LINES[type];
  return (row && i >= 0 && row[i]) || "";
}

function showResult() {
  countBowl(); // นับถ้วยที่สร้างเสร็จ (เก็บแค่จำนวน ไม่เก็บรายละเอียด)
  const res = MBTI.calc(
    state,
    Object.fromEntries(INGS.map((d) => [d.id, d.g])),
  ); // ผล MBTI จากชามจริง
  const forced = location.hash.slice(1).toUpperCase(),
    type = MBTI_DATA[forced] ? forced : res.type,
    info = MBTI_DATA[type]; // ทดสอบ: ต่อท้าย URL ด้วย #INFJ ฯลฯ
  const r = RARITIES[res.tier];
  r.color = info.colors.secondary; // ใช้เอฟเฟกต์ glow ตามความเข้มของสไตล์ สีตามชนิด
  play.classList.remove("boiling", "steaming");
  $("#potSoup").classList.remove("boil");
  play.dataset.rarity = r.key;
  play.dataset.mbti = type;
  play.style.setProperty("--rc", r.color);
  play.style.setProperty("--gi", r.gi);
  play.style.setProperty("--ri", r.ri);
  buildSparks(r);
  $("#rTitle").textContent = info.title;
  $("#rEn").textContent = info.englishTitle;
  $("#rTags").innerHTML = info.tags
    .map((t) => `<span>${t.replace("#", "")}</span>`)
    .join("");
  $("#rBowlDesc").textContent =
    bowlFacts() + " " + (soupLine(type) || info.bowlDescription.join(" "));
  $("#rPers").textContent = info.personalityDescription.join(" ");
  // ประโยคตีความตาม type × ซุป (ไม่มีข้อมูล → ใช้ประโยคตายตัวเดิม) $('#rPers').textContent = info.personalityDescription.join(' ');
  [...$("#foodLayer").children].forEach((w, k) => {
    const o = state.ings[k];
    if (!o) return; // ในชามเสิร์ฟ: สีสุกแล้ว + จมตามที่ต้มมา
    w.style.animation = "none";
    w.querySelector("img").style.filter =
      `${DSB} ${cookFilter(cookOf(o.id), false)}`;
    const dd = INGS.find((x) => x.id === o.id);
    if (dd.ripe) w.querySelector("img").src = ASSETS[dd.ripe]; // เนื้อสุกในชามเสิร์ฟ
    if (o.depth === 1) w.classList.add("half");
    else if (o.depth === 2) {
      w.classList.add("sunk");
      $("#sinkLayer").appendChild(w);
    }
  });
  setView("result");
  requestAnimationFrame(fitBowlDesc);
  bowls.classList.remove("dropin");
  void bowls.offsetWidth;
  bowls.classList.add("dropin");
  ["#rHead", "#rTitle", "#rEn"].forEach((s) => {
    $(s).classList.remove("pop");
    void $(s).offsetWidth;
    $(s).classList.add("pop");
  });
  sfx.reveal(res.tier);
  console.log("RESULT", {
    no: orderNo,
    type,
    tier: res.tier,
    spice: SPICE[state.spice],
    axes: res.axes,
  });
  setTimeout(() => {
    bowls.classList.remove("dropin");
    busy = false;
  }, 1500);
}
function buildSparks(r) {
  const tier = RARITIES.indexOf(r),
    cols =
      tier >= 4
        ? ["#F1C40F", "#ffe27a", "#fff", "#ff9ad5", "#7be8ff"]
        : tier >= 3
          ? [r.color, "#fff", "#c58be0"]
          : [r.color, "#fff"];
  let h = "";
  for (let i = 0; i < r.n; i++) {
    const a = Math.random() * 6.283,
      rad = 200 + Math.random() * 320,
      x = Math.cos(a) * rad * 1.55,
      y = Math.sin(a) * rad * 0.8 - 40,
      s = 14 + Math.random() * (18 + tier * 5);
    h += `<i style="--x:${x}px;--y:${y}px;--s:${s}px;--c:${cols[i % cols.length]};--t:${1.8 + Math.random() * 1.8}s;--d:${(0.6 + Math.random() * 2.5).toFixed(2)}s"></i>`;
  }
  if (tier >= 3)
    for (let i = 0; i < r.n; i++) {
      const x = (Math.random() - 0.5) * 900,
        y = 60 + Math.random() * 220,
        s = 5 + Math.random() * 7;
      h += `<i class="dot" style="--x:${x}px;--y:${y}px;--s:${s}px;--c:${cols[i % cols.length]};--t:${2.4 + Math.random() * 2}s;--d:${(Math.random() * 3).toFixed(2)}s"></i>`;
    }
  $("#sparks").innerHTML = h;
}

/* สั่งออเดอร์ใหม่: เลขออเดอร์ถัดไป, ใบออเดอร์ขยายกลับมาด้านซ้าย, ชามชุดใหม่เลื่อนเข้ามา */
$("#bAgain").addEventListener("click", () => {
  if (busy) return;
  busy = true;
  sfx.reset();
  orderNo++;
  try {
    localStorage.setItem("malatang_order", orderNo);
  } catch (e) {}
  clearOrder();
  bowls.style.transition = "none";
  bowls.style.transform = "translateX(-1300px)";
  void bowls.offsetWidth;
  bowls.style.transition = "transform .85s cubic-bezier(.15,.8,.3,1)";
  bowls.style.transform = "none";
  setTimeout(() => {
    busy = false;
  }, 900);
});

let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("on"), 1400);
}
setView("main");

/* ---------- Spicy Level ---------- */
const SPICE = ["MILD", "MEDIUM", "HOT", "HELL"];
function renderSpice() {
  renderReceipt();
  $("#spLv").textContent = SPICE[state.spice];
  $("#spLv").dataset.l = state.spice;
  document
    .querySelectorAll("#spice .fl")
    .forEach((b, i) => b.classList.toggle("on", i <= state.spice));
}
document.querySelectorAll("#spice .fl").forEach((b, i) =>
  b.addEventListener("click", () => {
    if (state.spiceSet && state.spice === i) return;
    state.spice = i;
    state.spiceSet = true;
    renderSpice();
    sfx.sauce();
  }),
);
renderSpice();
/* ---------- บันทึกภาพผลลัพธ์แนวตั้ง 1080x1920 (IG Story) — วาดลง canvas เองทั้งหมด ไม่ต้องโหลดไลบรารีเพิ่ม ---------- */
document.getElementById("bSave").addEventListener("click", async () => {
  const btn = document.getElementById("bSave");
  const origHTML = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = "กำลังสร้างภาพ...";

  try {
    await document.fonts.ready;

    // 1. สร้าง Canvas ขนาด IG Story (1080 x 1920)
    const W = 1080,
      H = 1920;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");

    // ตัวช่วยโหลดรูปจาก src (รองรับทั้ง data URI และ URL)
    const loadImg = (src) =>
      new Promise((res) => {
        if (!src) return res(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
      });

    // ตัวช่วยวาดสี่เหลี่ยมมุมมน
    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    // ตัวช่วยตัดบรรทัดภาษาไทย (ใช้ Intl.Segmenter ถ้าเบราว์เซอร์รองรับ)
    const wrapThai = (text, maxW) => {
      const segs =
        typeof Intl !== "undefined" && Intl.Segmenter
          ? [
              ...new Intl.Segmenter("th", { granularity: "word" }).segment(
                text,
              ),
            ].map((s) => s.segment)
          : text.split("");
      const lines = [];
      let line = "";
      for (const word of segs) {
        const test = line + word;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line.trim());
          line = word.trimStart();
        } else {
          line = test;
        }
      }
      if (line.trim()) lines.push(line.trim());
      return lines;
    };

    // 2. พื้นหลังสีแดงเข้ม (#4A0E0E) + ลายคลื่นญี่ปุ่น (Seigaiha) แบบในเกม
    ctx.fillStyle = "#4A0E0E";
    ctx.fillRect(0, 0, W, H);

    // สร้างแพทเทิร์นลายคลื่นแบบเดียวกับ CSS --tile
    const pCv = document.createElement("canvas");
    pCv.width = 180;
    pCv.height = 180;
    const pCtx = pCv.getContext("2d");
    pCtx.strokeStyle = "rgba(255, 255, 255, 0.045)";
    pCtx.lineWidth = 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cx = col * 90 + (row % 2 ? 45 : 0);
        const cy = row * 45 + 45;
        [44, 32, 20, 9].forEach((r) => {
          pCtx.beginPath();
          pCtx.arc(cx, cy, r, Math.PI, 0);
          pCtx.stroke();
        });
      }
    }
    const pat = ctx.createPattern(pCv, "repeat");
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);

    // 3. แสงรอบชามเหมือนในเกม: แสงฟุ้ง + ลำแสง (+ ลำแสงสายรุ้งตอน Epic/Legendary) + ประกายดาว/ฝุ่นแสง
    //    สีและความแรงอ่านจากตัวแปรของเกม (--rc, --gi, --ri) และประกายอ่านจาก #sparks ที่เกมสุ่มไว้
    {
      const playEl = document.getElementById("play"),
        cs = getComputedStyle(playEl);
      const gi = parseFloat(cs.getPropertyValue("--gi")) || 0.4,
        ri = parseFloat(cs.getPropertyValue("--ri")) || 0.2;
      const tier = ["common", "uncommon", "rare", "epic", "legendary"].indexOf(
        playEl.dataset.rarity,
      );
      const probe = document.createElement("canvas").getContext("2d");
      probe.fillStyle = cs.getPropertyValue("--rc").trim() || "#ff7a2f"; // แปลงสีรูปแบบใดก็ได้เป็น #rrggbb
      const toRgb = (h) =>
        /^#[0-9a-f]{6}$/i.test(h)
          ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
          : [255, 122, 47];
      const rgb = toRgb(probe.fillStyle),
        rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      const SC0 = 1.12,
        gx = 540,
        gy = 594,
        TAU = Math.PI * 2; // จุดศูนย์กลางแสง (สูงกว่ากลางชามเล็กน้อย เหมือนในเกม)

      // 3.1 แสงฟุ้งวงรี
      ctx.save();
      ctx.translate(gx, gy);
      ctx.scale(1, 680 / 960);
      const R0 = 434 * SC0,
        core = ctx.createRadialGradient(0, 0, 0, 0, 0, R0);
      core.addColorStop(0, rgba(rgb, 1));
      core.addColorStop(1, rgba(rgb, 0));
      ctx.globalAlpha = Math.min(1, gi);
      ctx.fillStyle = core;
      ctx.fillRect(-R0, -R0, R0 * 2, R0 * 2);
      ctx.restore();

      // 3.2 ลำแสง (ซี่ 4° เว้น 10° วนรอบ) จางลงตามระยะ
      const wedge = (c, from, to, R, alpha, a0, a1) => {
        const g = ctx.createRadialGradient(gx, gy, from, gx, gy, R);
        g.addColorStop(0, rgba(c, 1));
        g.addColorStop(1, rgba(c, 0));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.arc(gx, gy, R, (a0 * Math.PI) / 180, (a1 * Math.PI) / 180);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      for (let a = 0; a < 360; a += 14)
        wedge(rgb, 66 * SC0, 640 * SC0, ri, a, a + 4);
      if (tier >= 3) {
        // Epic / Legendary: ลำแสงสายรุ้ง ชมพู-ฟ้า-เหลือง
        [
          [[255, 143, 211], 7],
          [[123, 232, 255], 24],
          [[255, 226, 122], 41],
        ].forEach(([c, off]) => {
          for (let a = 0; a < 360; a += 51)
            wedge(c, 66 * SC0, 640 * SC0, 0.38, a + off, a + off + 3);
        });
      }

      // 3.3 ประกายดาวและฝุ่นแสง (ตำแหน่ง/ขนาด/สีเดียวกับที่เกมสุ่ม; บีบแนวนอนให้พอดีภาพแนวตั้ง)
      document.querySelectorAll("#sparks i").forEach((el) => {
        const st = el.style,
          x = parseFloat(st.getPropertyValue("--x")),
          y = parseFloat(st.getPropertyValue("--y")),
          s = parseFloat(st.getPropertyValue("--s")),
          c = st.getPropertyValue("--c").trim() || "#fff";
        if ([x, y, s].some(Number.isNaN)) return;
        const sz = s * SC0;
        ctx.save();
        ctx.translate(gx + x * SC0 * 0.62, gy + y * SC0);
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.88;
        ctx.shadowColor = c;
        if (el.classList.contains("dot")) {
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(0, 0, sz / 2, 0, TAU);
          ctx.fill();
        } else {
          ctx.shadowBlur = 8;
          ctx.beginPath();
          [
            [0, -0.5],
            [0.12, -0.12],
            [0.5, 0],
            [0.12, 0.12],
            [0, 0.5],
            [-0.12, 0.12],
            [-0.5, 0],
            [-0.12, -0.12],
          ].forEach(([px, py], i) =>
            i ? ctx.lineTo(px * sz, py * sz) : ctx.moveTo(px * sz, py * sz),
          );
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
    }

    // 4. ส่วนหัว: "หม่าล่าประจำตัว / ของคุณคือ…"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '500 44px "Kanit", sans-serif';
    ctx.lineJoin = "round";
    ctx.lineWidth = 11;
    ctx.strokeStyle = "#CF4513";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeText("หม่าล่าประจำตัว", 540, 74);
    ctx.fillText("หม่าล่าประจำตัว", 540, 74);
    ctx.strokeText("ของคุณคือ…", 540, 120);
    ctx.fillText("ของคุณคือ…", 540, 120);

    // 5. แถบชื่อฉายาภาษาไทย (พื้นส้ม #CF4513)
    const titleText = document.getElementById("rTitle").textContent.trim();
    ctx.font = '500 48px "Kanit", sans-serif';
    const titleW = Math.max(460, ctx.measureText(titleText).width + 64);
    ctx.fillStyle = "#CF4513";
    ctx.fillRect(540 - titleW / 2, 165, titleW, 86);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(titleText, 540, 209);

    // 6. ชื่อฉายาภาษาอังกฤษ (ขอบดำ)
    const enText = document.getElementById("rEn").textContent.trim();
    ctx.font = '600 42px "Fredoka", sans-serif';
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeText(enText, 540, 282);
    ctx.fillText(enText, 540, 282);

    // 7. วาดชามหม่าล่า + น้ำซุป + วัตถุดิบทั้งหมดที่ผู้เล่นจัดไว้จริงในหน้าผลลัพธ์
    const bowlEl = document.getElementById("bowl");
    const bW = 560,
      bH = 431; // ขยายจาก 500x385 เป็น 1.12 เท่า
    const bX = 540 - bW / 2,
      bY = 395;

    // 7.1 ตัวชามเปล่า
    const bowlImg = await loadImg(document.getElementById("bowlImg").src);
    if (bowlImg) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 16;
      ctx.drawImage(bowlImg, bX, bY, bW, bH);
      ctx.restore();
    }

    // 7.2 ชั้นน้ำซุปในชาม (Clip เป็นวงรีตรงปากชาม)
    const soupEl = document.getElementById("soupLayer");
    if (soupEl.classList.contains("on")) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        bX + bW * (0.083 + 0.42),
        bY + bH * (0.136 + 0.334),
        bW * 0.42,
        bH * 0.334,
        0,
        0,
        Math.PI * 2,
      );
      ctx.clip();

      // ดึงรูปพื้นผิวซุปทุกชั้นที่อยู่ใน #soupLayer
      const txEls = soupEl.querySelectorAll(".tx");
      for (const tx of txEls) {
        const bg = tx.style.backgroundImage;
        const m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
        if (m && m[1]) {
          const sImg = await loadImg(m[1]);
          if (sImg) {
            ctx.save();
            ctx.globalAlpha = parseFloat(getComputedStyle(tx).opacity) || 1;
            ctx.drawImage(
              sImg,
              bX + bW * 0.08,
              bY + bH * 0.13,
              bW * 0.84,
              bH * 0.68,
            );
            ctx.restore();
          }
        }
      }
      ctx.restore();
    }

    // 7.3 ชั้นวัตถุดิบที่จม (#sinkLayer) + ผ้าคลุมซุป (#bowlVeil) + วัตถุดิบลอย (#foodLayer)
    //  - ขนาดชิ้นในเกมเป็น px ของชาม 500px → คูณ SC ให้เท่ากับชามในภาพ
    //  - ใช้สีสุกเดียวกับที่เห็นในเกม (อ่านจาก filter ของรูป) · ชิ้นจมครึ่งมีมาสก์ระดับน้ำ
    const SC = bW / 500;
    const hasFilter = "filter" in ctx; // Safari บางเวอร์ชันไม่รองรับ ctx.filter → ใช้เงาแทน
    const drawFoodPieces = async (container, isSunk) => {
      for (const pc of container.querySelectorAll(".pc")) {
        const imgEl = pc.querySelector("img");
        if (!imgEl) continue;
        const fImg = await loadImg(imgEl.src);
        if (!fImg) continue;

        const px = bX + bW * (parseFloat(pc.style.left) / 100);
        const pw = parseFloat(pc.style.width) * SC;
        const ph = pw * (fImg.naturalHeight / fImg.naturalWidth);
        const rm = (imgEl.style.transform || "").match(
          /rotate\(([-\d.]+)deg\)/,
        );
        const rad = rm ? (parseFloat(rm[1]) * Math.PI) / 180 : 0;
        const half = pc.classList.contains("half");
        const py =
          bY +
          bH * (parseFloat(pc.style.top) / 100) +
          (isSunk ? 9 * SC : half ? 8 * SC : 0);
        const cooked = (imgEl.style.filter || "").replace(
          /drop-shadow\((?:[^()]|\([^)]*\))*\)\s*/,
          "",
        );

        ctx.save();
        if (isSunk) {
          ctx.globalAlpha = 0.88;
          if (hasFilter)
            ctx.filter = `${cooked} blur(1px) brightness(0.78) saturate(0.7) sepia(0.25)`;
        } else if (hasFilter) {
          ctx.filter = `drop-shadow(0 ${6 * SC}px ${6 * SC}px rgba(0,0,0,0.45)) ${cooked}`;
        } else {
          ctx.shadowColor = "rgba(0,0,0,0.42)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 6;
        }

        if (half) {
          // จมครึ่ง: วาดชิ้นที่หมุนแล้วลง canvas ชั่วคราว แล้วไล่ความโปร่งใสส่วนล่างเป็นเส้นระดับน้ำแนวนอน
          const S = Math.ceil(Math.hypot(pw, ph)) + 8;
          const t = document.createElement("canvas");
          t.width = t.height = S;
          const g = t.getContext("2d");
          g.translate(S / 2, S / 2);
          g.rotate(rad);
          g.drawImage(fImg, -pw / 2, -ph / 2, pw, ph);
          g.setTransform(1, 0, 0, 1, 0, 0);
          const top = S / 2 - ph / 2,
            mg = g.createLinearGradient(0, top, 0, top + ph);
          mg.addColorStop(0, "#000");
          mg.addColorStop(0.46, "#000");
          mg.addColorStop(0.64, "rgba(0,0,0,0.45)");
          mg.addColorStop(0.84, "rgba(0,0,0,0)");
          mg.addColorStop(1, "rgba(0,0,0,0)");
          g.globalCompositeOperation = "destination-in";
          g.fillStyle = mg;
          g.fillRect(0, 0, S, S);
          ctx.drawImage(t, px - S / 2, py - S / 2);
        } else {
          ctx.translate(px, py);
          ctx.rotate(rad);
          ctx.drawImage(fImg, -pw / 2, -ph / 2, pw, ph);
        }
        ctx.restore();
      }
    };

    await drawFoodPieces(document.getElementById("sinkLayer"), true);

    const veilBg =
      document.getElementById("bowlVeil").style.background ||
      getComputedStyle(document.getElementById("bowlVeil")).backgroundColor;
    if (veilBg && veilBg !== "transparent" && veilBg !== "rgba(0, 0, 0, 0)") {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        bX + bW * 0.503,
        bY + bH * 0.47,
        bW * 0.42,
        bH * 0.334,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = veilBg;
      ctx.fill();
      ctx.restore();
    }

    await drawFoodPieces(document.getElementById("foodLayer"), false);

    // 8. แถบ Hashtags 3 อันใต้ชาม (#สมดุล #เข้าใจผู้อื่น #อบอุ่น ฯลฯ)
    const tagEls = [...document.querySelectorAll("#rTags span")];
    const tags = tagEls.map((el) => el.textContent.trim().replace(/^#/, ""));
    ctx.font = '400 36px "Kanit", sans-serif';
    const tagGap = 24;
    const tagBoxes = tags.map((t) => ({
      text: t,
      w: ctx.measureText(t).width + 38,
      h: 60,
    }));
    const totalTagW =
      tagBoxes.reduce((s, b) => s + b.w, 0) +
      tagGap * Math.max(0, tagBoxes.length - 1);
    let curTagX = 540 - totalTagW / 2;
    const tagY = 852;

    tagBoxes.forEach((b) => {
      ctx.fillStyle = "#CF4513";
      ctx.fillRect(curTagX, tagY, b.w, b.h);
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(b.text, curTagX + b.w / 2, tagY + b.h / 2 + 2);
      curTagX += b.w + tagGap;
    });

    // 9. กล่องคำอธิบายชาม (พื้นครีม #FBF3EA มุมมน)
    const boxX = 76,
      boxY = 955,
      boxW = 928,
      boxH = 225;
    ctx.fillStyle = "#FBF3EA";
    roundRect(boxX, boxY, boxW, boxH, 54);
    ctx.fill();

    const bowlDesc = document.getElementById("rBowlDesc").textContent.trim();
    ctx.font = '400 32px "Kanit", sans-serif';
    ctx.fillStyle = "#2A1A14";
    ctx.textAlign = "center";
    const descLines = wrapThai(bowlDesc, boxW - 84);
    const descLH = 46;
    const descStartY = boxY + boxH / 2 - ((descLines.length - 1) * descLH) / 2;
    descLines.forEach((ln, idx) => {
      ctx.fillText(ln, 540, descStartY + idx * descLH);
    });

    // 10. โซนล่างซ้าย: ใบเสร็จ (Receipt)
    const rcX = 76,
      rcY = 1230,
      rcW = 356,
      rcH = 620;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(rcX, rcY, rcW, rcH);
    ctx.restore();

    // ลายแถบสลับสีครีม-ขาวตรงส่วนรายการวัตถุดิบในใบเสร็จ
    const listTop = rcY + 148;
    const listH = 258;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rcX, listTop, rcW, listH);
    ctx.clip();
    for (let y = listTop, idx = 0; y < listTop + listH; y += 86, idx++) {
      ctx.fillStyle = idx % 2 === 0 ? "#F9F1E6" : "#FFFFFF";
      ctx.fillRect(rcX, y, rcW, 86);
    }
    ctx.restore();

    // พื้นหลังช่องรูปซุปในใบเสร็จ
    ctx.fillStyle = "#F9F1E6";
    ctx.fillRect(rcX, rcY + 486, rcW, 78);

    // โลโก้ + Order Number ในใบเสร็จ
    const logoImg = await loadImg(document.getElementById("logo").src);
    if (logoImg) {
      ctx.drawImage(logoImg, rcX + rcW / 2 - 48, rcY + 10, 96, 68);
    }
    ctx.fillStyle = "#222222";
    ctx.textAlign = "center";
    ctx.font = '700 20px "Courier Prime", monospace';
    ctx.fillText("Order Number:", rcX + rcW / 2, rcY + 96);
    ctx.fillText(
      document.getElementById("rcNo").textContent.trim(),
      rcX + rcW / 2,
      rcY + 120,
    );

    // รายการวัตถุดิบในใบเสร็จ (สูงสุด 8 บรรทัด)
    const rows = [...document.querySelectorAll("#rcRows .rr")].slice(0, 8);
    rows.forEach((rr, i) => {
      const ry = listTop + 18 + i * 30;
      const thName = rr.children[0]?.textContent.trim() || "";
      const grText = rr.children[1]?.textContent.trim() || "";
      ctx.textAlign = "left";
      ctx.font = '400 18px "Kanit", sans-serif';
      ctx.fillText(thName, rcX + 22, ry);
      ctx.textAlign = "right";
      ctx.font = '700 18px "Courier Prime", monospace';
      ctx.fillText(grText, rcX + rcW - 22, ry);
    });

    // รูปน้ำจิ้มในใบเสร็จ
    const sauceImgs = [...document.querySelectorAll("#rcSauce img")];
    if (sauceImgs.length) {
      const step = rcW / (sauceImgs.length + 1);
      for (let i = 0; i < sauceImgs.length; i++) {
        const sImg = await loadImg(sauceImgs[i].src);
        if (sImg)
          ctx.drawImage(sImg, rcX + step * (i + 1) - 32, rcY + 414, 64, 64);
      }
    }

    // รูปน้ำซุปในใบเสร็จ
    const soupImgs = [...document.querySelectorAll("#rcSoup img")];
    if (soupImgs.length) {
      const step = rcW / (soupImgs.length + 1);
      for (let i = 0; i < soupImgs.length; i++) {
        const sImg = await loadImg(soupImgs[i].src);
        if (sImg)
          ctx.drawImage(sImg, rcX + step * (i + 1) - 36, rcY + 489, 72, 72);
      }
    }

    // ยอดรวม Total ด้านล่างใบเสร็จ
    ctx.fillStyle = "#222222";
    ctx.font = '700 22px "Courier Prime", monospace';
    ctx.textAlign = "left";
    if (state.spiceSet) ctx.fillText("Spicy Level :", rcX + 22, rcY + 592);
    ctx.textAlign = "right";
    if (state.spiceSet)
      ctx.fillText(
        document.getElementById("rcTotal").textContent.trim(),
        rcX + rcW - 22,
        rcY + 592,
      );

    // 11. โซนล่างขวา: คำอธิบายนิสัย (Personality) + โลโก้ Mala Tang + Created By Wrt
    const persText = document.getElementById("rPers").textContent.trim();
    ctx.font = '400 30px "Kanit", sans-serif';
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    const persLines = wrapThai(persText, 535);
    persLines.forEach((ln, idx) => {
      ctx.fillText(ln, 468, 1252 + idx * 45);
    });

    // โลโก้มุมขวาล่าง
    if (logoImg) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(logoImg, 585, 1625, 250, 178);
      ctx.restore();
    }

    // เครดิต Created By Wrt
    ctx.font = '500 32px "Fredoka", sans-serif';
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.fillText("Created By Wrt", 965, 1835);

    // 12. ดาวน์โหลดเป็นไฟล์ PNG
    const mbtiCode = document.getElementById("play").dataset.mbti || "MalaTang",
      fname = `MalaTang-${mbtiCode}-Story.png`;
    const dl =
      window.claude && claude.use ? await claude.use("downloads") : null; // บนหน้า Artifact ต้องบันทึกผ่านระบบของแพลตฟอร์ม
    if (dl) {
      const blob = await new Promise((r) => cv.toBlob(r, "image/png"));
      await dl.save({ filename: fname, data: blob });
    } else {
      const link = document.createElement("a");
      link.download = fname;
      link.href = cv.toDataURL("image/png");
      link.click();
    }
  } catch (err) {
    console.error(err);
    if (typeof toast === "function" && !(err && err.code === "declined"))
      toast("บันทึกภาพไม่สำเร็จ");
  } finally {
    btn.disabled = false;
    btn.innerHTML = origHTML;
  }
});

/* ============================================================
   หน้าเริ่มเกม: ถ้วยสุ่ม 5 ใบเลื่อนขวา→ซ้ายแบบ linear loop + ตัวนับจำนวนถ้วยที่ถูกสร้าง
   ============================================================ */
const stFmt = (n) => String(Math.max(0, n | 0)).padStart(5, "0");
async function getCount() {
  try {
    const res = await fetch("/api/count");
    const data = await res.json();
    if (typeof data.count === "number") return data.count;
  } catch (e) {}
  try {
    return +localStorage.getItem("malatang_bowls") || 0;
  } catch (e) {
    return 0;
  }
}
async function countBowl() {
  try {
    localStorage.setItem(
      "malatang_bowls",
      (+localStorage.getItem("malatang_bowls") || 0) + 1,
    );
  } catch (e) {}
  try {
    const res = await fetch("/api/count", { method: "POST" });
    const data = await res.json();
    if (typeof data.count === "number") {
      $("#stN").textContent = stFmt(data.count);
      return;
    }
  } catch (e) {}
  $("#stN").textContent = stFmt(await getCount());
}
getCount().then((n) => ($("#stN").textContent = stFmt(n)));

function miniBowl() {
  // ถ้วยสุ่ม: ซุป 1 ชนิด + วัตถุดิบ 5–7 ชิ้น วางในวงซุปแบบเดียวกับในเกม
  const soup = SOUPS[Math.floor(Math.random() * SOUPS.length)].id,
    pool = INGS.filter((d) => d.piece),
    n = 5 + Math.floor(Math.random() * 3);
  const el = document.createElement("div");
  el.className = "cb";
  el.innerHTML =
    '<div class="cbi"><div class="aura"></div><img class="bi" alt=""><div class="sl soupsurf"></div><div class="fd"></div></div>';
  el.querySelector(".bi").src = ASSETS.bowl;
  buildSoup(el.querySelector(".sl"), [soup], true);
  const types = Object.values(MBTI_DATA),
    t = types[Math.floor(Math.random() * types.length)],
    rnd = (a, b) => a + Math.random() * (b - a),
    au = el.querySelector(".aura");
  au.style.cssText = `--ac:${t.colors.secondary};--ai:${rnd(0.6, 0.95).toFixed(2)};--ad:${rnd(2.6, 5.2).toFixed(1)}s;--adel:-${rnd(0, 4).toFixed(1)}s;--as:${rnd(1.02, 1.18).toFixed(2)};--ar:${rnd(16, 30).toFixed(0)}s`;
  if (Math.random() < 0.6) au.classList.add("rays");
  if (Math.random() < 0.5) au.classList.add("rv");
  const fd = el.querySelector(".fd");
  for (let k = 0; k < n; k++) {
    const d = pool[Math.floor(Math.random() * pool.length)],
      x = 30 + Math.random() * 40,
      y = 28 + Math.random() * 34;
    const w = document.createElement("div");
    w.className = "pc";
    w.style.cssText = `left:${x}%;top:${y}%;width:${d.pw}px;z-index:${Math.round(y * 10) + k}`;
    const im = document.createElement("img");
    im.src = ASSETS[d.piece];
    im.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    w.appendChild(im);
    fd.appendChild(w);
  }
  return el;
}
(function initStart() {
  $("#stLogo").src = ASSETS.logo;
  $("#start").style.setProperty(
    "--tile",
    getComputedStyle(play).getPropertyValue("--tile"),
  );
  const track = $("#stTrack"),
    five = Array.from({ length: 5 }, miniBowl);
  five.forEach((b) => track.appendChild(b));
  five.forEach((b) => track.appendChild(b.cloneNode(true))); // ชุดที่ 2 = สำเนา ให้วนต่อเนื่องไม่กระตุก
  $("#stGo").addEventListener("click", () => {
    try {
      sfx.sauce();
    } catch (e) {}
    $("#start").classList.add("out");
    setTimeout(() => ($("#start").style.display = "none"), 650);
  });
})();

renderReceipt(); // ซ่อนแถว Spicy Level จนกว่าจะเลือก
