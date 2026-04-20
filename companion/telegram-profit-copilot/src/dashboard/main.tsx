import ReactDOM from "react-dom/client";

function DashboardApp() {
  return <main>Telegram Profit Copilot Dashboard</main>;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Dashboard root element not found");
}

ReactDOM.createRoot(rootElement).render(<DashboardApp />);
