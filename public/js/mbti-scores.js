/* ============================================================
   mbti-scores.js — ตารางแต้ม MBTI + ฟังก์ชันคำนวณผลของ Mala Tang

   วิธีเพิ่มวัตถุดิบ/ซุป/ซอสใหม่ในอนาคต (ทำแค่ 2 ขั้น):
     1) เพิ่ม 1 บรรทัดใน SCORES.<ing|soup|sauce>   (ไม่ใส่ก็ได้ — ดู "ถ้าลืมใส่" ด้านล่าง)
     2) เพิ่ม 1 บรรทัดใน CATEGORY                   (เฉพาะวัตถุดิบ: veg / protein / tofu / noodle)
   แล้วรัน  node sim-mbti.js ../index.html  เพื่อเช็กว่าการกระจายของ 16 type ยังสมดุล

   ถ้าลืมใส่แต้ม: ตัวนั้นจะใช้แต้มตั้งต้นของหมวด (CATEGORY_DEFAULT) หรือเป็นกลาง (0)
   เกมไม่พัง และ MBTI.warnMissing() จะเตือนใน console ว่ายังขาด id ไหนบ้าง

   ค่าแต้ม: −2..+2 ต่อแกน   (+ = ตัวอักษรแรก E/S/T,  − = ตัวอักษรหลัง I/N/F)
   แกน J/P ไม่มีในตาราง เพราะคำนวณจาก "ความสมดุลของชาม" (ดูฟังก์ชัน balance)
   ============================================================ */
