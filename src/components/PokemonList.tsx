import { Link } from "react-router-dom";
import { type Pokemon } from "../App.tsx";
import { typeColors } from "../TypeColors";
import type { PkmType } from "../TypeColors";
import { capitalizeStr } from "../utils.ts";

interface Props {
  pokemon: Pokemon[];
  onLoadMore: () => void;
}

function PokemonList({ pokemon, onLoadMore }: Props) {
  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pokemon.map((pkm) => (
            <Link key={pkm.name} to={`/${pkm.name}`} state={pkm}>
              <figure className="flex flex-col justify-center items-center bg-bargray rounded-lg p-4">
                <img
                  className="w-[215px] h-[215px] object-contain"
                  src={pkm.sprites.other["official-artwork"].front_default}
                  alt={pkm.name}
                />
                <figcaption className="mt-2 text-white font-bold">
                  {capitalizeStr(pkm.name)}
                </figcaption>
                <div className="flex gap-2 mt-2">
                  {pkm.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={`flex items-center justify-center px-3 py-1 rounded-md text-gray-100 text-sm ${
                        typeColors[t.type.name as PkmType]
                      }`}
                    >
                      {capitalizeStr(t.type.name)}
                    </span>
                  ))}
                </div>
              </figure>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mx-auto">
          <button
            className="rounded-md bg-gray-500 my-5 w-[85px]"
            onClick={onLoadMore}
          >
            View More
          </button>
        </div>
      </div>
    </>
  );
}

export default PokemonList;
