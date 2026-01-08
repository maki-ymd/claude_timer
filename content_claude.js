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
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    const resetAt = Date.now() + (hours * 3600000) + (mins * 60000);
    chrome.runtime.sendMessage({ type: "SET_RESET_TIME", resetAt });
  }
}
parseAndSend();
const observer = new MutationObserver(parseAndSend);
observer.observe(document.body, { childList: true, subtree: true });