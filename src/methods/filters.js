// currency 函式（金額千分符號）：
// parseInt() 是將傳進來的 num 轉換成 10 進位的數字
// toFixed(0) 用於確保我們得到的是一個整數，因為金額通常是整數形式
// replace() 方法的目的是將每三位數的數字之間插入一個逗號
export function currency(num) {
  const n = parseInt(num, 10);
  return `${n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c))}`;
}
// date 函式：比較白話來說，是將一個時間戳記轉換成可讀的格式（ex：2024/2/28）
export function date(time) {
  const localDate = new Date(time * 1000);
  return localDate.toLocaleDateString();
}

// 最後須在 main.js 中引入這兩個方式後，
// 就可以在全局（app.config.globalProperties）去定義 $filters，並放入 date 跟 currency 兩個方法。
