import React from "react";
import ReactDOM from "react-dom/client";

console.log("🎾 Step 1: main.tsx executing!");

function TestApp() {
  console.log("🎾 Step 2: TestApp rendering!");

  return React.createElement(
    "div",
    {
      style: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
      },
    },
    [
      React.createElement("h1", { key: "h1" }, "🎾 SUCCESS! React is Working!"),
      React.createElement(
        "p",
        { key: "p1" },
        "✅ TypeScript compiled successfully!"
      ),
      React.createElement(
        "p",
        { key: "p2" },
        "✅ ESBuild completed without errors!"
      ),
      React.createElement(
        "p",
        { key: "p3" },
        "✅ Vite server is running correctly!"
      ),
      React.createElement(
        "div",
        {
          key: "div",
          style: {
            marginTop: "30px",
            fontSize: "16px",
            background: "rgba(255,255,255,0.1)",
            padding: "15px",
            borderRadius: "10px",
          },
        },
        "🎯 NEXT: Replace this with your App component!"
      ),
    ]
  );
}

console.log("🎾 Step 3: Creating root element...");

const rootElement = document.getElementById("root");

if (rootElement) {
  console.log("🎾 Step 4: Root found, creating React root...");
  const root = ReactDOM.createRoot(rootElement);

  console.log("🎾 Step 5: Rendering app...");
  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(TestApp, null)
    )
  );

  console.log("🎾 Step 6: ✅ COMPLETE SUCCESS!");

  setTimeout(() => {
    alert("🎾 AMAZING! Your tennis app environment is ready!");
  }, 1000);
} else {
  console.error("❌ Root element not found - check your HTML!");
  document.body.innerHTML =
    '<div style="padding:20px;background:red;color:white;font-family:Arial;"><h1>❌ Root Element Missing</h1><p>Update public/index.html to include &lt;div id="root"&gt;&lt;/div&gt;</p></div>';
}
