const color = [
  'orangered',
  'gold',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
];

export const getColor = (key) => {
  key %= color.length;
  return color[key];
};

export default {getColor};
