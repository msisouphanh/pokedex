import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { typeColors } from "../TypeColors";
import type { PkmType } from "../TypeColors";
import { capitalizeStr } from "../utils.ts";

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
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        const data = await res.json();
        setPkm(data);
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

  function statPercentage(stat: number) {
    const percentage = Math.min((stat / 255) * 100, 100);
    return percentage;
  }

  return (
    <>
      {pkm ? (
        <>
          <div className="w-full">
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
              {/* Card */}
              <div className="flex flex-col items-center md:w-[542px] h-[390px] flex-shrink-1 lg:flex-shrink-0">
                <div className="border dark bg-cardgray rounded-lg w-full h-full">
                  <div className="flex justify-center">
                    <h1>{capitalizeStr(pkm.name)}</h1>
                  </div>
                  <div className="flex justify-center m-4">
                    <img
                      className="w-[215px] h-[215px] mt-4"
                      src={pkm.sprites.other["official-artwork"].front_default}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {pkm.types.map((t) => (
                      <div key={t.type.name} className="flex flex-1 px-2">
                        <span
                          key={t.type.name}
                          className={`flex items-center justify-center w-full rounded-md text-gray-100 h-[47px] text-xl ${
                            typeColors[t.type.name as PkmType]
                          }  mt-5`}
                        >
                          {capitalizeStr(t.type.name)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-left ml-5 mr-5">{pkmDesc}</p>
                <div className="bg-cardgray rounded-lg ml-5 mr-5 ">
                  <div>
                    <div className="grid grid-cols-2 text-center">
                      <section>
                        <h2>Pokedex Number</h2>
                        <p>#{String(pkm.id).padStart(3, "0")}</p>
                      </section>
                      <section>
                        <h2>Abilities</h2>
                        <p>
                          {pkm.abilities
                            .map((p) => capitalizeStr(p.ability.name))
                            .join(", ")}
                        </p>
                      </section>
                      <section>
                        <h2>Weight</h2>
                        <p>{(pkm.weight * multiplier).toFixed(1)} lbs</p>
                      </section>
                      <section>
                        <h2>Height</h2>
                        <p>{pkm.height}</p>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-6xl mx-auto mt-5">
              <div className="flex flex-col">
                <div className="bg-cardgray rounded-lg p-4">
                  <h1 className="md:mx-1 text-center md:text-left font-bold mb-3">
                    Stats
                  </h1>

                  {/* Bars container */}
                  <div className="flex flex-row gap-3 md:gap-20 w-full">
                    {pkm.stats.map((p) => (
                      <div
                        key={p.stat.name}
                        className="flex flex-col items-center gap-3 flex-[1_1_120px]"
                      >
                        <div className="relative rounded h-[200px] w-full bg-bargray overflow-hidden text-center">
                          <div
                            className={`absolute bottom-0 w-full ${
                              typeColors[pkm.types[0].type.name as PkmType]
                            } transition-all duration-500`}
                            style={{
                              height: `${statPercentage(p.base_stat)}%`,
                            }}
                          />
                          <span className="absolute bottom-0 p-1 inset-x-0 text-white font-bold">
                            {p.base_stat}
                          </span>
                        </div>

                        <span className="text-sm text-white capitalize text-center w-full">
                          {p.stat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto my-5">
            {/* Evolutions */}
            <div className="flex flex-col">
              <div className="bg-cardgray rounded-lg w-auto">
                <h1 className="md:mx-5 text-center md:text-left">Evolutions</h1>
                <div className="flex flex-col flex-wrap justify-between items-center md:flex-row mx-4">
                  {evoPokemon.map((p) => (
                    <Link
                      key={p.name}
                      to={`/${p.name}`}
                      onClick={() => setPkm(p)}
                    >
                      <div className="bg-bargray rounded-2xl p-10 mb-3 mt-4 ">
                        <figure className="text-center">
                          <img
                            className="w-[150px] h-[150px]"
                            key={p.name}
                            src={
                              p.sprites.other["official-artwork"].front_default
                            }
                            alt={p.name}
                          />
                          <figcaption>{capitalizeStr(p.name)}</figcaption>
                          <div className="flex justify-center gap-2">
                            {p.types.map((t) => (
                              <div key={t.type.name} className="flex flex-1">
                                <span
                                  key={t.type.name}
                                  className={`flex items-center justify-center w-full rounded-md h-[47px] text-gray-100 text-xl ${
                                    typeColors[t.type.name as PkmType]
                                  }  mt-5`}
                                >
                                  {capitalizeStr(t.type.name)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </figure>
                      </div>
                    </Link>
                  ))}
                </div>
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
