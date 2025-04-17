import { useEffect, useState } from "react";
import "./App.css";

export interface FormType {
  portal: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
}

function App() {
  const [formData, setFormData] = useState<FormType>({
    portal: "",
    title: "",
    company: "",
    location: "",
    description: "",
    url: "",
  });

  // ✅ This runs on popup load
  useEffect(() => {
    chrome.storage.local.get("userId", (data) => {
      console.log("data::::", data);
      if (!data.userId) {
        window.location.href = "unauthorized.html";
        return;
      }

      // ✅ now you can use data.userId
      console.log("✅ userId from chrome.storage", data.userId);
    });
    const checkAuth = async () => {
      const userId = "67fe21d2cec60a9927dd8bad"; // Replace this later with localStorage or real login
      const BASE_URL = "http://localhost:3001/api";

      try {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (!response.ok) {
          // 🔴 Redirect to unauthorized.html if not authenticated
          window.location.href = "unauthorized.html";
          return;
        }

        const data = await response.json();
        console.log("✅ Authenticated user:", data);
      } catch (error) {
        console.error("Auth check failed:", error);
        window.location.href = "unauthorized.html";
      }
    };

    checkAuth();
  }, []);

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id as number },
      func: () => {
        const host = window.location.host;

        const getElement = (selector: string) =>
          document.querySelector(selector) as HTMLElement;

        const linkedinFunction = () => {
          try {
            const companyName = getElement(
              ".job-details-jobs-unified-top-card__company-name"
            )?.innerText;
            const position = getElement(
              ".job-details-jobs-unified-top-card__job-title"
            )?.innerText;
            const jobDescription =
              document.getElementById("job-details")?.innerText;
            const location = getElement(
              ".job-details-jobs-unified-top-card__tertiary-description-container"
            )?.innerText;
            const data = chrome.storage.local.get("userId", (data) => {
              console.log("data::::", data);
              if (!data.userId) {
                window.location.href = "unauthorized.html";
                return;
              }
              if (data.userId) {
                fetch(`http://localhost:3001/api/portal/add`, {
                  method: "POST",
                  headers: {
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify({
                    portal: "LinkedIn",
                    title: position,
                    company: companyName,
                    location,
                    description: jobDescription,
                    url: window.location.href,
                    userId: data.userId,
                  }),
                })
                  .then((res) => res.json())
                  .then((dt) => console.log("portal_updated:::", dt))
                  .catch((er) => console.error("portal_add_error", er.message));
              }
              // ✅ now you can use data.userId
              console.log("✅ userId from chrome.storage", data.userId);
              return data;
            });
            console.log("dataL::::::id", data);
            return {
              portal: "LinkedIn",
              title: position,
              company: companyName,
              location,
              description: jobDescription,
              url: window.location.href,
            };
          } catch (err) {
            console.error("Error in LinkedIn scraper", err);
            return null;
          }
        };

        const naukriFunction = () => {
          try {
            const companyName = getElement(".jd-header-comp-name a")?.innerText;
            const position = getElement(".jd-header-title")?.innerText;
            const jobDescription = getElement(".dang-inner-html")?.innerText;
            const location = getElement(".locWdth")?.innerText;

            return {
              portal: "Naukri",
              title: position,
              company: companyName,
              location,
              description: jobDescription,
              url: window.location.href,
            };
          } catch (err) {
            console.error("Error in Naukri scraper", err);
            return null;
          }
        };

        if (host.includes("linkedin.com")) return linkedinFunction();
        if (host.includes("naukri.com")) return naukriFunction();

        alert("This site is not supported yet.");
        return {
          portal: "NOT SUPPORTED",
          title: "ERROR",
          company: "",
          location: "",
          description: "",
          url: "",
        };
      },
    });

    console.log("📦 Job Data Retrieved:", result);

    if (result) {
      setFormData(result as any);
    }
  };

  return (
    <>
      <div>
        <div>
          <label>Company:</label>
          <input value={formData.company} readOnly />
        </div>
        <div>
          <label>Role Title:</label>
          <input value={formData.title} readOnly />
        </div>
        <div>
          <label>Location:</label>
          <input value={formData.location} readOnly />
        </div>
        <div>
          <label>Portal:</label>
          <input value={formData.portal} readOnly />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={formData.description} readOnly />
        </div>
      </div>
      <button onClick={handleClick}>Track this job</button>
    </>
  );
}

export default App;
