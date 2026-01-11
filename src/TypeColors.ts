export const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-sky-400",
  psychic: "bg-pink-800",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-600",
  dragon: "bg-indigo-600",
  dark: "bg-slate-700",
  steel: "bg-zinc-400",
  fairy: "bg-rose-300",
} as const;

export type PkmType = keyof typeof typeColors;
