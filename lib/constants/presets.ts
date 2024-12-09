export const PRESETS = [
  {
    id: "lofi-chill",
    name: "LoFi Chill",
    settings: {
      tempo: 85,
      pitch: -2,
      vinylCrackle: 30,
      tapeWarble: 20,
      ambientSounds: {
        rain: true,
        coffeeShop: false,
        forest: false
      }
    }
  },
  {
    id: "study-beats",
    name: "Study Beats",
    settings: {
      tempo: 90,
      pitch: -1,
      vinylCrackle: 20,
      tapeWarble: 15,
      ambientSounds: {
        rain: false,
        coffeeShop: true,
        forest: false
      }
    }
  },
  {
    id: "night-vibes",
    name: "Night Vibes",
    settings: {
      tempo: 80,
      pitch: -3,
      vinylCrackle: 40,
      tapeWarble: 25,
      ambientSounds: {
        rain: true,
        coffeeShop: false,
        forest: true
      }
    }
  }
];