function parseAndSend() {
  const elements = document.querySelectorAll('p.font-base.text-text-400');
  let timeText = "";
  elements.forEach(el => {
    if (el.innerText.includes("リセット")) {
      timeText = el.innerText;
    }
  });

  if (timeText) {
    const hoursMatch = timeText.match(/(\d+)時間/);
    const minsMatch = timeText.match(/(\d+)分/);
    
    // 数字が見つかった場合のみ処理する
    if (hoursMatch || minsMatch) {
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
      
      // 念のため、未来の時間になる場合のみ更新
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