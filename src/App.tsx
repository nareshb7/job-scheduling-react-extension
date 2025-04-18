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
  const [formData, setFormData] = useState<FormType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setAPIMessage] = useState("");

  // ✅ This runs on popup load
  useEffect(() => {
    chrome.storage.local.get("userId", (data) => {
      if (!data.userId) {
        window.location.href = "unauthorized.html";
        return;
      }
      const checkAuth = async () => {
        const userId = data.userId; // Replace this later with localStorage or real login
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

      // ✅ now you can use data.userId
      console.log("✅ userId from chrome.storage", data.userId);
    });
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
            const hirer = getElement(".jobs-poster__name")?.innerText;
            return {
              portal: "LinkedIn",
              title: position,
              company: companyName,
              location,
              description: jobDescription,
              url: window.location.href,
              hirer,
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

  const hanldeSubmit = async () => {
    var message = "";
    setIsLoading(true);
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.scripting.executeScript<[FormType, string], void>({
      target: { tabId: tab.id as number },
      args: [formData as FormType, message],
      func: (formData, message) => {
        chrome.storage.local.get("userId", (data) => {
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
                ...formData,
                url: window.location.href,
                userId: data.userId,
              }),
            })
              .then((res) => res.json())
              .then((dt) => {
                message = "Success";
                console.log("portal_updated:::", dt);
                return dt;
              })
              .catch((er) => {
                console.error("portal_add_error", er.message);
                message = er.message;
                return er.message;
              });
          }
          return data;
        });
      },
    });
    setTimeout(() => {
      setIsLoading(false);
      setFormData(null);
      setAPIMessage(message || "Success");
      setTimeout(() => {
        setAPIMessage("");
      }, 2000);
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => prev && { ...prev, [name]: value });
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>Track this job</button>
        {apiMessage && <h4>Message: {apiMessage}</h4>}
        {formData && (
          <>
            <div>
              <label>Company:</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Role Title:</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Portal:</label>
              <input
                name="portal"
                value={formData.portal}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <button disabled={isLoading} onClick={hanldeSubmit}>
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
