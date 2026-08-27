export const SUN_DATA = {
  name: 'Sun',
  facts: {
    starType: 'G-type main-sequence (yellow dwarf)',
    surfaceTemp: '5,500°C',
    mass: '1.989 × 10^30 kg (333,000x Earth)',
    gravity: '274 m/s² (surface)',
    dayLength: '~27 Earth days (rotation varies by latitude)',
    composition: '~73% hydrogen, 25% helium, 2% heavier elements',
    funFacts: [
      'The Sun accounts for 99.8% of the total mass in the entire solar system.',
      'Light from the Sun takes about 8 minutes to reach Earth.',
      'The Sun is roughly 4.6 billion years old and is about halfway through its life cycle.',
      'Over 1.3 million Earths could fit inside the Sun by volume.'
    ]
  }
};

export const PLANETS = [
  {
    name: 'Mercury',
    radius: 1.2,
    distance: 20,
    color: 0x9c9c9c,
    texture: '/textures/2k_mercury.jpg',
    orbitSpeed: 4.15,
    rotationSpeed: 0.004,
    tilt: 0.03,
    facts: {
      diameter: '4,879 km',
      distanceFromSun: '57.9M km',
      orbitalPeriod: '88 days',
      moons: '0',
      mass: '3.30 × 10^23 kg (5.5% of Earth)',
      gravity: '3.7 m/s²',
      avgTemp: '167°C (ranges -180°C to 430°C)',
      dayLength: '176 Earth days',
      atmosphere: 'Virtually none — thin exosphere of oxygen, sodium, hydrogen',
      funFacts: [
        'A year on Mercury is shorter than its day.',
        'Despite being closest to the Sun, Venus is actually hotter due to its thick atmosphere.',
        'Mercury has no moons and almost no atmosphere to retain heat.',
        "It's the smallest planet in the solar system."
      ]
    }
  },
  {
    name: 'Venus',
    radius: 1.8,
    distance: 28,
    color: 0xe8c47a,
    texture: '/textures/2k_venus_surface.jpg',
    orbitSpeed: 1.62,
    rotationSpeed: 0.002,
    tilt: 3.1,
    facts: {
      diameter: '12,104 km',
      distanceFromSun: '108.2M km',
      orbitalPeriod: '225 days',
      moons: '0',
      mass: '4.87 × 10^24 kg (82% of Earth)',
      gravity: '8.87 m/s²',
      avgTemp: '464°C',
      dayLength: '243 Earth days (rotates backwards)',
      atmosphere: '96.5% carbon dioxide, thick sulfuric acid clouds',
      funFacts: [
        'Venus spins backwards compared to most planets.',
        'A day on Venus is longer than its year.',
        'It is the hottest planet in the solar system, hotter than Mercury.',
        'Venus is the brightest natural object in the night sky after the Moon.'
      ]
    }
  },
  {
    name: 'Earth',
    radius: 2,
    distance: 38,
    color: 0x2266cc,
    texture: '/textures/2k_earth_daymap.jpg',
    orbitSpeed: 1,
    rotationSpeed: 0.02,
    tilt: 0.41,
    facts: {
      diameter: '12,742 km',
      distanceFromSun: '149.6M km',
      orbitalPeriod: '365.25 days',
      moons: '1',
      mass: '5.97 × 10^24 kg',
      gravity: '9.8 m/s²',
      avgTemp: '15°C',
      dayLength: '24 hours',
      atmosphere: '78% nitrogen, 21% oxygen, trace gases',
      funFacts: [
        'Earth is the only known planet with liquid water on its surface.',
        "Earth's atmosphere protects it from most meteoroids, which burn up before reaching the surface.",
        'About 71% of the surface is covered by oceans.',
        "Earth's rotation is gradually slowing down by about 1.7 milliseconds per century."
      ]
    }
  },
  {
    name: 'Mars',
    radius: 1.5,
    distance: 48,
    color: 0xc1440e,
    texture: '/textures/2k_mars.jpg',
    orbitSpeed: 0.53,
    rotationSpeed: 0.018,
    tilt: 0.44,
    facts: {
      diameter: '6,779 km',
      distanceFromSun: '227.9M km',
      orbitalPeriod: '687 days',
      moons: '2',
      mass: '6.42 × 10^23 kg (10.7% of Earth)',
      gravity: '3.71 m/s²',
      avgTemp: '-63°C',
      dayLength: '24.6 hours',
      atmosphere: "95% carbon dioxide, very thin (0.6% of Earth's pressure)",
      funFacts: [
        'Mars is home to Olympus Mons, the tallest volcano in the solar system.',
        'Mars has seasons similar to Earth because of its similar axial tilt.',
        'Its red color comes from iron oxide (rust) on its surface.',
        "Mars's two moons, Phobos and Deimos, are thought to be captured asteroids."
      ]
    }
  },
  {
    name: 'Jupiter',
    radius: 5.5,
    distance: 68,
    color: 0xd8ac6f,
    texture: '/textures/2k_jupiter.jpg',
    orbitSpeed: 0.084,
    rotationSpeed: 0.04,
    tilt: 0.05,
    facts: {
      diameter: '139,820 km',
      distanceFromSun: '778.5M km',
      orbitalPeriod: '11.9 years',
      moons: '95',
      mass: '1.898 × 10^27 kg (318x Earth)',
      gravity: '24.79 m/s²',
      avgTemp: '-110°C',
      dayLength: '9.9 hours',
      atmosphere: '90% hydrogen, 10% helium',
      funFacts: [
        "Jupiter's Great Red Spot is a storm larger than Earth that has raged for centuries.",
        'Jupiter acts as a cosmic vacuum cleaner, its gravity pulling in comets and asteroids that might otherwise hit Earth.',
        'It has the shortest day of any planet despite being the largest.',
        'Jupiter is more than twice as massive as all other planets combined.'
      ]
    }
  },
  {
    name: 'Saturn',
    radius: 4.8,
    distance: 88,
    color: 0xead6a0,
    texture: '/textures/2k_saturn.jpg',
    hasRings: true,
    orbitSpeed: 0.034,
    rotationSpeed: 0.038,
    tilt: 0.47,
    facts: {
      diameter: '116,460 km',
      distanceFromSun: '1.43B km',
      orbitalPeriod: '29.5 years',
      moons: '146',
      mass: '5.68 × 10^26 kg (95x Earth)',
      gravity: '10.44 m/s²',
      avgTemp: '-140°C',
      dayLength: '10.7 hours',
      atmosphere: '96% hydrogen, 3% helium',
      funFacts: [
        'Saturn would float in water — it is less dense than H2O.',
        "Saturn's rings are made mostly of ice particles, with some rocky debris.",
        'Winds in its atmosphere can reach 1,800 km/h.',
        'It has the second-largest moon in the solar system, Titan, which has its own atmosphere.'
      ]
    }
  },
  {
    name: 'Uranus',
    radius: 3.2,
    distance: 105,
    color: 0x9fe3e3,
    texture: '/textures/2k_uranus.jpg',
    orbitSpeed: 0.012,
    rotationSpeed: 0.03,
    tilt: 1.71,
    facts: {
      diameter: '50,724 km',
      distanceFromSun: '2.87B km',
      orbitalPeriod: '84 years',
      moons: '28',
      mass: '8.68 × 10^25 kg (14.5x Earth)',
      gravity: '8.69 m/s²',
      avgTemp: '-195°C',
      dayLength: '17.2 hours (rotates on its side)',
      atmosphere: 'Hydrogen, helium, methane (gives it a blue-green color)',
      funFacts: [
        'Uranus rotates on its side, almost perpendicular to its orbit.',
        'It was the first planet discovered using a telescope, by William Herschel in 1781.',
        'Uranus has 13 known faint rings.',
        'A season on Uranus lasts about 21 Earth years.'
      ]
    }
  },
  {
    name: 'Neptune',
    radius: 3.1,
    distance: 120,
    color: 0x3f54ba,
    texture: '/textures/2k_neptune.jpg',
    orbitSpeed: 0.006,
    rotationSpeed: 0.032,
    tilt: 0.49,
    facts: {
      diameter: '49,244 km',
      distanceFromSun: '4.5B km',
      orbitalPeriod: '165 years',
      moons: '16',
      mass: '1.02 × 10^26 kg (17.1x Earth)',
      gravity: '11.15 m/s²',
      avgTemp: '-200°C',
      dayLength: '16.1 hours',
      atmosphere: 'Hydrogen, helium, methane',
      funFacts: [
        'Neptune has the strongest winds in the solar system, up to 2,100 km/h.',
        'Neptune was predicted mathematically before it was directly observed.',
        'It takes 165 Earth years to complete one orbit around the Sun.',
        'Its largest moon, Triton, orbits backwards and is likely a captured object.'
      ]
    }
  }
];