(function (root) {
  'use strict';

  // ---------- 1) ตารางแต้ม (EI: + จัดจ้าน/สิ่งเร้าสูง, − ละมุน | SN: + คลาสสิก, − แปลกใหม่ | TF: + คุ้มค่า/สารอาหาร, − ฮีลใจ) ----------
  const SCORES = {
    soup: {
      red:    { EI: +2, SN: +2 },                 // หม่าล่าแดงเสฉวน: จัดจ้านและคลาสสิกสุด
      white:  { EI: +1, SN: +1, TF: -1 },         // ออริจินัล: ชาๆ เผ็ดน้อยกว่า
      bone:   { EI: -1, SN: +1, TF: +2 },         // ซุปกระดูก: คอลลาเจน/โปรตีน
      shabu:  { EI: +1, SN: -1, TF: +1 },         // ชาบูดำ: ดำสะดุดตา รสเข้ม แปลกใหม่
      milk:   { EI: -2, SN: -2, TF: -2 },         // น้ำนม: นุ่ม แปลก ฮีลใจสุด
    },
    ing: {
      // ผัก/เห็ด/สาหร่าย
      bok:    { SN: +2, TF: +2 },
      cab:    { SN: +2, TF: +1 },
      wat:    { SN: +1, TF: +1 },
      wak:    { EI: -1, SN: -1, TF: +1 },
      enoki:  { EI: -1, SN: +1, TF: -1 },
      oyster: { EI: +1, SN: -1, TF: +1 },
      lotus:  { EI: +1, SN: -1, TF: +1 },
      corn:   { EI: -1, SN: +1, TF: -1 },         // หวานนุ่ม กินแล้วสบายใจ
      // เนื้อสัตว์/โปรตีน
      beef:   { EI: +1, SN: +2, TF: +2 },
      belly:  { SN: +1, TF: -1 },                 // หมูสามชั้น: ฉ่ำมัน = ปลอบใจ
      collar: { SN: +1, TF: +1 },
      saus:   { EI: +1, SN: -1, TF: -1 },
      jelly:  { EI: +1, SN: -2, TF: -1 },         // แมงกะพรุน: กรุบ แปลกใหม่ กินเพื่อความสนุก
      // เต้าหู้
      cheese: { EI: +1, SN: -2, TF: -2 },
      roll:   { EI: -1, SN: +1, TF: -1 },
      // เส้น
      kelp:   { EI: -1, SN: -2, TF: +1 },
      glass:  { EI: -1, SN: +2, TF: -1 },
      inst:   { TF: -2 },                         // มาม่า: คอมฟอร์ตฟู้ด
      sweet:  { EI: -1, SN: -1, TF: -1 },
    },
    sauce: {
      sesame: { EI: -2, SN: +2, TF: -2 },
      garlic: { EI: +1, SN: +2, TF: +1 },
      chilli: { EI: +2, SN: +1 },
      sukki:  { SN: +1, TF: -1 },
      corian: { EI: -1, SN: -1, TF: +1 },
      malaoil:{ EI: +2, SN: -1 },
      soy:    { EI: -1, SN: +2, TF: +1 },
      worce:  { EI: +1, SN: -1, TF: +1 },
    },
  };

  // ---------- 2) หมวดวัตถุดิบ (ใช้คำนวณ J/P) — มี 4 กลุ่มหลักตายตัว วัตถุดิบใหม่แค่เลือกว่าอยู่กลุ่มไหน ----------
  const GROUPS = ['veg', 'protein', 'tofu', 'noodle'];
  const CATEGORY = {
    bok:'veg', cab:'veg', wat:'veg', wak:'veg', enoki:'veg', oyster:'veg', lotus:'veg', corn:'veg',
    beef:'protein', belly:'protein', collar:'protein', saus:'protein', jelly:'protein',
    cheese:'tofu', roll:'tofu',
    kelp:'noodle', glass:'noodle', inst:'noodle', sweet:'noodle',
  };
  // แต้มตั้งต้นของหมวด: ใช้เมื่อวัตถุดิบใหม่ยังไม่ได้ใส่แต้มเอง (กันผลเอียง ไม่ให้ตัวที่ลืมใส่เป็น 0 ทั้งหมด)
  const CATEGORY_DEFAULT = {
    veg:     { SN: +1, TF: +1 },
    protein: { TF: +1 },
    tofu:    { TF: -1 },
    noodle:  {},
  };

  // ---------- 3) ค่าปรับแต่ง (ปรับจากผลจำลอง sim-mbti.js) ----------
  const CONFIG = {
    SOUP_WEIGHT:  3,      // น้ำหนักรวมของน้ำซุป (หารเท่ากันถ้าเลือกหลายซุป)
    SAUCE_WEIGHT: 1,      // ซอสต่อ 1 ชนิด
    SPICE_WEIGHT: 2,                  // น้ำหนักของระดับความเผ็ด (เทียบกับซุป ×3)
    SPICE_EI:     [-2, 0, 1, 2],      // MILD, MEDIUM, HOT, HELL → แต้มแกน E/I
    TIE_EPS:      0.05,   // |ค่าเฉลี่ย| ต่ำกว่านี้ถือว่าเสมอ
    BIAS:         { EI: 0.088, SN: 0.174, TF: 0 },   // หักค่าเอียงของ "ตารางแต้มทั้งหมด" ออก ให้ผู้เล่นสุ่มได้ฝั่งละ ~50% (sim-mbti.js คำนวณให้)
    JP_THRESHOLD: 0.76,    // ความสมดุลของชาม (0..1) ที่ถือว่า J
    TIER_CUTS:    [0.19, 0.26, 0.34, 0.43],      // ตัดระดับความเข้มข้น → 0..4 (ใช้แทน Rarity)
  };

  // ---------- 4) ตัวช่วย ----------
  const AX = ['EI', 'SN', 'TF'];

  function rowOf(kind, id) {
    const exact = SCORES[kind] && SCORES[kind][id];
    if (exact) return exact;
    if (kind === 'ing') return CATEGORY_DEFAULT[CATEGORY[id]] || null;
    return null;
  }

  function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

  // ความสมดุลของชาม 0..1 (entropy ของน้ำหนักกรัมใน 4 กลุ่ม): ชามเอียงหมวดเดียว=0, กระจายเท่ากัน=1
  function balance(ings, gramsOf) {
    const g = {}; let tot = 0;
    ings.forEach(o => {
      const grp = CATEGORY[o.id]; if (!grp) return;
      const w = gramsOf(o.id); g[grp] = (g[grp] || 0) + w; tot += w;
    });
    if (!tot) return 0;
    let H = 0; Object.values(g).forEach(w => { const p = w / tot; H -= p * Math.log(p); });
    return H / Math.log(GROUPS.length);
  }

  /**
   * order = { soups:[id], ings:[{id}|id], sauces:[{id}|id], spice:0..3 }   (ตรงกับ state ในเกม)
   * grams = { bok:100, ... } หรือฟังก์ชัน id => กรัม  (ไม่มี → 100)
   * คืนค่า { type:'INFJ', axes:{EI,SN,TF,JP} (−1..+1), intensity (0..1), tier (0..4), unscored:[...] }
   */
  function calc(order, grams) {
    const gramsOf = typeof grams === 'function' ? grams : (id => (grams && grams[id]) || 100);
    const idOf = x => (typeof x === 'string' ? x : x.id);
    const soups = (order.soups || []).map(idOf);
    const ings = (order.ings || []).map(x => ({ id: idOf(x) }));
    const sauces = (order.sauces || []).map(idOf);

    const sum = { EI: 0, SN: 0, TF: 0 }, wsum = { EI: 0, SN: 0, TF: 0 };
    const unscored = new Set();
    const lastSign = { EI: 0, SN: 0, TF: 0 };      // ใช้เป็นตัวตัดสินสำรอง
    const soupSign = { EI: 0, SN: 0, TF: 0 };

    const add = (kind, id, w, isSoup) => {
      if (!(SCORES[kind] && SCORES[kind][id])) unscored.add(kind + ':' + id);
      const row = rowOf(kind, id); if (!row) return;
      AX.forEach(ax => {
        if (!row[ax]) return;
        sum[ax] += row[ax] * w; wsum[ax] += 2 * w;
        lastSign[ax] = Math.sign(row[ax]);
        if (isSoup) soupSign[ax] += row[ax] * w;
      });
    };
    soups.forEach(id => add('soup', id, CONFIG.SOUP_WEIGHT / soups.length, true));
    ings.forEach(o => add('ing', o.id, gramsOf(o.id) / 100, false));
    sauces.forEach(id => add('sauce', id, CONFIG.SAUCE_WEIGHT, false));

    if (order.spice != null) { const w = CONFIG.SPICE_WEIGHT; sum.EI += (CONFIG.SPICE_EI[order.spice] || 0) * w; wsum.EI += 2 * w; }   // ระดับความเผ็ด 0..3
    const axes = {}, raw = {};
    AX.forEach(ax => {
      raw[ax] = wsum[ax] ? sum[ax] / wsum[ax] : 0;                                   // ค่าเฉลี่ยดิบ −1..+1
      axes[ax] = wsum[ax] ? Math.max(-1, Math.min(1, raw[ax] - CONFIG.BIAS[ax])) : 0;  // หักค่าเอียงของตารางแล้ว
    });
    const H = balance(ings, gramsOf), T = CONFIG.JP_THRESHOLD;
    axes.JP = Math.max(-1, Math.min(1, (H - T) / Math.max(T, 1 - T)));

    // ตัดสินตัวอักษร: ชัดเจน → ตามค่า · เสมอ → ทิศของซุป → ไม่มีข้อมูลเลย → สุ่มแบบคงที่จากรายการในชาม
    const seed = hash(soups.join() + '|' + ings.map(o => o.id).join() + '|' + sauces.join());
    const letter = (ax, a, b, i) => {
      if (Math.abs(axes[ax]) > CONFIG.TIE_EPS) return axes[ax] > 0 ? a : b;
      if (soupSign[ax]) return soupSign[ax] > 0 ? a : b;
      return ((seed >> i) & 1) ? a : b;
    };
    const type = letter('EI', 'E', 'I', 0) + letter('SN', 'S', 'N', 1) + letter('TF', 'T', 'F', 2) + (axes.JP >= 0 ? 'J' : 'P');

    const intensity = (Math.abs(axes.EI) + Math.abs(axes.SN) + Math.abs(axes.TF) + Math.abs(axes.JP)) / 4;
    let tier = 0; CONFIG.TIER_CUTS.forEach(c => { if (intensity >= c) tier++; });
    return { type, axes, raw, intensity, tier, balance: H, unscored: [...unscored] };
  }

  // เรียกตอนเริ่มเกม: เตือนใน console ถ้ามี id ที่ยังไม่ได้ใส่แต้ม/หมวด (เพิ่มของใหม่แล้วลืมจะรู้ทันที)
  function warnMissing(lists) {
    const out = [];
    [['soup', lists.soups], ['ing', lists.ings], ['sauce', lists.sauces]].forEach(([kind, arr]) => {
      (arr || []).forEach(d => {
        if (!SCORES[kind][d.id]) out.push(`ยังไม่มีแต้ม MBTI: ${kind}:${d.id}`);
        if (kind === 'ing' && !CATEGORY[d.id]) out.push(`ยังไม่ได้ระบุหมวด (veg/protein/tofu/noodle): ${d.id}`);
      });
    });
    if (out.length && typeof console !== 'undefined') console.warn('[MBTI] ' + out.join('\n[MBTI] '));
    return out;
  }

  const API = { calc, warnMissing, balance, SCORES, CATEGORY, CATEGORY_DEFAULT, GROUPS, CONFIG };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.MBTI = API;
})(typeof window !== 'undefined' ? window : globalThis);
