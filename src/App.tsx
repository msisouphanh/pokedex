import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import PokemonPage from "./pages/PokemonPage.tsx";
import { useEffect, useState } from "react";

export interface PokemonSprites {
  front_default: string;
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
}

export interface PokemonInfo {
  id: number;
  name: string;
  url: string;
}

export interface Page {
  count: number;
  next: string;
  previous: string;
  results: PokemonInfo[];
}

function App() {
  const initialUrl = "https://pokeapi.co/api/v2/pokemon/";
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>(initialUrl);
  const [pageUrl, setPageUrl] = useState<string | null>();

  useEffect(() => {
    async function load() {
      const res = await fetch(nextUrl);
      const data: Page = await res.json();

      setNextUrl(data.next);
      const request = data.results.map((item) =>
        fetch(item.url).then((res) => res.json())
      );

      const fullPokemonData = await Promise.all(request);

      setPokemon((prev) => {
        const map = new Map(prev.map((pkm) => [pkm.name, pkm]));
        fullPokemonData.forEach((pkm) => map.set(pkm.name, pkm));
        return [...map.values()];
      });
    }
    load();
  }, [pageUrl]);

  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              pokemon={pokemon}
              onLoadMore={() => setPageUrl(nextUrl)}
            />
          }
        />
        <Route path=":pokemonName" element={<PokemonPage />} />
      </Routes>
    </main>
  );
}

export default App;
