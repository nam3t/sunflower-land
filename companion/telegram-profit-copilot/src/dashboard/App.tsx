import { NavLink, Route, Routes } from "react-router";

import { Layout } from "./components/Layout.js";
import { HistoryPage } from "./routes/HistoryPage.js";
import { MarketPage } from "./routes/MarketPage.js";
import { OverviewPage } from "./routes/OverviewPage.js";
import { StatePage } from "./routes/StatePage.js";
import { StrategyPage } from "./routes/StrategyPage.js";

export function App() {
  return (
    <Layout>
      <header className="header">
        <div>
          <p className="eyebrow">Sunflower Land</p>
          <h1>Profit Copilot</h1>
        </div>
        <button type="button">Refresh State</button>
      </header>

      <nav className="nav">
        <NavLink to="/">Overview</NavLink>
        <NavLink to="/strategy">Strategy</NavLink>
        <NavLink to="/market">Market</NavLink>
        <NavLink to="/state">State</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/strategy" element={<StrategyPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/state" element={<StatePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </Layout>
  );
}
