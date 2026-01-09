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

  function capitalizeStr(str: string) {
    let result: string;
    result = str.charAt(0).toLocaleUpperCase() + str.slice(1);
    return result;
  }

  function statPercentage(stat: number) {
    const percentage = Math.min((stat / 255) * 100, 100);
    return percentage;
  }
  return (
    <>
      {pkm ? (
        <>
          <div className="w-full">
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-blue-500">
              {/* Card */}
              <div className="flex flex-col items-center bg-amber-600 md:w-[542px] h-[392px]">
                <div className="border rounded-lg w-full h-full">
                  <div className="flex justify-center">
                    <h1>{capitalizeStr(pkm.name)}</h1>
                  </div>
                  <div className="flex justify-center m-5">
                    <img
                      className="w-[215px] h-[215px]"
                      src={pkm.sprites.other["official-artwork"].front_default}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {pkm.types.map((t) => (
                      <div key={t.type.name} className="flex flex-1">
                        <span
                          key={t.type.name}
                          className="border text-center w-full rounded-md border-slate-700 ml-1 mr-1 px-3 py-1"
                        >
                          {capitalizeStr(t.type.name)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="m-2">{pkmDesc}</p>
                <div className="border rounded-lg mx-2">
                  <div className="grid grid-cols-2 text-center">
                    <section>
                      <h1>Pokedex Number</h1>
                      <p>#{String(pkm.id).padStart(3, "0")}</p>
                    </section>
                    <section>
                      <h1>Abilities</h1>
                      <p>
                        {pkm.abilities
                          .map((p) => capitalizeStr(p.ability.name))
                          .join(", ")}
                      </p>
                    </section>
                    <section>
                      <h1>Weight</h1>
                      <p>{(pkm.weight * multiplier).toFixed(1)} lbs</p>
                    </section>
                    <section>
                      <h1>Height</h1>
                      <p>{pkm.height}</p>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-6xl mx-auto">
              <div className="border rounded-lg">
                <h1>stats</h1>
                <div className="grid grid-cols-6 gap-6 bg-amber-950 ">
                  {pkm.stats.map((p) => (
                    <div
                      key={p.stat.name}
                      className="flex flex-col items-center gap-2"
                    >
                      {/* Bar container */}
                      <div className="relative rounded h-[200px] w-full max-w-[60px] lg:max-w-[100px] bg-gray-700 overflow-hidden text-center">
                        <div
                          className="absolute bottom-0 w-full bg-orange-500 transition-all duration-500"
                          style={{
                            height: `${statPercentage(p.base_stat)}%`,
                          }}
                        />
                        <span className="absolute bottom-0 p-4 inset-x-0 text-white font-bold">
                          {p.base_stat}
                        </span>
                      </div>
                      <span className="text-sm text-white capitalize text-center">
                        {p.stat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-6xl mx-auto">
            {/* Evolutions */}
            <div className="border rounded-lg">
              <h1>Evolutions</h1>
              <div className="flex flex-col justify-center items-center md:flex-row">
                {evoPokemon.map((p) => (
                  <figure className="text-center">
                    <img
                      key={p.name}
                      src={p.sprites.other["official-artwork"].front_default}
                    />
                    <figcaption>{p.name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading Pokémon...</p>
      )}
    </>
  );
}

export default PokemonDetails;
