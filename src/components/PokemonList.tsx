import { useState } from "react";

function PokemonList() {
  const url = "https://pokeapi.co/api/v2/pokemon/";
  const [currUrl, setUrl] = useState(url);

  fetch(currUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

  return (
    <>
      <div>p</div>
    </>
  );
}

export default PokemonList;
