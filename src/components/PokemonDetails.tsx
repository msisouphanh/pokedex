import { useParams, Link, useLocation } from "react-router-dom";
import { type Pokemon } from "../App.tsx";
import { useState, useEffect } from "react";

interface EvolutionDetail {
  trigger: {
    name: string;
  };
}

interface Chain {
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: Chain[];
}

function PokemonDetails() {
  const location = useLocation();
  const multiplier = 0.220462;
  const { pokemonName } = useParams();
  const [pkm, setPkm] = useState<Pokemon | null>(
    location.state as Pokemon | null
  );
  const [evoPokemon, setEvoPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    if (!pkm && pokemonName) {
      async function loadPokemon() {
        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
          );
          const data = await res.json();
          setPkm(data);
        } catch (error) {
          console.error("Failed to fetch Pokémon:", error);
        }
      }
      loadPokemon();
    }

    if (pkm) {
      async function load() {
        const speciesRes = await fetch(pkm!.species.url);
        const speciesData = await speciesRes.json();

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();
        // console.log(evolutionData);

        function getPkmEvoNames(node: Chain, result: string[] = []) {
          result.push(node.species.name);
          for (const child of node.evolves_to) {
            getPkmEvoNames(child, result);
          }

          return result;
        }
        // console.log(evolutionData.chain.evolves_to[0].evolves_to[0].species.name);
        // console.log(evolutionData.chain.evolves_to[0].species.name);
        // console.log(evolutionData.chain.species.name);
        const pkmEvoNames = getPkmEvoNames(evolutionData.chain);
        const pkmEvoUrls = pkmEvoNames.map(
          (pkmEndUrl) => `https://pokeapi.co/api/v2/pokemon/${pkmEndUrl}`
        );
        const evoPokemons: Pokemon[] = [];

        for (const pkmUrl of pkmEvoUrls) {
          const res = await fetch(pkmUrl);
          const data: Pokemon = await res.json();

          evoPokemons.push(data);

          setEvoPokemon([...evoPokemons]);
        }
      }
      load();
    }
  }, [pkm, pokemonName]);

  return (
    <>
      {pkm ? (
        <>
          <h1>{pkm.name}</h1>
          <p>Weight: {(pkm.weight * multiplier).toFixed(1)} lbs</p>
          <p>Types: {pkm.types.map((t) => t.type.name).join(", ")}</p>
          {evoPokemon.map((p) => (
            <img src={p.sprites.front_default} />
          ))}
        </>
      ) : (
        <p>Loading Pokémon...</p>
      )}
    </>
  );
}

export default PokemonDetails;
