// Menu, tiers and rewards. Loaded by the browser (window.NV) and by server.js,
// so prices and discounts are defined once and the server never trusts client prices.
(function (g) {
  const CU = ['North Indian', 'South Indian', 'Indo-Chinese', 'Street Food', 'Dessert'];
  const MENU = [
    ['bc', 'Butter Chicken', 0, 360, '🍛', 0, 1], ['pt', 'Paneer Tikka', 0, 280, '🧀', 1, 1], ['dm', 'Dal Makhani', 0, 240, '🍲', 1, 0], ['gn', 'Garlic Naan', 0, 60, '🫓', 1, 0], ['rj', 'Rogan Josh', 0, 420, '🍖', 0, 0],
    ['md', 'Masala Dosa', 1, 140, '🥞', 1, 1], ['is', 'Idli Sambar', 1, 90, '🍚', 1, 0], ['mv', 'Medu Vada', 1, 100, '🍩', 1, 0], ['fc', 'Filter Coffee', 1, 60, '☕', 1, 1], ['bi', 'Hyderabadi Biryani', 1, 320, '🥘', 0, 1],
    ['hk', 'Hakka Noodles', 2, 200, '🍜', 1, 0], ['mn', 'Veg Manchurian', 2, 220, '🥡', 1, 0], ['mo', 'Steamed Momos', 2, 160, '🥟', 1, 1],
    ['pb', 'Pav Bhaji', 3, 150, '🍞', 1, 1], ['ch', 'Dahi Papdi Chaat', 3, 110, '🥗', 1, 0],
    ['gj', 'Gulab Jamun', 4, 90, '🍡', 1, 0], ['ku', 'Malai Kulfi', 4, 110, '🍦', 1, 0], ['rm', 'Rasmalai', 4, 130, '🍮', 1, 1],
  ].map(([id, name, c, price, em, veg, pop]) => ({id, name, cu: CU[c], price, em, veg, pop, venue: 'kk', img: null}));
  // The Corner Cafe (second Nivala venue). Ids start with "c" so they never clash with Khana Khazana dishes.
  // Photos: Unsplash photo ids. To change one, copy the id from the photo's address (images.unsplash.com/photo-XXXX).
  const CAFE_CU = ['Artisan Coffee & Drinks', 'All-Day Breakfast & Toasts', 'Sandwiches, Croissants & Bowls', 'Bakery & Desserts'];
  MENU.push(...[
    ['ces', 'Espresso', 0, 160, '☕', 1, 0, '1510591509098-f4fdc6d0ff04'], ['cco', 'Cortado', 0, 190, '🥛', 1, 0, '1534778101976-62847782c213'],
    ['cil', 'Iced Caramel Latte', 0, 240, '🧋', 1, 1, '1461023058943-07fcbe16d735'], ['cpo', 'Pour-Over Single Origin', 0, 280, '🫗', 1, 0, '1545665225-b23b99e4d45e'],
    ['cml', 'Matcha Oat Latte', 0, 290, '🍵', 1, 1, '1515823064-d6e0c04616a7'], ['cju', 'Fresh Cold-Pressed Juice', 0, 220, '🧃', 1, 0, '1600271886742-f049cd451bba'],
    ['cmc', 'Classic Masala Chai', 0, 120, '🫖', 1, 0, '1571934811356-5cc061b6821f'],
    ['cav', 'Avocado Sourdough Toast', 1, 360, '🥑', 0, 1, '1541519227354-08fa5d50c44d'], ['csb', 'Smoked Salmon Bagel', 1, 420, '🥯', 0, 0, '1592415486689-125cbbfcbee2'],
    ['cft', 'Brioche French Toast', 1, 320, '🍞', 0, 0, '1484723091739-30a097e8f929'], ['csh', 'Classic Shakshuka', 1, 340, '🍳', 0, 1, '1590412200988-a436970781fa'],
    ['cpp', 'Pesto Grilled Chicken Panini', 2, 380, '🥪', 0, 1, '1528735602780-2552fd46c7af'], ['ccf', 'Caprese Focaccia Sandwich', 2, 340, '🍅', 1, 0, '1509722747041-616f39b57569'],
    ['cfw', 'Crispy Falafel Wrap', 2, 300, '🌯', 1, 0, '1626700051175-6818013e1d4f'], ['cqb', 'Quinoa & Roasted Veggie Harvest Bowl', 2, 360, '🥗', 1, 0, '1512621776951-a57141f2eefd'],
    ['cbc', 'Butter Croissant', 3, 150, '🥐', 1, 1, '1555507036-ab1f4038808a'], ['cpc', 'Pain au Chocolat', 3, 180, '🍫', 1, 0, '1530610476181-d83430b64dcd'],
    ['ctr', 'Tiramisu', 3, 290, '🍮', 1, 0, '1571877227200-a0d98ea607e9'], ['cbm', 'Blueberry Muffin', 3, 160, '🧁', 1, 0, '1607958996333-41aef7caefaa'],
    ['ccr', 'Warm Cinnamon Roll', 3, 190, '🍯', 1, 0, '1509365465985-25d11c17e812'], ['cbq', 'Basque Cheesecake', 3, 320, '🍰', 1, 1, '1533134242443-d4fd215305ad'],
  ].map(([id, name, c, price, em, veg, pop, img]) => ({id, name, cu: CAFE_CU[c], price, em, veg, pop, venue: 'cafe', img})));
  const TIERS = [{n: 'Silver', min: 0, off: 0, w: 1}, {n: 'Gold', min: 500, off: 5, w: 1.25}, {n: 'Platinum', min: 1500, off: 10, w: 1.5}];
  const REW = [{id: 'r5', t: '5% off your bill', cost: 150, pct: 5}, {id: 'rj', t: 'Free Gulab Jamun', cost: 200, free: 90}, {id: 'rq', t: 'Queue jump · 8 minutes', cost: 250, jump: 1}, {id: 'r15', t: '15% off your bill', cost: 400, pct: 15}];
  const DK = ['taste', 'ambience', 'service', 'value', 'hygiene', 'speed'];
  // Bill discount by completed paid visits (counted per email). min = visits already completed.
  const VTIERS = [{n: 'New', min: 0, off: 0}, {n: 'Silver', min: 3, off: 5}, {n: 'Gold', min: 6, off: 10}, {n: 'Platinum', min: 10, off: 15}];
  const vtierOf = visits => [...VTIERS].reverse().find(t => visits >= t.min);
  const GST = {cgst: 0.025, sgst: 0.025};
  /** Bill maths in integer paise. visits = completed visits before this order. */
  const TIP_PCTS = [5, 10, 15];
  /** tip: {pct: 5|10|15} or {amount: whole rupees 1..5000}; anything else = no tip */
  function tipPaise(tip, taxable) {
    if (tip && TIP_PCTS.includes(+tip.pct)) return Math.round(taxable * +tip.pct / 100 / 100) * 100; // nearest rupee
    if (tip && Number.isInteger(+tip.amount) && +tip.amount > 0 && +tip.amount <= 5000) return +tip.amount * 100;
    return 0;
  }
  function bill(cart, visits, reward, tip) {
    let sub = 0;
    for (const [id, q] of Object.entries(cart)) { const d = MENU.find(m => m.id === id); if (d) sub += d.price * 100 * q; }
    const vt = vtierOf(visits || 0), rw = reward ? REW.find(r => r.id === reward && !r.jump) : null;
    const pct = Math.min(25, vt.off + (rw?.pct || 0));
    const discount = Math.min(sub, Math.round(sub * pct / 100) + (rw?.free || 0) * 100);
    const taxable = sub - discount, cgst = Math.round(taxable * GST.cgst), sgst = Math.round(taxable * GST.sgst);
    const t = tipPaise(tip, taxable);
    return {subtotal: sub, loyaltyDiscount: discount, taxableAmount: taxable, cgst, sgst, tip: t, totalPayable: taxable + cgst + sgst + t, tier: vt, pct, reward: rw};
  }
  // Kitchen stations. Each dish is cooked at one station; prep = typical minutes for that station.
  const STATIONS = [
    {id: 'tandoor', name: 'Tandoor & Handi', em: '🔥', prep: 12},
    {id: 'tawa', name: 'Dosa Tawa', em: '🥞', prep: 7},
    {id: 'wok', name: 'Wok', em: '🥢', prep: 8},
    {id: 'chaat', name: 'Chaat Counter', em: '🌶️', prep: 4},
    {id: 'sweets', name: 'Sweets & Drinks', em: '🍨', prep: 3},
  ];
  const CU_STATION = {'North Indian': 'tandoor', 'South Indian': 'tawa', 'Indo-Chinese': 'wok', 'Street Food': 'chaat', 'Dessert': 'sweets',
    'Artisan Coffee & Drinks': 'sweets', 'All-Day Breakfast & Toasts': 'tawa', 'Sandwiches, Croissants & Bowls': 'tawa', 'Bakery & Desserts': 'sweets'};
  const STATION_OVERRIDE = {bi: 'tandoor', fc: 'sweets'}; // biryani comes off the handi, coffee from the drinks counter
  const stationOf = id => STATION_OVERRIDE[id] || CU_STATION[MENU.find(m => m.id === id)?.cu] || 'tandoor';
  const PICKUPS = [0, 15, 30, 45]; // takeaway pickup: ASAP or in N minutes
  g.NV = {CU, CAFE_CU, MENU, TIERS, REW, DK, VTIERS, vtierOf, GST, bill, TIP_PCTS, STATIONS, stationOf, PICKUPS};
})(typeof module !== 'undefined' && module.exports ? module.exports : window);
