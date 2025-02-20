import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./screens/home";
import Register from "./screens/register";
import Dashboard from "./screens/dashboard";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>ERP Sistemi</h3>
          </div>
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link">
              <i className="fas fa-home"></i>
              <span>Ana Sayfa</span>
            </Link>
            <Link to="/register" className="sidebar-link">
              <i className="fas fa-user-plus"></i>
              <span>Kayıt Ol</span>
            </Link>
            <Link to="/dashboard" className="sidebar-link">
              <i className="fas fa-tachometer-alt"></i>
              <span>Panel</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="main-wrapper">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
