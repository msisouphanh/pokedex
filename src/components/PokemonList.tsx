import { Link } from "react-router-dom";
import { type Pokemon } from "../App.tsx";

interface Props {
  pokemon: Pokemon[];
  onLoadMore: () => void;
}

function PokemonList({ pokemon, onLoadMore }: Props) {
  return (
    <>
      <div className="grid grid-cols-5">
        {pokemon.map((pkm) => (
          <Link key={pkm.name} to={`/${pkm.name}`} state={pkm}>
            <figure className="flex flex-col justify-center items-center">
              <img
                src={pkm.sprites.other["official-artwork"].front_default}
                alt={pkm.name}
              />
              <figcaption>{pkm.name}</figcaption>
            </figure>
          </Link>
        ))}
      </div>

      <button onClick={onLoadMore}>view more</button>
    </>
  );
}

export default PokemonList;
