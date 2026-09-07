// src/data/weatherFactsData.js
// ─────────────────────────────────────────────────────────────────────────────
// Curated dataset of 115+ educational, delightful weather and climate facts.
// Categorized across: Rain, Thunderstorm, Snow, Clear Sky, Clouds, Wind, Fog,
// Heat, Cold, Climate, Atmosphere, Space & Earth, Seasons, Oceans, Monsoons.
// ─────────────────────────────────────────────────────────────────────────────

export const WEATHER_FACTS = [
  // ── 1. RAIN (10 facts) ──
  {
    id: 'rain-1',
    category: 'Rain',
    headline: 'The Scent of Fresh Rain',
    fact: 'The earthy smell produced when rain falls on dry soil is called petrichor. It is caused by geosmin, an organic compound made by soil microbes that human noses can detect in parts per trillion.',
  },
  {
    id: 'rain-2',
    category: 'Rain',
    headline: 'Raindrops Are Not Tear-Shaped',
    fact: 'As raindrops fall through the air, air resistance flattens their bottom. They actually resemble tiny hamburger buns rather than traditional teardrops.',
  },
  {
    id: 'rain-3',
    category: 'Rain',
    headline: 'Phantom Rain',
    fact: 'Virga is rain that evaporates before it ever touches the ground. It appears as delicate grey streaks trailing from clouds into dry air below.',
  },
  {
    id: 'rain-4',
    category: 'Rain',
    headline: 'Speed of a Droplet',
    fact: 'A typical raindrop falls at speeds between 15 and 30 km/h (9 to 19 mph), depending on its diameter and aerodynamic drag.',
  },
  {
    id: 'rain-5',
    category: 'Rain',
    headline: 'Acid Rain Discoveries',
    fact: 'Pure unpolluted rain is naturally slightly acidic with a pH of around 5.6 due to dissolved carbon dioxide forming mild carbonic acid.',
  },
  {
    id: 'rain-6',
    category: 'Rain',
    headline: 'The Wettest Inhabited Place',
    fact: 'Mawsynram in Meghalaya, India, receives an astounding average of nearly 11,872 millimeters (467 inches) of rain each year.',
  },
  {
    id: 'rain-7',
    category: 'Rain',
    headline: 'Rain Without Clouds',
    fact: 'Serein refers to light rain falling from an apparently cloudless sky, typically caused by wind carrying distant droplets aloft.',
  },
  {
    id: 'rain-8',
    category: 'Rain',
    headline: 'Raindrop Size Limit',
    fact: 'Raindrops rarely exceed 6 millimeters in diameter. Once they grow larger than that, air resistance tears them apart into smaller drops.',
  },
  {
    id: 'rain-9',
    category: 'Rain',
    headline: 'Rain on Other Worlds',
    fact: 'On Venus, raindrops are composed of sulfuric acid that evaporates before hitting the searing surface. On Saturn’s moon Titan, clouds rain liquid methane.',
  },
  {
    id: 'rain-10',
    category: 'Rain',
    headline: 'Plant Chemistry and Odor',
    fact: 'Plants release aromatic oils during prolonged dry spells. When rain arrives, these oils are launched into the air by aerosol bubbles forming upon impact.',
  },

  // ── 2. THUNDERSTORM & LIGHTNING (9 facts) ──
  {
    id: 'storm-1',
    category: 'Thunderstorm',
    headline: 'Hotter than the Sun’s Surface',
    fact: 'A single channel of lightning can heat the surrounding air to 30,000°C (54,000°F)—roughly five times hotter than the surface of the Sun.',
  },
  {
    id: 'storm-2',
    category: 'Thunderstorm',
    headline: 'The Birth of Thunder',
    fact: 'Thunder is the acoustic shockwave caused by air rapidly expanding and contracting when flash-heated by lightning in milliseconds.',
  },
  {
    id: 'storm-3',
    category: 'Thunderstorm',
    headline: 'Earth’s Lightning Capital',
    fact: 'Lake Maracaibo in Venezuela experiences lightning up to 300 nights a year, producing an average of 250 lightning flashes per square kilometer annually.',
  },
  {
    id: 'storm-4',
    category: 'Thunderstorm',
    headline: 'Upper-Atmospheric Sprites',
    fact: 'Red sprites and blue jets are electrical discharges that fire upwards into the mesosphere high above storm clouds, spanning tens of kilometers.',
  },
  {
    id: 'storm-5',
    category: 'Thunderstorm',
    headline: 'Volcanic Lightning',
    fact: 'Violent volcanic plumes generate their own lightning when ash particles rub together, building immense static charges in the eruption column.',
  },
  {
    id: 'storm-6',
    category: 'Thunderstorm',
    headline: 'Fulgarite Glass Fossils',
    fact: 'When lightning strikes quartz-rich sand, it can instantly melt the grains into hollow, glassy rock tubes known as fulgurites.',
  },
  {
    id: 'storm-7',
    category: 'Thunderstorm',
    headline: 'Thunderstorms Around the Globe',
    fact: 'At any given second, roughly 2,000 thunderstorms are active across the globe, generating over 100 lightning flashes per second.',
  },
  {
    id: 'storm-8',
    category: 'Thunderstorm',
    headline: 'Lightning Travels Upwards',
    fact: 'While a lightning stroke originates in the cloud, the visible return stroke travels from the ground upward at about one-third the speed of light.',
  },
  {
    id: 'storm-9',
    category: 'Thunderstorm',
    headline: 'Antimatter in Storms',
    fact: 'Terrestrial Gamma-ray Flashes produced during intense lightning strikes can produce positrons—the antimatter counterpart of electrons.',
  },

  // ── 3. SNOW & ICE (9 facts) ──
  {
    id: 'snow-1',
    category: 'Snow',
    headline: 'Snow Is Actually Clear',
    fact: 'Snow is not white; ice crystals are completely translucent. Snow appears white because its complex crystalline facets reflect all wavelengths of visible light equally.',
  },
  {
    id: 'snow-2',
    category: 'Snow',
    headline: 'The Acoustic Blanket',
    fact: 'Freshly fallen snow absorbs sound waves with up to 90% acoustic porosity, creating the profound, hushed silence experienced after a snowfall.',
  },
  {
    id: 'snow-3',
    category: 'Snow',
    headline: 'Hexagonal Symmetry',
    fact: 'Every snowflake possesses six-fold radial symmetry because water molecules naturally bond at 60-degree angles as they freeze into ice lattices.',
  },
  {
    id: 'snow-4',
    category: 'Snow',
    headline: 'Watermelon Snow',
    fact: 'High alpine snow can turn bright pink or red due to Chlamydomonas nivalis, a cold-loving green alga that produces red carotenoid pigments to shield itself from UV rays.',
  },
  {
    id: 'snow-5',
    category: 'Snow',
    headline: 'World’s Largest Snowflake',
    fact: 'The Guinness World Record snowflake fell in Fort Keogh, Montana in 1887. Ranch personnel reported it measured 38 centimeters (15 inches) wide.',
  },
  {
    id: 'snow-6',
    category: 'Snow',
    headline: 'Snow Traps Air',
    fact: 'Fresh dry snow can be up to 95% trapped air, making it an extraordinary natural insulator for burrowing animals and plant roots.',
  },
  {
    id: 'snow-7',
    category: 'Snow',
    headline: 'Graupel vs Hail',
    fact: 'Graupel, or soft hail, forms when supercooled water droplets freeze onto the surface of a falling snowflake, creating a soft, crumbly ice pellet.',
  },
  {
    id: 'snow-8',
    category: 'Snow',
    headline: 'Snowfall Speed',
    fact: 'Snowflakes fall at leisurely speeds of 1.5 to 6 km/h (1 to 4 mph), taking up to an hour to drift down from high-altitude clouds.',
  },
  {
    id: 'snow-9',
    category: 'Snow',
    headline: 'Thundersnow Rarity',
    fact: 'Thundersnow occurs when a convective thunderstorm produces snow instead of rain. It happens in fewer than 0.01% of recorded snowstorms.',
  },

  // ── 4. CLOUDS (8 facts) ──
  {
    id: 'cloud-1',
    category: 'Clouds',
    headline: 'The Weight of a Cloud',
    fact: 'A standard cumulus cloud weighing roughly 500,000 kilograms (1.1 million pounds) floats effortlessly because the warm air beneath it is even denser.',
  },
  {
    id: 'cloud-2',
    category: 'Clouds',
    headline: 'Noctilucent Clouds',
    fact: 'Noctilucent or night-shining clouds form in the mesosphere 80 kilometers above Earth. They are composed of ice crystals nucleated on micrometeorite dust.',
  },
  {
    id: 'cloud-3',
    category: 'Clouds',
    headline: 'Mammatus Clouds',
    fact: 'Mammatus clouds are rare pouch-like structures that hang underneath storm anvils, formed by pockets of cold, moist air sinking into warmer air.',
  },
  {
    id: 'cloud-4',
    category: 'Clouds',
    headline: 'Lenticular UFO Clouds',
    fact: 'Smooth, saucer-like lenticular clouds form when moist air is forced over mountain crests, condensing into stationary standing wave formations.',
  },
  {
    id: 'cloud-5',
    category: 'Clouds',
    headline: 'Contrail Cloud Seeding',
    fact: 'Jet engine exhaust contains water vapor and soot particles that trigger artificial cirrus clouds known as condensation trails or contrails.',
  },
  {
    id: 'cloud-6',
    category: 'Clouds',
    headline: 'Cloud Lifetime',
    fact: 'A fair-weather cumulus cloud often lives for only 10 to 20 minutes before evaporating completely as dry air mixes into its perimeter.',
  },
  {
    id: 'cloud-7',
    category: 'Clouds',
    headline: 'Cirrus Ice Crystals',
    fact: 'Wispy cirrus clouds consist entirely of microscopic ice crystals suspended between 6,000 and 12,000 meters above sea level.',
  },
  {
    id: 'cloud-8',
    category: 'Clouds',
    headline: 'The Highest Troposphere Clouds',
    fact: 'Cumulonimbus anvils in the tropics can punch through the tropopause to reach altitudes of 20,000 meters (65,000 feet) into the lower stratosphere.',
  },

  // ── 5. WIND & STORMS (8 facts) ──
  {
    id: 'wind-1',
    category: 'Wind',
    headline: 'The Global Jet Streams',
    fact: 'Jet streams are narrow ribbons of powerful wind high in the troposphere that can blow faster than 400 km/h (250 mph), significantly shaving flight times for eastbound airliners.',
  },
  {
    id: 'wind-2',
    category: 'Wind',
    headline: 'Fastest Surface Wind Ever',
    fact: 'The highest non-tornadic wind gust recorded on Earth reached 408 km/h (253 mph) on Barrow Island, Australia, during Tropical Cyclone Olivia in 1996.',
  },
  {
    id: 'wind-3',
    category: 'Wind',
    headline: 'The Coriolis Curvature',
    fact: 'Because Earth rotates beneath circulating air, large-scale winds curve to the right in the Northern Hemisphere and to the left in the Southern Hemisphere.',
  },
  {
    id: 'wind-4',
    category: 'Wind',
    headline: 'Chinook "Snow Eaters"',
    fact: 'Chinook winds descending the eastern slopes of the Rocky Mountains can cause temperatures to rise by 20°C (36°F) in a matter of minutes, sublimating feet of snow.',
  },
  {
    id: 'wind-5',
    category: 'Wind',
    headline: 'The Roaring Forties',
    fact: 'Between 40° and 50° South latitude, unobstructed ocean expanse creates the continuous, gale-force winds sailors historically dubbed the Roaring Forties.',
  },
  {
    id: 'wind-6',
    category: 'Wind',
    headline: 'Solar Wind Connection',
    fact: 'Earth’s weather winds are entirely solar-driven: unequal solar heating between the equator and poles creates atmospheric pressure differentials that drive global circulation.',
  },
  {
    id: 'wind-7',
    category: 'Wind',
    headline: 'Haboob Dust Storms',
    fact: 'Haboobs are colossal dust walls pushed ahead of dying thunderstorms in arid regions, sometimes reaching heights of 1,500 meters and moving at highway speeds.',
  },
  {
    id: 'wind-8',
    category: 'Wind',
    headline: 'Doldrums at the Equator',
    fact: 'The Intertropical Convergence Zone features warm, rising air currents that frequently leave sailing ships stranded in glassy, windless calm for weeks.',
  },

  // ── 6. CLEAR SKY & SUNLIGHT (7 facts) ──
  {
    id: 'clear-1',
    category: 'Clear Sky',
    headline: 'Why the Sky Is Blue',
    fact: 'Rayleigh scattering causes nitrogen and oxygen molecules in our atmosphere to scatter short-wavelength blue light much more efficiently than other colors.',
  },
  {
    id: 'clear-2',
    category: 'Clear Sky',
    headline: 'Sunlight’s 8-Minute Journey',
    fact: 'The sunlight illuminating your day traveled 150 million kilometers in about 8 minutes and 20 seconds, but took tens of thousands of years to escape the Sun’s core.',
  },
  {
    id: 'clear-3',
    category: 'Clear Sky',
    headline: 'The Elusive Green Flash',
    fact: 'Just as the Sun dips below a clean oceanic horizon, atmospheric refraction can bend green wavelengths toward the viewer, creating a split-second flash of emerald light.',
  },
  {
    id: 'clear-4',
    category: 'Clear Sky',
    headline: 'Red Sunsets Explained',
    fact: 'At dusk, sunlight travels through up to 10 times more atmosphere than at noon. Blue light scatters away completely, leaving only warm red and amber wavelengths.',
  },
  {
    id: 'clear-5',
    category: 'Clear Sky',
    headline: 'Crepuscular Rays',
    fact: 'God rays or crepuscular beams appear to radiate from the Sun due to perspective, but are actually parallel shafts of light filtered between mountain gaps or clouds.',
  },
  {
    id: 'clear-6',
    category: 'Clear Sky',
    headline: 'Solar Constant',
    fact: 'Earth receives approximately 1,361 Watts of solar radiation per square meter at the top of the atmosphere—an influx of energy powering all terrestrial weather.',
  },
  {
    id: 'clear-7',
    category: 'Clear Sky',
    headline: 'Albedo Reflection',
    fact: 'Fresh snow reflects up to 90% of incoming sunlight back into space, whereas ocean water absorbs more than 90%, profoundly influencing global heat distribution.',
  },

  // ── 7. FOG & MIST (6 facts) ──
  {
    id: 'fog-1',
    category: 'Fog',
    headline: 'Fog Is a Cloud on the Ground',
    fact: 'Fog and clouds are identical from a meteorological standpoint. Fog is simply a stratus cloud that has condensed at ground level when air cools to its dew point.',
  },
  {
    id: 'fog-2',
    category: 'Fog',
    headline: 'Freezing Fog Crystals',
    fact: 'When liquid droplets in fog remain unfrozen below 0°C (supercooled) and strike cold trees or fences, they instantly form stunning white rime ice needles.',
  },
  {
    id: 'fog-3',
    category: 'Fog',
    headline: 'San Francisco’s Fog Name',
    fact: 'San Francisco locals colloquially named their famous summer advection fog "Karl the Fog." It forms when hot inland air draws cold maritime Pacific air through the Golden Gate.',
  },
  {
    id: 'fog-4',
    category: 'Fog',
    headline: 'Fog Catcher Nets',
    fact: 'In arid coastal deserts like the Atacama, communities use vertical mesh nets to harvest drinking water directly from condensation in passing fog banks.',
  },
  {
    id: 'fog-5',
    category: 'Fog',
    headline: 'Radiation Fog Evenings',
    fact: 'Radiation fog forms on clear, calm autumn nights when the land radiatively cools into space, chilling the lowest layer of humid air down to saturation.',
  },
  {
    id: 'fog-6',
    category: 'Fog',
    headline: 'Fogbows or White Rainbows',
    fact: 'When sunlight strikes fog, the microscopic droplet size causes diffraction to wash out spectral colors, producing a ghostly, completely white rainbow called a fogbow.',
  },

  // ── 8. HEAT & DESERTS (7 facts) ──
  {
    id: 'heat-1',
    category: 'Heat',
    headline: 'Hottest Natural Ground Temp',
    fact: 'While air temperature in Death Valley once reached 56.7°C (134°F), NASA satellites have measured ground surface temperatures in Iran’s Lut Desert topping 70.7°C (159°F).',
  },
  {
    id: 'heat-2',
    category: 'Heat',
    headline: 'Urban Heat Island Effect',
    fact: 'Dense urban centers can be up to 5°C to 10°C hotter than surrounding rural landscapes due to asphalt and concrete absorbing and re-radiating thermal energy.',
  },
  {
    id: 'heat-3',
    category: 'Heat',
    headline: 'The Wet-Bulb Threshold',
    fact: 'A wet-bulb temperature of 35°C (95°F) at 100% relative humidity marks the biological limit of human endurance, where perspiration cannot evaporate to cool the body.',
  },
  {
    id: 'heat-4',
    category: 'Heat',
    headline: 'Infernal Mirage Optics',
    fact: 'A mirage is not an optical illusion but real light refraction: hot air layers near the ground bend sky light upward, creating the shimmering appearance of reflective water.',
  },
  {
    id: 'heat-5',
    category: 'Heat',
    headline: 'Rainy Deserts',
    fact: 'Antarctica is technically the world’s largest desert: it receives less than 50 millimeters (2 inches) of precipitation on its interior plateau each year.',
  },
  {
    id: 'heat-6',
    category: 'Heat',
    headline: 'Heat Bursts Overnight',
    fact: 'A heat burst is a rare nocturnal phenomenon where dying storm downdrafts rapidly compress and warm, causing midnight temperatures to spike by 15°C within minutes.',
  },
  {
    id: 'heat-7',
    category: 'Heat',
    headline: 'The Equator Isn’t the Hottest',
    fact: 'The hottest places on Earth are subtropical desert belts around 25°–30° latitude, where descending air suppresses cloud formation and exposes land to uninterrupted sun.',
  },

  // ── 9. COLD & POLAR (7 facts) ──
  {
    id: 'cold-1',
    category: 'Cold',
    headline: 'Coldest Temperature on Earth',
    fact: 'The lowest natural temperature recorded directly on Earth’s surface was -89.2°C (-128.6°F) at Soviet Vostok Station in Antarctica on July 21, 1983.',
  },
  {
    id: 'cold-2',
    category: 'Cold',
    headline: 'Supercooled Liquid Water',
    fact: 'High-purity water without airborne dust particles can remain completely liquid down to -40°C (-40°F) before spontaneous ice crystallization occurs.',
  },
  {
    id: 'cold-3',
    category: 'Cold',
    headline: 'Cryoseisms or Frost Quakes',
    fact: 'During sudden, severe deep freezes, underground water can freeze and expand so rapidly that it fractures subterranean bedrock with a booming seismic jolt.',
  },
  {
    id: 'cold-4',
    category: 'Cold',
    headline: 'Windchill Physics',
    fact: 'Wind chill does not actually lower the thermometer temperature of an object; it merely accelerates the rate at which warm bodies lose thermal energy to surrounding air.',
  },
  {
    id: 'cold-5',
    category: 'Cold',
    headline: 'Diamond Dust Halos',
    fact: 'In extreme polar cold, tiny ice crystals suspended in clear ground air create spectacular solar halos, sun dogs, and light pillars through precise optical refraction.',
  },
  {
    id: 'cold-6',
    category: 'Cold',
    headline: 'Coldest Inhabited Town',
    fact: 'Oymyakon in northeastern Russia has a recorded record low of -71.2°C (-96.2°F). Children attend school until temperatures drop below -52°C.',
  },
  {
    id: 'cold-7',
    category: 'Cold',
    headline: 'Permafrost Carbon Sink',
    fact: 'Global permafrost soils store twice as much carbon as is currently present in Earth’s entire atmosphere, locked in deep freeze since the last Ice Age.',
  },

  // ── 10. ATMOSPHERE & AIR (8 facts) ──
  {
    id: 'atmo-1',
    category: 'Atmosphere',
    headline: 'Thickness of an Apple Skin',
    fact: 'Relative to the diameter of Earth, our breathable atmosphere is thinner than the skin on an ordinary apple—with 75% of its mass packed within just 11 km of sea level.',
  },
  {
    id: 'atmo-2',
    category: 'Atmosphere',
    headline: '1 Ton of Air Pressure',
    fact: 'At sea level, air exerts approximately 1 kilogram of force per square centimeter (14.7 pounds per square inch). Over an adult human body, that equals about 10 tons of continuous pressure.',
  },
  {
    id: 'atmo-3',
    category: 'Atmosphere',
    headline: 'The Ozone Shield',
    fact: 'If all the ozone in the stratosphere were compressed to sea-level pressure, it would form a protective layer only 3 millimeters (about the thickness of two pennies) thick.',
  },
  {
    id: 'atmo-4',
    category: 'Atmosphere',
    headline: 'Atmospheric River Transports',
    fact: 'Atmospheric rivers are massive plumes of water vapor that carry more moisture than the flow at the mouth of the Amazon River, fueling intense regional rainfall.',
  },
  {
    id: 'atmo-5',
    category: 'Atmosphere',
    headline: 'The Karman Line',
    fact: 'The boundary between Earth’s atmosphere and outer space is recognized at 100 kilometers (62 miles) above sea level, where aerodynamic lift ceases to support flight.',
  },
  {
    id: 'atmo-6',
    category: 'Atmosphere',
    headline: 'Air Molecule Speeds',
    fact: 'At comfortable room temperature, nitrogen and oxygen molecules in the air are ricocheting into each other at roughly 1,800 km/h (1,100 mph).',
  },
  {
    id: 'atmo-7',
    category: 'Atmosphere',
    headline: 'Dust That Crosses Oceans',
    fact: 'Nutrient-rich dust lifted from the Bodélé Depression in the Sahara Desert travels thousands of miles across the Atlantic to fertilize the Amazon Rainforest.',
  },
  {
    id: 'atmo-8',
    category: 'Atmosphere',
    headline: 'Pressure and Boiling Points',
    fact: 'On top of Mount Everest (8,848 meters), reduced atmospheric pressure causes water to boil at just 68°C (154°F), making it impossible to cook a hard-boiled egg.',
  },

  // ── 11. OCEANS & CURRENTS (8 facts) ──
  {
    id: 'ocean-1',
    category: 'Oceans',
    headline: 'The Ocean Heat Reservoir',
    fact: 'The top 3 meters (10 feet) of the ocean contains more thermal energy than Earth’s entire atmosphere combined, making oceans the primary buffer of global weather.',
  },
  {
    id: 'ocean-2',
    category: 'Oceans',
    headline: 'The Gulf Stream Engine',
    fact: 'The Gulf Stream moves more water volume than all the rivers on Earth combined, carrying equatorial heat northeast to give Western Europe a remarkably temperate climate.',
  },
  {
    id: 'ocean-3',
    category: 'Oceans',
    headline: 'The Great Conveyor Belt',
    fact: 'Thermohaline circulation takes approximately 1,000 years for a single parcel of water to complete one full global loop through deep Atlantic and shallow Pacific paths.',
  },
  {
    id: 'ocean-4',
    category: 'Oceans',
    headline: 'Plankton Oxygen Factory',
    fact: 'Between 50% and 80% of the oxygen on Earth is produced by marine phytoplankton through photosynthesis in the upper sunlit layers of the ocean.',
  },
  {
    id: 'ocean-5',
    category: 'Oceans',
    headline: 'El Niño Oscillation',
    fact: 'El Niño occurs when equatorial Pacific trade winds weaken, allowing warm surface waters to surge eastward and shifting global storm tracks worldwide.',
  },
  {
    id: 'ocean-6',
    category: 'Oceans',
    headline: 'Sea Breeze Dynamics',
    fact: 'During sunny days, land warms faster than coastal water. Rising warm air over land pulls cool ocean breezes onshore, reversing at night into a gentle land breeze.',
  },
  {
    id: 'ocean-7',
    category: 'Oceans',
    headline: 'Internal Waves',
    fact: 'Beneath the ocean surface, underwater waves up to 200 meters tall can travel between water layers of different densities without ever breaking surface waters.',
  },
  {
    id: 'ocean-8',
    category: 'Oceans',
    headline: 'Ocean Acidification Chemistry',
    fact: 'Earth’s oceans have absorbed roughly 30% of human-emitted carbon dioxide, leading to a 26% increase in surface water acidity since the Industrial Revolution.',
  },

  // ── 12. MONSOONS & SEASONS (8 facts) ──
  {
    id: 'monsoon-1',
    category: 'Monsoons',
    headline: 'The Meaning of Monsoon',
    fact: 'The word "monsoon" originates from the Arabic word "mausim," which means season. It describes a seasonal reversal of wind patterns, not individual downpours.',
  },
  {
    id: 'monsoon-2',
    category: 'Monsoons',
    headline: 'Tibetan Plateau Thermal Pump',
    fact: 'The high-altitude heating of the Tibetan Plateau acts like an enormous solar chimney in summer, drawing moisture-laden winds off the Indian Ocean to spark the South Asian monsoon.',
  },
  {
    id: 'monsoon-3',
    category: 'Seasons',
    headline: 'Seasons Aren’t Distance-Based',
    fact: 'Earth is actually closest to the Sun (perihelion) in early January. Our seasons are governed entirely by Earth’s 23.5-degree axial tilt, not orbital distance.',
  },
  {
    id: 'monsoon-4',
    category: 'Seasons',
    headline: 'Midnight Sun Phenomenon',
    fact: 'North of the Arctic Circle, the Sun does not set below the horizon for consecutive weeks during the summer solstice due to the northern hemisphere’s solar tilt.',
  },
  {
    id: 'monsoon-5',
    category: 'Monsoons',
    headline: 'Agricultural Lifeline',
    fact: 'Over 60% of India’s agriculture and nearly 70% of its annual rainfall depends directly on the four-month southwest monsoon between June and September.',
  },
  {
    id: 'monsoon-6',
    category: 'Seasons',
    headline: 'Equinox Equality',
    fact: 'During the vernal and autumnal equinoxes, the geometric center of the Sun spends an exact equal duration above and below the horizon across every point on Earth.',
  },
  {
    id: 'monsoon-7',
    category: 'Seasons',
    headline: 'Thermal Lag of Summer',
    fact: 'The summer solstice occurs in June in the Northern Hemisphere, yet July and August are typically warmer due to the ocean and land taking weeks to absorb seasonal heat.',
  },
  {
    id: 'monsoon-8',
    category: 'Monsoons',
    headline: 'North American Monsoon',
    fact: 'The southwestern United States and Mexico experience their own summer monsoon, where shifting winds funnel Gulf of California moisture to trigger vivid afternoon desert storms.',
  },

  // ── 13. SPACE & EARTH (8 facts) ──
  {
    id: 'space-1',
    category: 'Space & Earth',
    headline: 'The Auroral Canvas',
    fact: 'Auroras occur when solar wind particles collide with nitrogen and oxygen atoms in the upper atmosphere. Oxygen creates neon greens and reds, while nitrogen produces violet tints.',
  },
  {
    id: 'space-2',
    category: 'Space & Earth',
    headline: 'Meteor Burnup Altitude',
    fact: 'Most meteors burn up in the mesosphere between 65 and 120 km above Earth, disintegrated by extreme aerodynamic compression rather than simple friction.',
  },
  {
    id: 'space-3',
    category: 'Space & Earth',
    headline: 'Space Weather Storms',
    fact: 'Solar coronal mass ejections can send geomagnetic shockwaves toward Earth, capable of disrupting satellite GPS signals, radio communications, and continental power grids.',
  },
  {
    id: 'space-4',
    category: 'Space & Earth',
    headline: 'Earth’s Magnetic Dynamo',
    fact: 'Convection currents of molten iron and nickel in Earth’s outer core generate the magnetosphere, which deflects hazardous cosmic radiation and preserves our atmosphere.',
  },
  {
    id: 'space-5',
    category: 'Space & Earth',
    headline: 'Atmosphere Loss to Space',
    fact: 'Earth loses approximately 90 metric tons of atmospheric hydrogen and helium into outer space every single day through thermal atmospheric escape.',
  },
  {
    id: 'space-6',
    category: 'Space & Earth',
    headline: 'The Great Red Spot',
    fact: 'Jupiter’s Great Red Spot is an anticyclonic storm larger than planet Earth that has been raging continuously for at least 350 years.',
  },
  {
    id: 'space-7',
    category: 'Space & Earth',
    headline: 'Diamonds in Giant Skies',
    fact: 'High atmospheric pressure and extreme heat on Neptune and Uranus can compress methane into literal diamond hail that rains toward the planets’ icy cores.',
  },
  {
    id: 'space-8',
    category: 'Space & Earth',
    headline: 'Lunar Temperature Swings',
    fact: 'Because the Moon possesses no atmosphere to moderate heat, its surface swings violently from 120°C (250°F) in daylight to -130°C (-200°F) in shadow.',
  },

  // ── 14. CLIMATE & EARTH HISTORY (8 facts) ──
  {
    id: 'climate-1',
    category: 'Climate',
    headline: 'Snowball Earth Epics',
    fact: 'Roughly 650 million years ago, runaway ice-albedo feedback froze Earth almost completely from poles to equator in an era known as Snowball Earth.',
  },
  {
    id: 'climate-2',
    category: 'Climate',
    headline: 'The Little Ice Age',
    fact: 'Between roughly 1300 and 1850, a prolonged cooling interval termed the Little Ice Age froze London’s River Thames repeatedly and supported annual "Frost Fairs."',
  },
  {
    id: 'climate-3',
    category: 'Climate',
    headline: 'Tree Rings and Past Skies',
    fact: 'Dendroclimatology uses the width and density of annual tree rings to reconstruct rainfall, temperature anomalies, and droughts stretching back over 10,000 years.',
  },
  {
    id: 'climate-4',
    category: 'Climate',
    headline: 'Milankovitch Cycles',
    fact: 'Cyclical variations in Earth’s orbit, axial tilt, and precession over tens of thousands of years drive the natural waxing and waning of major ice age epochs.',
  },
  {
    id: 'climate-5',
    category: 'Climate',
    headline: 'Ice Core Time Capsules',
    fact: 'Antarctic ice cores drilled over 3 kilometers deep contain trapped ancient air bubbles that provide a continuous 800,000-year historical record of greenhouse gases.',
  },
  {
    id: 'climate-6',
    category: 'Climate',
    headline: 'The Year Without a Summer',
    fact: 'The catastrophic 1815 eruption of Mount Tambora in Indonesia injected so much sulfate aerosol into the stratosphere that 1816 became the infamous global "Year Without a Summer."',
  },
  {
    id: 'climate-7',
    category: 'Climate',
    headline: 'Greenland’s Ancient Forests',
    fact: 'Fossil DNA preserved beneath 2 kilometers of Greenland ice reveals that 2 million years ago, northern Greenland was a lush boreal forest inhabited by mastodons.',
  },
  {
    id: 'climate-8',
    category: 'Climate',
    headline: 'Paleocene Thermal Maximum',
    fact: 'Fifty-six million years ago, a colossal natural surge in carbon emissions spiked global temperatures by 5°C to 8°C, allowing palm trees and crocodiles to thrive in the Arctic.',
  },
];
