"use client";

import { useState } from "react";

export default function TranslatePage() {
  const [loading, setLoading] = useState(false);

  const translateCanvas = async (
    canvas: HTMLCanvasElement,
    targetLanguage: string
  ) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    const originalText = canvas.getAttribute("data-original-text"); // Store the original text in a custom attribute
    if (!originalText) return;

    try {
      // Fetch the translated text from the API
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, targetLanguage }),
      });

      const data = await response.json();
      if (response.ok) {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the translated text
        context.font = "16px Arial"; // Example font style
        context.fillStyle = "black"; // Example text color
        context.fillText(data.translation, 10, 50); // Example position
      } else {
        console.error("Error in canvas translation:", data.error);
      }
    } catch (error) {
      console.error("Error while translating canvas:", error);
    }
  };

  const translatePage = async (targetLanguage: string) => {
    setLoading(true);

    // Translate regular elements (h1, h2, p, button, label)
    const elements = document.querySelectorAll<HTMLElement>(
      "h1, h2, h3, p, button, label, span, a, link, th, tr"
    );
    for (const el of Array.from(elements)) {
      if (
        el.childNodes.length === 1 &&
        el.textContent &&
        el.textContent.trim()
      ) {
        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: el.textContent, targetLanguage }),
          });

          const data = await response.json();
          if (response.ok) {
            el.textContent = data.translation; // Update the text
          } else {
            console.error("Error in text translation:", data.error);
          }
        } catch (error) {
          console.error("Error in text translation:", error);
        }
      }
    }

    // Translate canvas elements
    const canvasElements =
      document.querySelectorAll<HTMLCanvasElement>("canvas");
    for (const canvas of Array.from(canvasElements)) {
      await translateCanvas(canvas, targetLanguage);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col p-6 gap-4">
      <button
        onClick={() => translatePage("en")}
        disabled={loading}
        className={`px-4 py-2 rounded-md font-bold shadow hover:shadow-lg gap-1 transition ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#D24EA6_92.58%)] text-slate-50"
        }`}
      >
        {loading ? "Translating..." : "Translate to English"}
      </button>
      <button
        onClick={() => translatePage("es")}
        disabled={loading}
        className={`px-4 py-2 rounded-md font-bold shadow hover:shadow-lg gap-1 transition ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#F86A3A_92.58%)] text-slate-50"
        }`}
      >
        {loading ? "Translating..." : "Translate to Spanish"}
      </button>
    </div>
  );
}
