import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import PokemonPage from "./pages/Pokemonpage.tsx";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path=":pokemonName" element={<PokemonPage />} />
      </Routes>
    </main>
  );
}

export default App;
