// contentScript.ts
window.addEventListener("message", (event) => {
  console.log("evtmn::::::", event);
  if (event.source !== window) return;
  if (event.data.type === "SET_USER_ID") {
    chrome.storage.local.set({ userId: event.data.userId }, () => {
      console.log("✅ User ID saved to chrome.storage");
    });
  }
});
