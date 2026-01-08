chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_RESET_TIME") {
    chrome.storage.local.set({ resetAt: message.resetAt });
    updateBadge();
  }
});

function updateBadge() {
  chrome.storage.local.get(["resetAt"], (res) => {
    if (!res || !res.resetAt) return;
    const diff = res.resetAt - Date.now();
    
    if (diff <= 0) {
      chrome.action.setBadgeText({ text: "OK" });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" }); // 完了時は緑
      chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
    } else {
      const totalMins = Math.ceil(diff / 60000);
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      const display = `${h}:${m.toString().padStart(2, '0')}`;
      
      chrome.action.setBadgeText({ text: display });
      // 白地に黒文字に変更
      chrome.action.setBadgeBackgroundColor({ color: "#FFFFFF" });
      chrome.action.setBadgeTextColor({ color: "#000000" });
    }
  });
}

chrome.alarms.create("tick", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(updateBadge);

// アイコンクリック時にClaudeの消費量ページを開く（既に開いていれば移動）
chrome.action.onClicked.addListener(() => {
  const targetUrl = "https://claude.ai/settings/usage";
  
  chrome.tabs.query({ url: targetUrl }, (tabs) => {
    if (tabs.length > 0) {
      // 既にある場合は最初のひとつをアクティブにする
      const tab = tabs[0];
      chrome.tabs.update(tab.id, { active: true });
      chrome.windows.update(tab.windowId, { focused: true });
    } else {
      // ない場合は新しく開く
      chrome.tabs.create({ url: targetUrl });
    }
  });
});