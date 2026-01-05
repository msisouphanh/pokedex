import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  );
}

export default App;
