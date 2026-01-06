function collectNames(node, result = []) {
  result.push(node.name);

  for (const child of node.children) {
    collectNames(child, result);
  }

  return result;
}

const data = {
  name: "A",
  children: [
    {
      name: "B",
      children: [
        {
          name: "C",
          children: [],
        },
      ],
    },
  ],
};

console.log(collectNames(data));
