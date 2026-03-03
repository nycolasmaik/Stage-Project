import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AreasCadastradas from "./pages/AreasCadastradas";
import "./App.css";

function Home() {
  return (
    <div className="home-container">
      <div className="menu-card">
        <h1>MAPEAMENTO DE PROCESSOS POR ÁREA</h1>
        <div className="button-group">
          <Link to="/areas" className="nav-button">
            ENTRAR NO SISTEMA
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/areas" element={<AreasCadastradas />} />       
      </Routes>
    </Router>
  );
}

export default App;
