function parseAndSend() {
  const elements = document.querySelectorAll('p.font-base.text-text-400');
  let timeText = "";
  
  // 優先順位をつけて探す
  // ループして、「リセット」かつ「時間」または「分」を含むものを探す
  for (const el of elements) {
    const text = el.innerText;
    if (text.includes("リセット")) {
      // とりあえず候補として保持
      if (!timeText) {
        timeText = text;
      }
      
      // 「時間」または「分」が含まれていれば、これを本命としてループを抜ける
      // (月次リセットの日付表記などを避けるため)
      if (text.includes("時間") || text.includes("分")) {
        timeText = text;
        break; 
      }
    }
  }

  if (timeText) {
    console.log("Found time text:", timeText);
    const hoursMatch = timeText.match(/(\d+)時間/);
    const minsMatch = timeText.match(/(\d+)分/);
    
    // 数字が見つかった場合のみ処理する
    if (hoursMatch || minsMatch) {
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
      
      if (hours > 0 || mins > 0) {
        const resetAt = Date.now() + (hours * 3600000) + (mins * 60000);
        chrome.runtime.sendMessage({ type: "SET_RESET_TIME", resetAt });
      }
    }
  }
}
parseAndSend();
const observer = new MutationObserver(parseAndSend);
observer.observe(document.body, { childList: true, subtree: true });