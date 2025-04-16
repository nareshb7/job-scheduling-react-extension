import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
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
  const [count, setCount] = useState(0);

  const [formData, setFormData] = useState<FormType>({
    portal: "",
    title: "",
    company: "",
    location: "",
    description: "",
    url: "",
  });
  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id as number },
      func: () => {
        const host = window.location.host;

        const getElement = (selector: string) => {
          return document.querySelector(selector) as HTMLElement;
        };

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

            const jobData = {
              portal: "LinkedIn",
              title: position,
              company: companyName,
              location,
              description: jobDescription as string,
              url: window.location.href,
            };
            // setFormData(jobData);

            console.log("📌 LinkedIn Job Data:", jobData);
            // alert(`Tracked from LinkedIn: ${position}`);
            return jobData;
          } catch (err) {
            console.error("Error in LinkedIn scraper", err);
          }
        };

        const naukriFunction = () => {
          try {
            const companyName = getElement(".jd-header-comp-name a")?.innerText;
            const position = getElement(".jd-header-title")?.innerText;
            const jobDescription = getElement(".dang-inner-html")?.innerText;
            const location = getElement(".locWdth")?.innerText;

            const jobData = {
              portal: "Naukri",
              title: position,
              company: companyName,
              location,
              description: jobDescription,
              url: window.location.href,
            };
            // setFormData(jobData);

            console.log("📌 Naukri Job Data:", jobData);
            alert(`Tracked from Naukri: ${position}`);
            return jobData;
          } catch (err) {
            console.error("Error in Naukri scraper", err);
          }
        };

        if (host.includes("linkedin.com")) {
          return linkedinFunction();
        } else if (host.includes("naukri.com")) {
          return naukriFunction();
        } else {
          alert("This site is not supported yet.");
          return {
            portal: "NOT SUPPORTED",
            title: "ERROR",
            company: "",
            location: "",
            description: "",
            url: "",
          };
        }
      },
    });

    console.log("result::::", result);
    setFormData(result as any);
  };
  return (
    <>
      <div>
        <div>
          <label>Company:</label>
          <input value={formData.company} />
        </div>
        <div>
          <label>Role Title:</label>
          <input value={formData.title} />
        </div>
        <div>
          <label>Location:</label>
          <input value={formData.location} />
        </div>
        <div>
          <label>Portal:</label>
          <input value={formData.portal} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={formData.description} />
        </div>
      </div>
      <button onClick={handleClick}>Track this job</button>
    </>
  );
}

export default App;
