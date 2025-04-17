// chrome.action.onClicked.addListener((tab) => {
//   // const userData = localStorage.getItem("job_scheduling_user");
//   const userId = "67fe21d2cec60a9927dd8bad";
//   if (!userId) {
//     chrome.tabs.create({ url: "unauthorized.html" });
//     return;
//   }
//   console.log("useriD:::", userId);
//   const BASE_URL = "http://localhost:3001/api";
//   fetch(`${BASE_URL}/user/${userId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("✅ Auth Check Response:", data);
//       // you can show a notification or open a new tab based on auth result
//       if (data.authorized) {
//         chrome.tabs.create({ url: "index.html" });
//       } else {
//         chrome.tabs.create({ url: "unauthorized.html" });
//       }
//     })
//     .catch((err) => {
//       console.error("❌ Auth Check Error:", err);
//     });
// });

// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => {
//       console.log("Extension loaded:::::;");
//       //   alert("Hello from my extension!");
//     },
//   });
// });

// window.addEventListener("message", (event) => {
//   if (event.source !== window) return;
//   if (event.data.type === "SET_USER_ID") {
//     chrome.storage.local.set({ userId: event.data.userId }, () => {
//       console.log("User ID saved to chrome.storage");
//     });
//   }
// });
