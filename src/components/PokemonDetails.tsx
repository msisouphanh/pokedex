import { useParams, Link, useLocation } from "react-router-dom";
import { type Pokemon } from "../App.tsx";
import { useState, useEffect } from "react";

interface Chain {
  species: {
    name: string;
  };
  evolves_to: Chain[];
}

interface TextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface PokemonSpecies {
  flavor_text_entries: TextEntry[];
}

function PokemonDetails() {
  const location = useLocation();
  const multiplier = 0.220462;
  const { pokemonName } = useParams();
  const [pkmDesc, setPkmDesc] = useState<string>("");
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
      async function LoadPokedexEntry() {
        const res = await fetch(pkm!.species.url);
        const data = await res.json();

        function getPkmDesc(node: PokemonSpecies) {
          for (const child of node.flavor_text_entries) {
            if (child.language.name === "en") {
              return child.flavor_text
                .replace(/[\n\f]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();
            }
          }
        }

        const desc = getPkmDesc(data);
        setPkmDesc(desc!);
      }

      async function loadEvolutions() {
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
      LoadPokedexEntry();
      loadEvolutions();
    }
  }, [pkm, pokemonName]);

  return (
    <>
      {pkm ? (
        <>
          <div className="w-full flex justify-center flex-col md:flex-row items-start gap-6 px-4">
            {/* Card */}
            <div className="flex flex-col items-center md:items-start">
              <div className="border rounded-lg w-[542px] h-[392px]">
                <div className="flex justify-center">
                  <h1>
                    {pkm.name.charAt(0).toUpperCase() + pkm.name.slice(1)}
                  </h1>
                </div>
                <div className="flex justify-center m-5">
                  <img
                    className="w-[215px] h-[215px]"
                    src={pkm.sprites.other["official-artwork"].front_default}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {pkm.types.map((t) => (
                    <span
                      key={t.type.name}
                      className="border w-full rounded-md border-slate-700 px-3 py-1"
                    >
                      {t.type.name.charAt(0).toUpperCase() +
                        t.type.name.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-xl w-full">
              <p>{pkmDesc}</p>
            </div>
          </div>
          {pkm.stats.map((p) => (
            <p key={p.stat.name}>
              {p.stat.name} {p.base_stat}
            </p>
          ))}
          {pkm.abilities.map((p) => (
            <p key={p.ability.name}>{p.ability.name}</p>
          ))}
          <p>Weight: {(pkm.weight * multiplier).toFixed(1)} lbs</p>
          <p>Types: {pkm.types.map((t) => t.type.name).join(", ")}</p>
          {evoPokemon.map((p) => (
            <img
              key={p.name}
              src={p.sprites.other["official-artwork"].front_default}
            ></img>
          ))}
        </>
      ) : (
        <p>Loading Pokémon...</p>
      )}
    </>
  );
}

export default PokemonDetails;
