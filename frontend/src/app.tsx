import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
        <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", fontWeight: 700 }}>
            KnowledgeTrees
          </Link>
        </header>

        <main style={{ marginTop: 16 }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    );
}
