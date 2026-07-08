import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

try {
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    throw new Error("Root element #root not found in DOM");
  }
  createRoot(rootEl).render(<App />);
} catch (err) {
  const rootEl = document.getElementById("root");
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : "";
  const html = `
    <div style="padding:24px;font-family:system-ui,sans-serif;background:#fff;color:#111;min-height:100vh">
      <h1 style="color:#dc2626;font-size:20px;margin-bottom:12px">CloudNest 渲染失败</h1>
      <p style="margin-bottom:8px;font-size:14px"><strong>错误:</strong> ${message}</p>
      <pre style="background:#f5f5f5;padding:12px;border-radius:6px;overflow:auto;font-size:12px;max-height:60vh">${stack}</pre>
      <p style="margin-top:16px;font-size:12px;color:#666">请尝试刷新页面，或检查浏览器控制台获取更多错误信息。</p>
    </div>
  `;
  if (rootEl) rootEl.innerHTML = html;
  else document.body.innerHTML = html;
}
