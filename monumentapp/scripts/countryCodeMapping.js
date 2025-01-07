import countries from '../data/world.json';

export const countryCodeMap = countries.reduce((map, country) => {
  map[country.en] = country.alpha2.toLowerCase();
  return map;
}, {});