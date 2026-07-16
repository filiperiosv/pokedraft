// ===== Estado global =====
const estado = {
  squad: [],
  cache: {},
  ginasioAtual: 0,
  redraftUsado: false,
  modoSacrificio: false,
  redraftSlotAlvo: null,
  vitoriasPorPk: {},
  insignias: [],
  liga: [],
  pocaoDisponivel: false,
  pocaoSelecionada: false,
};

const SQUAD_MAX = 6;
const CHANCE_SHINY = 0.02;

// ===== Dados: Pool de Líderes (sorteados a cada run) =====
const _PS = 'https://play.pokemonshowdown.com/sprites/trainers/';

const POOL_GINASIOS = [
  // Kanto
  { nome: 'Brock',     titulo: 'Líder — Pewter City',     especialidade: 'Pedra 🪨',    aceId: 95,  time: [74,74,74,75,75,95],
    trainerSprite: `${_PS}brock.png`,        insignia: { nome: 'Boulder', arquivo: 'boulder.png' } },
  { nome: 'Misty',     titulo: 'Líder — Cerulean City',   especialidade: 'Água 💧',     aceId: 121, time: [120,120,118,118,120,121],
    trainerSprite: `${_PS}misty.png`,        insignia: { nome: 'Cascade', arquivo: 'cascade.png' } },
  { nome: 'Lt. Surge', titulo: 'Líder — Vermilion City',  especialidade: 'Elétrico ⚡', aceId: 26,  time: [25,25,100,100,101,26],
    trainerSprite: `${_PS}ltsurge.png`,      insignia: { nome: 'Thunder', arquivo: 'thunder.png' } },
  { nome: 'Erika',     titulo: 'Líder — Celadon City',    especialidade: 'Planta 🌿',   aceId: 45,  time: [43,43,69,70,44,45],
    trainerSprite: `${_PS}erika.png`,        insignia: { nome: 'Rainbow', arquivo: 'rainbow.png' } },
  { nome: 'Koga',      titulo: 'Líder — Fuchsia City',    especialidade: 'Veneno ☠️',  aceId: 24,  time: [109,109,88,110,89,24],
    trainerSprite: `${_PS}koga.png`,         insignia: { nome: 'Soul',    arquivo: 'soul.png'    } },
  { nome: 'Sabrina',   titulo: 'Líder — Saffron City',    especialidade: 'Psíquico 🔮', aceId: 65,  time: [63,64,64,79,124,65],
    trainerSprite: `${_PS}sabrina-gen3.png`, insignia: { nome: 'Marsh',   arquivo: 'marsh.png'   } },
  { nome: 'Blaine',    titulo: 'Líder — Cinnabar Island', especialidade: 'Fogo 🔥',     aceId: 59,  time: [58,58,77,78,126,59],
    trainerSprite: `${_PS}blaine.png`,       insignia: { nome: 'Volcano', arquivo: 'volcano.png' } },
  { nome: 'Giovanni',  titulo: 'Líder — Viridian City',   especialidade: 'Terra 🌍',    aceId: 34,  time: [27,50,51,105,111,34],
    trainerSprite: `${_PS}giovanni.png`,     insignia: { nome: 'Earth',   arquivo: 'earth.png'   } },
  // Johto
  { nome: 'Falkner',   titulo: 'Líder — Violet City',     especialidade: 'Voador 🦅',   aceId: 18,  time: [16,17,17,85,22,18],
    trainerSprite: `${_PS}falkner.png`,      insignia: { nome: 'Zephyr',  arquivo: 'zephyr.png'  } },
  { nome: 'Bugsy',     titulo: 'Líder — Azalea Town',     especialidade: 'Inseto 🐛',   aceId: 212, time: [13,167,168,123,214,212],
    trainerSprite: `${_PS}bugsy.png`,        insignia: { nome: 'Hive',    arquivo: 'hive.png'    } },
  { nome: 'Whitney',   titulo: 'Líder — Goldenrod City',  especialidade: 'Normal 🎀',   aceId: 241, time: [39,40,174,176,176,241],
    trainerSprite: `${_PS}whitney.png`,      insignia: { nome: 'Plain',   arquivo: 'plain.png'   } },
  { nome: 'Morty',     titulo: 'Líder — Ecruteak City',   especialidade: 'Fantasma 👻', aceId: 94,  time: [92,93,92,93,200,94],
    trainerSprite: `${_PS}morty.png`,        insignia: { nome: 'Fog',     arquivo: 'fog.png'     } },
  { nome: 'Chuck',     titulo: 'Líder — Cianwood City',   especialidade: 'Luta 🥊',     aceId: 62,  time: [56,57,66,67,237,62],
    trainerSprite: `${_PS}chuck.png`,        insignia: { nome: 'Storm',   arquivo: 'storm.png'   } },
  { nome: 'Jasmine',   titulo: 'Líder — Olivine City',    especialidade: 'Aço ⚙️',      aceId: 208, time: [81,82,82,205,227,208],
    trainerSprite: `${_PS}jasmine.png`,      insignia: { nome: 'Mineral', arquivo: 'mineral.png' } },
  { nome: 'Pryce',     titulo: 'Líder — Mahogany Town',   especialidade: 'Gelo ❄️',     aceId: 221, time: [86,87,87,220,124,221],
    trainerSprite: `${_PS}pryce.png`,        insignia: { nome: 'Glacier', arquivo: 'glacier.png' } },
  { nome: 'Clair',     titulo: 'Líder — Blackthorn City', especialidade: 'Dragão 🐉',   aceId: 230, time: [147,148,148,130,149,230],
    trainerSprite: `${_PS}clair.png`,        insignia: { nome: 'Rising',  arquivo: 'rising.png'  } },
];

const POOL_ELITE = [
  // Kanto E4
  { nome: 'Lorelei', titulo: 'Elite Four', especialidade: 'Gelo ❄️',     aceId: 131, time: [86,87,55,80,124,131],    trainerSprite: `${_PS}lorelei-gen3.png` },
  { nome: 'Bruno',   titulo: 'Elite Four', especialidade: 'Luta 🥊',      aceId: 68,  time: [56,57,237,107,106,68],   trainerSprite: `${_PS}bruno.png`        },
  { nome: 'Agatha',  titulo: 'Elite Four', especialidade: 'Fantasma 👻',  aceId: 94,  time: [92,92,93,93,24,94],      trainerSprite: `${_PS}agatha-gen3.png`  },
  // Johto E4
  { nome: 'Will',    titulo: 'Elite Four', especialidade: 'Psíquico 🔮',  aceId: 178, time: [177,196,124,103,80,178], trainerSprite: `${_PS}will.png`         },
  { nome: 'Koga',    titulo: 'Elite Four', especialidade: 'Veneno ☠️',   aceId: 169, time: [168,49,205,88,110,169],  trainerSprite: `${_PS}koga.png`         },
  { nome: 'Karen',   titulo: 'Elite Four', especialidade: 'Sombrio 🌑',   aceId: 229, time: [197,45,94,198,215,229],  trainerSprite: `${_PS}karen.png`        },
];

const CAMPEAO = { nome: 'Lance', titulo: 'Campeão — Elite Four', especialidade: 'Dragão 🐉', aceId: 149, time: [148,147,148,142,230,149], trainerSprite: `${_PS}lance.png` };

// ===== Tabela de vantagens de tipo =====
const VANTAGENS = {
  fire:     ['grass', 'ice', 'bug', 'steel'],
  water:    ['fire', 'ground', 'rock'],
  grass:    ['water', 'ground', 'rock'],
  electric: ['water', 'flying'],
  ice:      ['grass', 'ground', 'flying', 'dragon'],
  fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
  poison:   ['grass', 'fairy'],
  ground:   ['fire', 'electric', 'poison', 'rock', 'steel'],
  flying:   ['grass', 'fighting', 'bug'],
  psychic:  ['fighting', 'poison'],
  bug:      ['grass', 'psychic', 'dark'],
  rock:     ['fire', 'ice', 'flying', 'bug'],
  ghost:    ['psychic', 'ghost'],
  dragon:   ['dragon'],
  dark:     ['psychic', 'ghost'],
  steel:    ['ice', 'rock', 'fairy'],
  fairy:    ['fighting', 'dragon', 'dark'],
  normal:   [],
};

function getMultTipo(tiposAtacante, tiposDefensor) {
  let score = 0;
  for (const ta of tiposAtacante) {
    const bateA = VANTAGENS[ta] || [];
    for (const td of tiposDefensor) {
      if (bateA.includes(td)) score++;
      // ta === td: mesmo tipo SE contra si (Dragão/Fantasma) — não cancela
      if (ta !== td && (VANTAGENS[td] || []).includes(ta)) score--;
    }
  }
  if (score >= 2)  return 1.40; // dupla fraqueza
  if (score === 1) return 1.25;
  if (score === -1) return 0.75;
  if (score <= -2) return 0.60; // dupla resistência
  return 1.0;
}

// ===== Elementos do DOM =====
const telaInicio        = document.getElementById('telaInicio');
const telaLoading       = document.getElementById('telaLoading');
const telaDraft         = document.getElementById('telaDraft');
const telaDraftCompleto = document.getElementById('telaDraftCompleto');
const telaPreJogo       = document.getElementById('telaPreJogo');
const telaBatalha       = document.getElementById('telaBatalha');
const telaFim           = document.getElementById('telaFim');
const cartasDraft       = document.getElementById('cartasDraft');
const textoLoading      = document.getElementById('textoLoading');

// ===== Utilitários =====

function mostrar(tela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.add('oculto'));
  tela.classList.remove('oculto');
}

// BST (Base Stat Total) de cada Pokémon por ID (índice 0 não usado)
// Para expandir para novas gerações: estender este array e aumentar MAX_POKEMON_ID
const BST_LOOKUP = [
  0,   // 0  (não usado)
  318, // 1  Bulbasaur
  405, // 2  Ivysaur
  525, // 3  Venusaur
  309, // 4  Charmander
  405, // 5  Charmeleon
  534, // 6  Charizard
  314, // 7  Squirtle
  405, // 8  Wartortle
  530, // 9  Blastoise
  195, // 10 Caterpie
  205, // 11 Metapod
  395, // 12 Butterfree
  195, // 13 Weedle
  205, // 14 Kakuna
  395, // 15 Beedrill
  251, // 16 Pidgey
  349, // 17 Pidgeotto
  479, // 18 Pidgeot
  253, // 19 Rattata
  413, // 20 Raticate
  262, // 21 Spearow
  442, // 22 Fearow
  288, // 23 Ekans
  448, // 24 Arbok
  320, // 25 Pikachu
  485, // 26 Raichu
  300, // 27 Sandshrew
  450, // 28 Sandslash
  275, // 29 Nidoran-f
  365, // 30 Nidorina
  505, // 31 Nidoqueen
  273, // 32 Nidoran-m
  365, // 33 Nidorino
  505, // 34 Nidoking
  323, // 35 Clefairy
  483, // 36 Clefable
  299, // 37 Vulpix
  505, // 38 Ninetales
  270, // 39 Jigglypuff
  435, // 40 Wigglytuff
  245, // 41 Zubat
  455, // 42 Golbat
  320, // 43 Oddish
  395, // 44 Gloom
  490, // 45 Vileplume
  285, // 46 Paras
  405, // 47 Parasect
  305, // 48 Venonat
  450, // 49 Venomoth
  265, // 50 Diglett
  425, // 51 Dugtrio
  290, // 52 Meowth
  440, // 53 Persian
  320, // 54 Psyduck
  500, // 55 Golduck
  305, // 56 Mankey
  455, // 57 Primeape
  350, // 58 Growlithe
  555, // 59 Arcanine
  300, // 60 Poliwag
  385, // 61 Poliwhirl
  510, // 62 Poliwrath
  310, // 63 Abra
  400, // 64 Kadabra
  500, // 65 Alakazam
  305, // 66 Machop
  405, // 67 Machoke
  505, // 68 Machamp
  300, // 69 Bellsprout
  390, // 70 Weepinbell
  480, // 71 Victreebel
  335, // 72 Tentacool
  515, // 73 Tentacruel
  300, // 74 Geodude
  390, // 75 Graveler
  495, // 76 Golem
  410, // 77 Ponyta
  500, // 78 Rapidash
  315, // 79 Slowpoke
  490, // 80 Slowbro
  325, // 81 Magnemite
  465, // 82 Magneton
  352, // 83 Farfetchd
  310, // 84 Doduo
  470, // 85 Dodrio
  325, // 86 Seel
  475, // 87 Dewgong
  325, // 88 Grimer
  500, // 89 Muk
  305, // 90 Shellder
  525, // 91 Cloyster
  310, // 92 Gastly
  405, // 93 Haunter
  500, // 94 Gengar
  385, // 95 Onix
  328, // 96 Drowzee
  483, // 97 Hypno
  325, // 98 Krabby
  475, // 99 Kingler
  330, // 100 Voltorb
  490, // 101 Electrode
  325, // 102 Exeggcute
  530, // 103 Exeggutor
  320, // 104 Cubone
  425, // 105 Marowak
  455, // 106 Hitmonlee
  455, // 107 Hitmonchan
  385, // 108 Lickitung
  340, // 109 Koffing
  490, // 110 Weezing
  345, // 111 Rhyhorn
  485, // 112 Rhydon
  450, // 113 Chansey
  435, // 114 Tangela
  490, // 115 Kangaskhan
  295, // 116 Horsea
  440, // 117 Seadra
  320, // 118 Goldeen
  450, // 119 Seaking
  340, // 120 Staryu
  520, // 121 Starmie
  460, // 122 Mr. Mime
  500, // 123 Scyther
  455, // 124 Jynx
  490, // 125 Electabuzz
  495, // 126 Magmar
  500, // 127 Pinsir
  490, // 128 Tauros
  200, // 129 Magikarp
  540, // 130 Gyarados
  535, // 131 Lapras
  288, // 132 Ditto
  325, // 133 Eevee
  525, // 134 Vaporeon
  525, // 135 Jolteon
  525, // 136 Flareon
  395, // 137 Porygon
  355, // 138 Omanyte
  495, // 139 Omastar
  355, // 140 Kabuto
  495, // 141 Kabutops
  515, // 142 Aerodactyl
  540, // 143 Snorlax
  580, // 144 Articuno
  580, // 145 Zapdos
  580, // 146 Moltres
  300, // 147 Dratini
  420, // 148 Dragonair
  600, // 149 Dragonite
  680, // 150 Mewtwo
  600, // 151 Mew
  // Gen 2 (Johto)
  318, // 152 Chikorita
  405, // 153 Bayleef
  525, // 154 Meganium
  309, // 155 Cyndaquil
  405, // 156 Quilava
  534, // 157 Typhlosion
  314, // 158 Totodile
  409, // 159 Croconaw
  530, // 160 Feraligatr
  215, // 161 Sentret
  415, // 162 Furret
  262, // 163 Hoothoot
  452, // 164 Noctowl
  265, // 165 Ledyba
  390, // 166 Ledian
  250, // 167 Spinarak
  390, // 168 Ariados
  535, // 169 Crobat
  330, // 170 Chinchou
  460, // 171 Lanturn
  205, // 172 Pichu
  218, // 173 Cleffa
  210, // 174 Igglybuff
  245, // 175 Togepi
  405, // 176 Togetic
  320, // 177 Natu
  470, // 178 Xatu
  280, // 179 Mareep
  365, // 180 Flaaffy
  510, // 181 Ampharos
  490, // 182 Bellossom
  250, // 183 Marill
  420, // 184 Azumarill
  410, // 185 Sudowoodo
  500, // 186 Politoed
  250, // 187 Hoppip
  340, // 188 Skiploom
  460, // 189 Jumpluff
  360, // 190 Aipom
  180, // 191 Sunkern
  425, // 192 Sunflora
  390, // 193 Yanma
  210, // 194 Wooper
  430, // 195 Quagsire
  525, // 196 Espeon
  525, // 197 Umbreon
  405, // 198 Murkrow
  490, // 199 Slowking
  435, // 200 Misdreavus
  336, // 201 Unown
  405, // 202 Wobbuffet
  455, // 203 Girafarig
  290, // 204 Pineco
  465, // 205 Forretress
  415, // 206 Dunsparce
  430, // 207 Gligar
  510, // 208 Steelix
  300, // 209 Snubbull
  450, // 210 Granbull
  440, // 211 Qwilfish
  500, // 212 Scizor
  505, // 213 Shuckle
  500, // 214 Heracross
  430, // 215 Sneasel
  330, // 216 Teddiursa
  500, // 217 Ursaring
  250, // 218 Slugma
  410, // 219 Magcargo
  250, // 220 Swinub
  450, // 221 Piloswine
  380, // 222 Corsola
  300, // 223 Remoraid
  480, // 224 Octillery
  330, // 225 Delibird
  465, // 226 Mantine
  465, // 227 Skarmory
  330, // 228 Houndour
  500, // 229 Houndoom
  540, // 230 Kingdra
  330, // 231 Phanpy
  500, // 232 Donphan
  515, // 233 Porygon2
  465, // 234 Stantler
  250, // 235 Smeargle
  210, // 236 Tyrogue
  455, // 237 Hitmontop
  305, // 238 Smoochum
  360, // 239 Elekid
  365, // 240 Magby
  490, // 241 Miltank
  540, // 242 Blissey
  580, // 243 Raikou
  580, // 244 Entei
  580, // 245 Suicune
  300, // 246 Larvitar
  410, // 247 Pupitar
  600, // 248 Tyranitar
  680, // 249 Lugia
  680, // 250 Ho-Oh
  600, // 251 Celebi
];

const MAX_POKEMON_ID   = 251; // aumentar aqui para novas gerações
const BST_LIMITE_MEDIO = 421;
const BST_LIMITE_FORTE = 480;
const REDRAFT_GINASIO_MINIMO = 6; // desbloqueado após a 6ª batalha

// Dificuldade cresce por posição — independente de quem foi sorteado
const DIF_POR_POSICAO = [
  1.10, 1.14, 1.15, 1.17, 1.20, 1.22, 1.24, 1.26, // 8 ginásios
  1.15, 1.18, 1.21,                                  // 3 Elite Four
  1.24,                                               // Campeão Lance
];

function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sortearLiga() {
  const ginasios  = embaralhar(POOL_GINASIOS).slice(0, 8);
  const nomesGin  = new Set(ginasios.map(g => g.nome));
  const elitePool = POOL_ELITE.filter(e => !nomesGin.has(e.nome));
  const elite     = embaralhar(elitePool).slice(0, 3);
  estado.liga = [...ginasios, ...elite, { ...CAMPEAO }]
    .map((g, i) => ({ ...g, dif: DIF_POR_POSICAO[i] }));
}

// Tiers computados automaticamente a partir do BST_LOOKUP
const TIER_FRACO = [], TIER_MEDIO = [], TIER_FORTE = [];
for (let i = 1; i <= MAX_POKEMON_ID; i++) {
  const bst = BST_LOOKUP[i];
  if (!bst) continue;
  if (bst < BST_LIMITE_MEDIO)      TIER_FRACO.push(i);
  else if (bst < BST_LIMITE_FORTE) TIER_MEDIO.push(i);
  else                             TIER_FORTE.push(i);
}

function idAleatorio() {
  const r = Math.random();
  const tier = r < 0.15 ? TIER_FRACO : r < 0.50 ? TIER_MEDIO : TIER_FORTE;
  return tier[Math.floor(Math.random() * tier.length)];
}

// Re-draft tem odds maiores para Pokémon fortes (jogador já está no late game)
function idAleatorioPesado() {
  const r = Math.random();
  const tier = r < 0.20 ? TIER_MEDIO : TIER_FORTE;
  return tier[Math.floor(Math.random() * tier.length)];
}

function tresDiferentesComFn(excluir = [], fnId = idAleatorio) {
  const ids = new Set();
  while (ids.size < 3) {
    const id = fnId();
    if (!excluir.includes(id)) ids.add(id);
  }
  return [...ids];
}

function tresDiferentes(excluir = []) {
  return tresDiferentesComFn(excluir, idAleatorio);
}


async function buscarPokemon(id) {
  if (estado.cache[id]) return estado.cache[id];
  const chave = `pk2_${id}`; // v2: inclui todos os 6 stats + BST
  const local = localStorage.getItem(chave);
  if (local) {
    estado.cache[id] = JSON.parse(local);
    return estado.cache[id];
  }
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!resp.ok) throw new Error(`Erro ao buscar Pokémon ID ${id}`);
  const dados = await resp.json();
  const stat = n => dados.stats.find(s => s.stat.name === n).base_stat;
  const hp = stat('hp'), atq = stat('attack'), def = stat('defense');
  const atkEsp = stat('special-attack'), defEsp = stat('special-defense'), vel = stat('speed');
  const pk = {
    id:     dados.id,
    nome:   dados.name,
    tipos:  dados.types.map(t => t.type.name),
    hp, atq, def, atkEsp, defEsp, vel,
    bst:    hp + atq + def + atkEsp + defEsp + vel,
    sprite:      dados.sprites.front_default,
    spriteShiny: dados.sprites.front_shiny,
  };
  estado.cache[id] = pk;
  localStorage.setItem(chave, JSON.stringify(pk));
  return pk;
}

function nomePT(nome) {
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

const TIPOS_PT = {
  normal:   'Normal',
  fire:     'Fogo',
  water:    'Água',
  grass:    'Planta',
  electric: 'Elétrico',
  ice:      'Gelo',
  fighting: 'Luta',
  poison:   'Veneno',
  ground:   'Terra',
  flying:   'Voador',
  psychic:  'Psíquico',
  bug:      'Inseto',
  rock:     'Pedra',
  ghost:    'Fantasma',
  dragon:   'Dragão',
  dark:     'Sombrio',
  steel:    'Aço',
  fairy:    'Fada',
};

function tipoPT(tipo) {
  return TIPOS_PT[tipo] || nomePT(tipo);
}

function htmlBarraHP(hp) {
  const pct = Math.min(100, Math.round(hp / 255 * 100));
  const cls  = hp > 100 ? 'alto' : hp > 50 ? 'medio' : 'baixo';
  return `<div class="hp-bar-wrap"><div class="hp-bar ${cls}" style="width:${pct}%"></div></div>`;
}

function spriteUrl(pk, isShiny = false) {
  return (isShiny && pk.spriteShiny) ? pk.spriteShiny : pk.sprite;
}

function forcaBase(pk) {
  return pk.bstFinal;
}

function restaurarTime() {
  estado.squad.forEach(pk => { pk.forcaAtual = forcaBase(pk); });
}

// ===== SVGs de resultado =====

const SVG_POKEBOLA = `<svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 2A22 22 0 0 1 46 24H2A22 22 0 0 1 24 2Z" fill="#888"/>
  <path d="M24 46A22 22 0 0 1 2 24H46A22 22 0 0 1 24 46Z" fill="#ddd"/>
  <circle cx="24" cy="24" r="22" fill="none" stroke="#444" stroke-width="2.5"/>
  <line x1="2" y1="24" x2="46" y2="24" stroke="#444" stroke-width="3"/>
  <circle cx="24" cy="24" r="6" fill="#ddd" stroke="#444" stroke-width="2.5"/>
  <circle cx="24" cy="24" r="3" fill="#888"/>
</svg>`;

const SVG_TROFEU = `<svg viewBox="0 0 96 122" width="72" height="92" xmlns="http://www.w3.org/2000/svg">
  <rect x="22" y="102" width="52" height="18" rx="2" fill="#7a1010" stroke="#400808" stroke-width="1.5"/>
  <rect x="28" y="96" width="40" height="8" rx="1" fill="#9a1a1a" stroke="#400808" stroke-width="1.5"/>
  <rect x="40" y="44" width="16" height="54" rx="1" fill="#D4A017" stroke="#7a5c00" stroke-width="1.5"/>
  <rect x="41.5" y="46" width="4" height="50" rx="1" fill="rgba(255,240,80,0.4)"/>
  <rect x="33" y="88" width="30" height="8" rx="2" fill="#C8960C" stroke="#7a5c00" stroke-width="1.3"/>
  <rect x="36" y="78" width="24" height="6" rx="1" fill="#C8960C" stroke="#7a5c00" stroke-width="1.2"/>
  <rect x="36" y="66" width="24" height="6" rx="1" fill="#C8960C" stroke="#7a5c00" stroke-width="1.2"/>
  <rect x="36" y="54" width="24" height="6" rx="1" fill="#C8960C" stroke="#7a5c00" stroke-width="1.2"/>
  <rect x="32" y="40" width="32" height="6" rx="2" fill="#B8860B" stroke="#7a5c00" stroke-width="1.5"/>
  <path d="M31 28 C26 14 10 8 2 12 C8 24 20 32 30 34 Z" fill="#e0e0e0" stroke="#b0b0b0" stroke-width="1"/>
  <path d="M31 30 C24 18 12 14 5 18 C12 28 22 34 30 36 Z" fill="#eeeeee" stroke="#c0c0c0" stroke-width="0.8"/>
  <path d="M31 32 C26 22 16 20 11 23 C17 30 24 35 30 36 Z" fill="#f6f6f6" stroke="#d0d0d0" stroke-width="0.6"/>
  <path d="M65 28 C70 14 86 8 94 12 C88 24 76 32 66 34 Z" fill="#e0e0e0" stroke="#b0b0b0" stroke-width="1"/>
  <path d="M65 30 C72 18 84 14 91 18 C84 28 74 34 66 36 Z" fill="#eeeeee" stroke="#c0c0c0" stroke-width="0.8"/>
  <path d="M65 32 C70 22 80 20 85 23 C79 30 72 35 66 36 Z" fill="#f6f6f6" stroke="#d0d0d0" stroke-width="0.6"/>
  <path d="M27 26 A21 21 0 0 1 69 26 Z" fill="#C8960C"/>
  <path d="M27 26 A21 21 0 0 0 69 26 Z" fill="#FFD700"/>
  <circle cx="48" cy="26" r="21" fill="none" stroke="#7a5c00" stroke-width="2"/>
  <line x1="27" y1="26" x2="69" y2="26" stroke="#7a5c00" stroke-width="2.5"/>
  <circle cx="48" cy="26" r="6.5" fill="#FFE55C" stroke="#7a5c00" stroke-width="2"/>
  <circle cx="48" cy="26" r="3.5" fill="#B8860B"/>
  <ellipse cx="39" cy="15" rx="7" ry="4.5" fill="rgba(255,255,255,0.18)" transform="rotate(-25 39 15)"/>
</svg>`;

// ===== FASE 1: DRAFT =====

async function iniciarRodadaDraft() {
  mostrar(telaLoading);
  textoLoading.textContent = `Sorteando... (${estado.squad.length + 1}/6)`;
  const idsUsados = estado.squad.map(p => p.id);
  const ids = tresDiferentes(idsUsados);
  try {
    const lista = await Promise.all(ids.map(buscarPokemon));
    const candidatos = lista.map(pk => ({ pk, isShiny: Math.random() < CHANCE_SHINY }));
    cartasDraft.innerHTML = '';
    candidatos.forEach(({ pk, isShiny }) => cartasDraft.appendChild(criarCartaEl(pk, isShiny)));
    mostrar(telaDraft);
  } catch (err) {
    textoLoading.textContent = 'Erro de conexão. Recarregue a página.';
    console.error(err);
  }
}

function criarCartaEl(pk, isShiny, aoEscolher = null) {
  const carta = document.createElement('div');
  carta.className = `carta${isShiny ? ' shiny' : ''}`;
  const mult       = isShiny ? 1.10 : 1;
  const hpFinal    = Math.round(pk.hp     * mult);
  const atqFinal   = Math.round(pk.atq    * mult);
  const defFinal   = Math.round(pk.def    * mult);
  const atkEspFinal = Math.round(pk.atkEsp * mult);
  const defEspFinal = Math.round(pk.defEsp * mult);
  const velFinal   = Math.round(pk.vel    * mult);
  const bstFinal   = hpFinal + atqFinal + defFinal + atkEspFinal + defEspFinal + velFinal;
  const badges     = pk.tipos.map(t => `<span class="tipo-badge tipo-${t}">${tipoPT(t)}</span>`).join('');
  const conteudo = `
    <img class="carta-sprite${isShiny ? ' sprite-shiny' : ''}" src="${spriteUrl(pk, isShiny)}" alt="${pk.nome}" />
    <div class="carta-info">
      <div class="carta-nome">${nomePT(pk.nome)}</div>
      <div class="carta-tipos">${badges}</div>
      <div class="carta-stats">
        <div class="stat"><span class="stat-label">HP</span><span class="stat-val hp">${hpFinal}</span></div>
        <div class="stat"><span class="stat-label">ATQ</span><span class="stat-val atq">${atqFinal}</span></div>
        <div class="stat"><span class="stat-label">DEF</span><span class="stat-val def">${defFinal}</span></div>
        <div class="stat"><span class="stat-label">SATQ</span><span class="stat-val satq">${atkEspFinal}</span></div>
        <div class="stat"><span class="stat-label">SDEF</span><span class="stat-val sdef">${defEspFinal}</span></div>
        <div class="stat"><span class="stat-label">VEL</span><span class="stat-val vel">${velFinal}</span></div>
      </div>
    </div>
    <div class="carta-escolher">▶<br>ESCOLHER</div>
  `;
  if (isShiny) {
    carta.innerHTML = `
      <div class="shiny-banner">✦ S H I N Y ✦ <span class="shiny-bonus">+10% em todos os stats</span></div>
      <div class="carta-corpo">${conteudo}</div>
    `;
  } else {
    carta.innerHTML = conteudo;
  }
  const pkCompleto = { ...pk, isShiny, hpFinal, atqFinal, defFinal, atkEspFinal, defEspFinal, velFinal, bstFinal };
  const cb = aoEscolher ?? (() => escolherPokemon(pkCompleto));
  carta.addEventListener('click', () => cb(pkCompleto));
  return carta;
}

function escolherPokemon(pk) {
  pk.forcaAtual = forcaBase(pk);
  estado.squad.push(pk);
  atualizarSlots();
  if (estado.squad.length >= SQUAD_MAX) {
    mostrar(telaDraftCompleto);
  } else {
    iniciarRodadaDraft();
  }
}

function atualizarSlots() {
  estado.squad.forEach((pk, i) => {
    const slot = document.getElementById(`slot-${i}`);
    if (!slot) return;
    slot.classList.remove('vazio', 'shiny');
    slot.innerHTML = '';
    const img = document.createElement('img');
    img.src = spriteUrl(pk, pk.isShiny);
    img.alt = pk.nome;
    slot.appendChild(img);
    slot.classList.add('preenchendo');
    if (pk.isShiny) slot.classList.add('shiny');
    img.addEventListener('animationend', () => slot.classList.remove('preenchendo'), { once: true });
  });
}

// ===== FASE 2: PRÉ-JOGO =====

async function mostrarPreJogo() {
  mostrar(telaLoading);
  const gin = estado.liga[estado.ginasioAtual];
  textoLoading.textContent = `Carregando ${gin.nome}...`;
  try {
    await Promise.all(gin.time.map(buscarPokemon));
    renderPreJogo();
  } catch (err) {
    textoLoading.textContent = 'Erro de conexão. Recarregue a página.';
    console.error(err);
  }
}

function renderPreJogo() {
  const gin      = estado.liga[estado.ginasioAtual];
  const num      = estado.ginasioAtual + 1;
  const isElite  = estado.ginasioAtual >= 8;
  const card     = document.getElementById('oponenteCard');

  const slotBase  = 'width:44px;height:44px;background:var(--cinza-esc);border:2px solid var(--preto);border-radius:3px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;flex-shrink:0;';
  const slotAce   = 'width:44px;height:44px;background:var(--bege-esc);border:2px solid var(--dourado);border-radius:3px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;flex-shrink:0;';
  const imgStyle  = 'width:40px;height:40px;image-rendering:pixelated;display:block;object-fit:contain;';
  const starStyle = 'position:absolute;top:1px;right:2px;font-size:7px;color:var(--dourado);line-height:1;pointer-events:none;';

  let aceJaMarcado = false;
  const slotsHtml = gin.time.map(id => {
    const pk = estado.cache[id];
    if (!pk) return `<div style="${slotBase}"></div>`;
    const isAce = !aceJaMarcado && id === gin.aceId;
    if (isAce) aceJaMarcado = true;
    const title = nomePT(pk.nome) + (isAce ? ' — Ás' : '');
    const star  = isAce ? `<span style="${starStyle}">★</span>` : '';
    return `<div style="${isAce ? slotAce : slotBase}" title="${title}"><img src="${pk.sprite}" style="${imgStyle}" alt="${pk.nome}">${star}</div>`;
  }).join('');

  card.innerHTML = `
    <div class="oponente-header">
      <span class="oponente-titulo">${gin.titulo}${isElite ? '<span class="tag-elite">ELITE</span>' : ''}</span>
      <span class="batalha-num">${num}/12</span>
    </div>
    <div class="oponente-body">
      <img class="trainer-sprite" src="${gin.trainerSprite}" alt="${gin.nome}"
           onerror="this.style.display='none'" />
      <div class="oponente-nome-tipo">
        <div class="oponente-nome">${gin.nome}</div>
        <div class="oponente-especialidade">${gin.especialidade}</div>
      </div>
    </div>
    <div class="oponente-body" style="padding:6px 12px 10px;gap:5px;justify-content:center;">${slotsHtml}</div>
  `;

  estado.modoSacrificio = false;
  renderListaDrag();

  const btnRedraft = document.getElementById('btnRedraft');
  const redraftDisponivel = !estado.redraftUsado && estado.ginasioAtual >= REDRAFT_GINASIO_MINIMO;
  btnRedraft.classList.toggle('oculto', !redraftDisponivel);
  btnRedraft.textContent = '↺ RE-DRAFT';
  btnRedraft.onclick = ativarModoSacrificio;

  // Hint de desbloqueio
  let hintRedraft = document.getElementById('hintRedraft');
  if (!hintRedraft) {
    hintRedraft = document.createElement('p');
    hintRedraft.id = 'hintRedraft';
    hintRedraft.className = 'hint-redraft';
    document.querySelector('.acoes-pre').insertAdjacentElement('afterbegin', hintRedraft);
  }
  if (!estado.redraftUsado && estado.ginasioAtual < REDRAFT_GINASIO_MINIMO) {
    const faltam = REDRAFT_GINASIO_MINIMO - estado.ginasioAtual;
    hintRedraft.textContent = `🔒 Re-Draft disponível em ${faltam} batalha${faltam > 1 ? 's' : ''}`;
    hintRedraft.classList.remove('oculto');
  } else {
    hintRedraft.classList.add('oculto');
  }

  // Botão de poção
  estado.pocaoSelecionada = false;
  const btnPocao = document.getElementById('btnPocao');
  if (estado.pocaoDisponivel) {
    btnPocao.classList.remove('oculto');
    btnPocao.classList.remove('ativo');
    btnPocao.onclick = () => {
      estado.pocaoSelecionada = !estado.pocaoSelecionada;
      btnPocao.classList.toggle('ativo', estado.pocaoSelecionada);
      renderListaDrag();
    };
  } else {
    btnPocao.classList.add('oculto');
  }

  // Hint de countdown da poção
  let hintPocao = document.getElementById('hintPocao');
  if (!hintPocao) {
    hintPocao = document.createElement('p');
    hintPocao.id = 'hintPocao';
    hintPocao.className = 'hint-redraft hint-pocao';
    document.querySelector('.acoes-pre').insertAdjacentElement('afterbegin', hintPocao);
  }
  if (estado.redraftUsado && !estado.pocaoDisponivel && estado.ginasioAtual < 9) {
    const faltam = 9 - estado.ginasioAtual;
    hintPocao.textContent = `🧪 Poção disponível em ${faltam} batalha${faltam > 1 ? 's' : ''}`;
    hintPocao.classList.remove('oculto');
  } else {
    hintPocao.classList.add('oculto');
  }

  document.getElementById('instrucaoPreJogo').textContent = 'Arraste para definir a ordem de entrada';
  document.getElementById('btnBatalhar').onclick = () => iniciarBatalha();

  mostrar(telaPreJogo);
}

// --- Drag-and-Drop ---

let dragSrcIdx = null;

function renderListaDrag() {
  const lista = document.getElementById('listaDrag');
  lista.innerHTML = '';
  const sacrificio = estado.modoSacrificio;

  estado.squad.forEach((pk, i) => {
    const li = document.createElement('li');
    li.className = `drag-item${pk.isShiny ? ' shiny' : ''}${sacrificio ? ' modo-sacrificio' : ''}`;
    li.draggable = !sacrificio;
    li.dataset.idx = i;

    const acaoDireita = sacrificio
      ? `<button class="btn-sacrificio" data-idx="${i}">✂ TROCAR</button>`
      : `<span class="drag-handle">⠿</span>`;

    li.innerHTML = `
      <span class="drag-pos">${i + 1}</span>
      <img class="drag-sprite${pk.isShiny ? ' sprite-shiny' : ''}" src="${spriteUrl(pk, pk.isShiny)}" alt="${pk.nome}" />
      <div class="drag-info">
        <div class="drag-nome">${nomePT(pk.nome)}${pk.isShiny ? ' <span class="drag-shiny-tag">✦ SHINY</span>' : ''}${i === 5 && estado.pocaoSelecionada ? ' <span class="drag-pocao-tag">🧪</span>' : ''}</div>
        <div class="drag-stats">${pk.tipos.map(tipoPT).join(' · ')}</div>
      </div>
      ${acaoDireita}
    `;

    if (!sacrificio) {
      li.addEventListener('dragstart', onDragStart);
      li.addEventListener('dragover',  onDragOver);
      li.addEventListener('dragleave', onDragLeave);
      li.addEventListener('drop',      onDrop);
      li.addEventListener('dragend',   onDragEnd);
      li.addEventListener('touchstart', onTouchStart, { passive: false });
      li.addEventListener('touchmove',  onTouchMove,  { passive: false });
      li.addEventListener('touchend',   onTouchEnd);
    }

    lista.appendChild(li);
  });

  if (sacrificio) {
    lista.querySelectorAll('.btn-sacrificio').forEach(btn => {
      btn.addEventListener('click', () => selecionarSacrificio(parseInt(btn.dataset.idx)));
    });
  }
}

function inserirNaPosicao(srcIdx, dstIdx) {
  const [item] = estado.squad.splice(srcIdx, 1);
  estado.squad.splice(dstIdx, 0, item);
  atualizarSlots();
  renderListaDrag();
}

function limparIndicadores() {
  document.querySelectorAll('.drag-item').forEach(el =>
    el.classList.remove('drag-sobre', 'insert-antes', 'insert-depois')
  );
}

function onDragStart(e) {
  dragSrcIdx = parseInt(e.currentTarget.dataset.idx);
  e.currentTarget.classList.add('arrastando');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  limparIndicadores();
  const dstIdx = parseInt(e.currentTarget.dataset.idx);
  // Mostra linha de inserção acima ou abaixo conforme direção
  e.currentTarget.classList.add(dragSrcIdx < dstIdx ? 'insert-depois' : 'insert-antes');
}
function onDragLeave(e) {
  e.currentTarget.classList.remove('insert-antes', 'insert-depois');
}
function onDrop(e) {
  e.preventDefault();
  const dstIdx = parseInt(e.currentTarget.dataset.idx);
  if (dragSrcIdx !== null && dragSrcIdx !== dstIdx) {
    inserirNaPosicao(dragSrcIdx, dstIdx);
  }
  limparIndicadores();
}
function onDragEnd(e) {
  e.currentTarget.classList.remove('arrastando');
  limparIndicadores();
}

// Touch drag real: segura e arrasta o item
let touchDrag = null;

function onTouchStart(e) {
  e.preventDefault();
  const li = e.currentTarget;
  const rect = li.getBoundingClientRect();
  const touch = e.touches[0];

  const ghost = li.cloneNode(true);
  ghost.style.cssText = `
    position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;
    opacity:0.8;pointer-events:none;z-index:1000;
    box-shadow:0 6px 20px rgba(0,0,0,0.4);transform:scale(1.03);
  `;
  document.body.appendChild(ghost);
  li.classList.add('arrastando');

  touchDrag = {
    srcIdx: parseInt(li.dataset.idx),
    ghost,
    offsetY: touch.clientY - rect.top,
    items: [...document.querySelectorAll('.drag-item')]
  };
}

function onTouchMove(e) {
  if (!touchDrag) return;
  e.preventDefault();
  const touch = e.touches[0];
  touchDrag.ghost.style.top = (touch.clientY - touchDrag.offsetY) + 'px';

  limparIndicadores();
  for (const item of touchDrag.items) {
    const r = item.getBoundingClientRect();
    const dstIdx = parseInt(item.dataset.idx);
    if (dstIdx === touchDrag.srcIdx) continue;
    if (touch.clientY >= r.top && touch.clientY <= r.bottom) {
      item.classList.add(touchDrag.srcIdx < dstIdx ? 'insert-depois' : 'insert-antes');
    }
  }
}

function onTouchEnd(e) {
  if (!touchDrag) return;
  const touch = e.changedTouches[0];

  let dstIdx = null;
  for (const item of touchDrag.items) {
    const r = item.getBoundingClientRect();
    if (touch.clientY >= r.top && touch.clientY <= r.bottom) {
      dstIdx = parseInt(item.dataset.idx);
      break;
    }
  }

  touchDrag.ghost.remove();
  document.querySelectorAll('.drag-item').forEach(el => el.classList.remove('arrastando'));
  limparIndicadores();
  const { srcIdx } = touchDrag;
  touchDrag = null;

  if (dstIdx !== null && dstIdx !== srcIdx) inserirNaPosicao(srcIdx, dstIdx);
}

// --- Re-Draft ---
function ativarModoSacrificio() {
  if (estado.redraftUsado) return;
  estado.modoSacrificio = true;
  renderListaDrag();
  const btn = document.getElementById('btnRedraft');
  btn.textContent = '✕ CANCELAR';
  btn.classList.add('modo-sacrificio-ativo');
  btn.onclick = cancelarSacrificio;
  document.getElementById('instrucaoPreJogo').textContent = 'Toque em qual Pokémon quer substituir:';
}

function cancelarSacrificio() {
  estado.modoSacrificio = false;
  renderListaDrag();
  const btn = document.getElementById('btnRedraft');
  btn.textContent = '↺ RE-DRAFT';
  btn.classList.remove('modo-sacrificio-ativo');
  btn.onclick = ativarModoSacrificio;
  document.getElementById('instrucaoPreJogo').textContent = 'Arraste para definir a ordem de entrada';
}

async function selecionarSacrificio(slotIdx) {
  estado.modoSacrificio = false;
  estado.redraftSlotAlvo = slotIdx;

  mostrar(telaLoading);
  textoLoading.textContent = 'Sorteando substitutos...';

  const pkAtual = estado.squad[slotIdx];
  const idsUsados = estado.squad.map(p => p.id);
  const ids = tresDiferentesComFn(idsUsados, idAleatorioPesado);
  try {
    const lista = await Promise.all(ids.map(buscarPokemon));
    const candidatos = lista.map(pk => ({ pk, isShiny: Math.random() < CHANCE_SHINY }));

    const nomeSacr = nomePT(pkAtual.nome);
    document.querySelector('#telaDraft .instrucao').innerHTML =
      `Escolha o substituto para <strong>${nomeSacr}</strong>:`;

    cartasDraft.innerHTML = '';
    candidatos.forEach(({ pk, isShiny }) => {
      cartasDraft.appendChild(criarCartaEl(pk, isShiny, (pkEsc) => executarRedraft(slotIdx, pkEsc)));
    });

    // Opção de manter o Pokémon atual sem consumir o Re-Draft
    const divManter = document.createElement('div');
    divManter.className = 'opcao-manter';
    divManter.innerHTML = `<span class="manter-label">— ou mantenha o atual (consome o coringa) —</span>`;
    const cartaManter = criarCartaEl(pkAtual, pkAtual.isShiny, () => manterPokemonAtual());
    cartaManter.classList.add('carta-manter');
    divManter.appendChild(cartaManter);
    cartasDraft.appendChild(divManter);

    mostrar(telaDraft);
  } catch (err) {
    console.error(err);
    renderPreJogo();
  }
}

function executarRedraft(slotIdx, pk) {
  estado.redraftUsado = true;  // consumido só quando confirma a troca
  estado.squad[slotIdx] = { ...pk, forcaAtual: pk.bstFinal };
  document.querySelector('#telaDraft .instrucao').innerHTML =
    'Escolha <strong>1</strong> Pokémon para o seu time!';
  atualizarSlots();
  renderPreJogo();
}

function manterPokemonAtual() {
  estado.redraftUsado = true; // ver as opções já consome o coringa
  document.querySelector('#telaDraft .instrucao').innerHTML =
    'Escolha <strong>1</strong> Pokémon para o seu time!';
  renderPreJogo();
}

// ===== FASE 3: BATALHA =====

let timeAdversarioGlobal = [];

async function iniciarBatalha() {
  mostrar(telaLoading);
  textoLoading.textContent = 'Preparando batalha...';
  const gin = estado.liga[estado.ginasioAtual];

  // Poção concedida ao chegar na batalha 10 (índice 9)
  if (estado.ginasioAtual === 9 && !estado.pocaoDisponivel) {
    estado.pocaoDisponivel = true;
  }

  try {
    const timeAdv = await Promise.all(gin.time.map(buscarPokemon));
    // dif: multiplicador de dificuldade calibrado por ginásio
    timeAdv.forEach(pk => { pk.forcaBase = pk.bst; pk.forcaAtual = pk.bst * gin.dif; });
    timeAdversarioGlobal = timeAdv;
    renderTelaBatalha(gin, estado.squad, timeAdv);
  } catch (err) {
    textoLoading.textContent = 'Erro de conexão. Recarregue a página.';
    console.error(err);
  }
}

function simularBatalha(timeJ, timeA, pocaoDisp = false) {
  const log = [];
  const forcasJ      = timeJ.map(pk => pk.forcaAtual);
  const forcasA      = timeA.map(pk => pk.forcaAtual);
  const forcasJBase  = [...forcasJ];
  const forcasABase  = [...forcasA];
  // Fadiga usa BST bruto do oponente (sem multiplicador de dificuldade)
  const forcasAFadiga = timeA.map(pk => pk.forcaBase ?? pk.forcaAtual);
  let iJ = 0, iA = 0;
  let pocaoAtivada = false;

  while (iJ < 6 && iA < 6) {
    // Poção: ativa quando o último Pokémon do jogador entra na luta
    if (iJ === 5 && pocaoDisp && !pocaoAtivada) {
      const cura = Math.round(forcasJ[5] * 0.20);
      forcasJ[5] += cura;
      forcasJBase[5] += cura;
      pocaoAtivada = true;
      log.push({ tipo: 'pocao', pk: timeJ[5], cura });
    }

    const pkJ = timeJ[iJ];
    const pkA = timeA[iA];
    const multJ = getMultTipo(pkJ.tipos, pkA.tipos);
    const multA = getMultTipo(pkA.tipos, pkJ.tipos);
    const rngJ  = 0.85 + Math.random() * 0.30;
    const rngA  = 0.85 + Math.random() * 0.30;
    const fJ    = forcasJ[iJ] * multJ * rngJ;
    const fA    = forcasA[iA] * multA * rngA;

    if (fJ >= fA) {
      forcasJ[iJ] = Math.max(0, forcasJ[iJ] - Math.min(forcasA[iA], forcasAFadiga[iA]));
      forcasA[iA] = 0;
      log.push({ vitoria: 'jogador',    venc: pkJ, derrota: pkA, iJ, iA, multJ, multA,
                 hpJSnap: [...forcasJ], hpASnap: [...forcasA], hpJBase: forcasJBase, hpABase: forcasABase });
      iA++;
    } else {
      forcasA[iA] = Math.max(0, forcasA[iA] - forcasJ[iJ]);
      forcasJ[iJ] = 0;
      log.push({ vitoria: 'adversario', venc: pkA, derrota: pkJ, iJ, iA, multJ, multA,
                 hpJSnap: [...forcasJ], hpASnap: [...forcasA], hpJBase: forcasJBase, hpABase: forcasABase });
      iJ++;
    }
  }

  return { log, vitoria: iA >= 6, pocaoAtivada };
}

function criarSlotBatalha(id, src, alt) {
  const wrap = document.createElement('div');
  wrap.className = 'sprite-slot';
  wrap.innerHTML = `
    <img class="sprite-batalha" id="${id}" src="${src}" alt="${alt}" />
    <div class="hp-bar-batalha-wrap">
      <div class="hp-bar-batalha alto" id="hp-${id}" style="width:100%"></div>
    </div>
  `;
  return wrap;
}

function atualizarBarrasHP(hpJSnap, hpASnap, hpJBase, hpABase) {
  hpJSnap.forEach((f, i) => {
    const pct = hpJBase[i] > 0 ? Math.max(0, f / hpJBase[i] * 100) : 0;
    const el  = document.getElementById(`hp-jog-${i}`);
    if (!el) return;
    el.style.width = pct + '%';
    el.className   = `hp-bar-batalha ${pct > 50 ? 'alto' : pct > 25 ? 'medio' : 'baixo'}`;
  });
  hpASnap.forEach((f, i) => {
    const pct = hpABase[i] > 0 ? Math.max(0, f / hpABase[i] * 100) : 0;
    const el  = document.getElementById(`hp-adv-${i}`);
    if (!el) return;
    el.style.width = pct + '%';
    el.className   = `hp-bar-batalha ${pct > 50 ? 'alto' : pct > 25 ? 'medio' : 'baixo'}`;
  });
}

function renderTelaBatalha(gin, timeJ, timeA) {
  const copiaJ = timeJ.map(pk => ({ ...pk }));
  const copiaA = timeA.map(pk => ({ ...pk }));
  const resultado = simularBatalha(copiaJ, copiaA, estado.pocaoSelecionada);
  if (resultado.pocaoAtivada) estado.pocaoDisponivel = false;

  const spritesOp = document.getElementById('spritesOponente');
  const spritesJg = document.getElementById('spritesJogador');
  const log       = document.getElementById('logBatalha');
  const btnProximo = document.getElementById('btnProximo');

  spritesOp.innerHTML = '';
  spritesJg.innerHTML = '';
  log.innerHTML = '';
  btnProximo.classList.add('oculto');

  timeA.forEach((pk, i) => {
    spritesOp.appendChild(criarSlotBatalha(`adv-${i}`, pk.sprite, pk.nome));
  });

  timeJ.forEach((pk, i) => {
    spritesJg.appendChild(criarSlotBatalha(`jog-${i}`, spriteUrl(pk, pk.isShiny), pk.nome));
  });

  // Inicializa sprites grandes da arena com os primeiros combatentes
  const advArena = document.getElementById('spriteArenaAdv');
  const jogArena = document.getElementById('spriteArenaJog');
  if (advArena) { advArena.src = timeA[0].sprite; advArena.className = 'sprite-arena'; }
  if (jogArena) { jogArena.src = spriteUrl(timeJ[0], timeJ[0].isShiny); jogArena.className = 'sprite-arena'; }

  mostrar(telaBatalha);
  animarBatalha(resultado.log, resultado.vitoria, gin);
}

function animarBatalha(logEntries, vitoria, gin) {
  const logEl     = document.getElementById('logBatalha');
  const btnProximo = document.getElementById('btnProximo');

  function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function rodarAnimacao() {
    await esperar(600);

    for (const e of logEntries) {
      // Entrada especial: poção usada
      if (e.tipo === 'pocao') {
        adicionarLog(logEl, `🧪 ${nomePT(e.pk.nome)} usou Poção! Força +20% (+${e.cura})!`, 'pocao');
        await esperar(900);
        continue;
      }

      const pkVenc   = nomePT(e.venc.nome);
      const pkDerrot = nomePT(e.derrota.nome);

      // Novo par de lutadores → destaca sprites
      marcarAtivo(e.iJ, e.iA);

      // Anúncio do confronto
      const nomAtk = e.vitoria === 'jogador' ? pkVenc : pkDerrot;
      const nomDef = e.vitoria === 'jogador' ? pkDerrot : pkVenc;
      adicionarLog(logEl, `${nomAtk} × ${nomDef}`, 'confronto');
      await esperar(1000);

      // Vantagem de tipo (suspense extra)
      const multVenc = e.vitoria === 'jogador' ? e.multJ : e.multA;
      if (multVenc >= 1.35) {
        adicionarLog(logEl, `⚡ DUPLA FRAQUEZA! ${pkVenc} domina ${pkDerrot}!`, 'vantagem dupla');
        await esperar(700);
      } else if (multVenc > 1.0) {
        adicionarLog(logEl, `⚡ ${pkVenc} é super efetivo contra ${pkDerrot}!`, 'vantagem');
        await esperar(700);
      }

      // Resultado do duelo
      const isShinyVenc = e.vitoria === 'jogador' && estado.squad[e.iJ]?.isShiny;
      const classeRes   = e.vitoria === 'jogador' ? (isShinyVenc ? 'shiny' : 'vitoria') : 'derrota';
      adicionarLog(logEl, `${pkVenc} derrotou ${pkDerrot}!`, classeRes);

      // Atualiza barras de HP com os valores pós-duelo
      atualizarBarrasHP(e.hpJSnap, e.hpASnap, e.hpJBase, e.hpABase);

      // Anima sprite do derrotado (mini + arena grande)
      const idDerrot   = e.vitoria === 'jogador' ? `adv-${e.iA}` : `jog-${e.iJ}`;
      const idArena    = e.vitoria === 'jogador' ? 'spriteArenaAdv' : 'spriteArenaJog';
      const elDerrot   = document.getElementById(idDerrot);
      const elArenaD   = document.getElementById(idArena);
      if (elDerrot)  elDerrot.classList.add('desmaiando');
      if (elArenaD)  elArenaD.classList.add('arena-desmaiando');
      await esperar(1100);
      if (elDerrot)  { elDerrot.classList.add('desmaiado'); elDerrot.classList.remove('desmaiando', 'ativo'); }
      if (elArenaD)  { elArenaD.classList.add('arena-desmaiado'); elArenaD.classList.remove('arena-desmaiando'); }

      // Rastrear vitórias
      if (e.vitoria === 'jogador') {
        const id = e.venc.id;
        estado.vitoriasPorPk[id] = (estado.vitoriasPorPk[id] || 0) + 1;
      }

      await esperar(600);
    }

    // Resultado final
    adicionarLog(
      logEl,
      vitoria ? `🏆 ${gin.nome} foi derrotado!` : `💀 Derrotado por ${gin.nome}...`,
      vitoria ? 'fim vitoria' : 'fim derrota'
    );

    btnProximo.textContent = vitoria ? '▶ CONTINUAR' : '▶ VER RESULTADO';
    btnProximo.classList.remove('oculto');
    btnProximo.onclick = () => vitoria ? aposVitoria() : aposDerota(gin);
  }

  rodarAnimacao();
}

function adicionarLog(logEl, texto, classe = '') {
  const div = document.createElement('div');
  div.className = `log-entry ${classe}`;
  div.textContent = texto;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

function marcarAtivo(iJ, iA) {
  document.querySelectorAll('.sprite-batalha').forEach(el => el.classList.remove('ativo'));
  const elJ = document.getElementById(`jog-${iJ}`);
  const elA = document.getElementById(`adv-${iA}`);
  if (elJ && !elJ.classList.contains('desmaiado')) elJ.classList.add('ativo');
  if (elA && !elA.classList.contains('desmaiado')) elA.classList.add('ativo');

  // Atualiza sprites grandes da arena
  const pkJ = estado.squad[iJ];
  const pkA = timeAdversarioGlobal[iA];
  const advArena = document.getElementById('spriteArenaAdv');
  const jogArena = document.getElementById('spriteArenaJog');
  if (advArena && pkA) { advArena.src = pkA.sprite; advArena.className = 'sprite-arena'; }
  if (jogArena && pkJ) { jogArena.src = spriteUrl(pkJ, pkJ.isShiny); jogArena.className = 'sprite-arena'; }
}

// ===== PÓS-BATALHA =====

function renderInsignias() {
  const container = document.getElementById('insigniasBar');
  if (!container) return;
  container.innerHTML = estado.liga.slice(0, 8)
    .filter(g => g.insignia)
    .map(g => {
      const conquistada = estado.insignias.includes(g.insignia.nome);
      return conquistada
        ? `<div class="insignia-slot conquistada" title="${g.insignia.nome} Badge">
             <img src="badges/${g.insignia.arquivo}" alt="${g.insignia.nome}" />
           </div>`
        : `<div class="insignia-slot" title="${g.insignia.nome} Badge"></div>`;
    }).join('');
}

async function aposVitoria() {
  const ginVencido = estado.liga[estado.ginasioAtual];
  if (ginVencido.insignia) {
    estado.insignias.push(ginVencido.insignia.nome);
    renderInsignias();
  }
  restaurarTime();
  estado.ginasioAtual++;
  if (estado.ginasioAtual >= estado.liga.length) {
    encerrarCampanha(true);
  } else {
    mostrarPreJogo();
  }
}

function aposDerota(gin) {
  encerrarCampanha(false, gin);
}

function encerrarCampanha(vitoria, ginDerrota = null) {
  const caixa = document.getElementById('caixaFim');

  // Encontra MVP
  let mvpId = null, maxVit = 0;
  for (const [id, vit] of Object.entries(estado.vitoriasPorPk)) {
    if (vit > maxVit) { maxVit = vit; mvpId = parseInt(id); }
  }
  const mvpPk = (mvpId ? estado.squad.find(p => p.id === mvpId) : null) ?? estado.squad[0];
  const mvpNome = mvpPk ? nomePT(mvpPk.nome) : '???';

  const chegouAte = ginDerrota ? ginDerrota.nome : 'Campeão Lance';
  const txtCompartilhar = gerarTexto(vitoria, chegouAte, mvpNome);

  const posDerrota = estado.ginasioAtual; // índice 0-based da batalha perdida
  function labelPosicao(idx) {
    if (idx <= 7) return `${idx + 1}º Ginásio`;
    if (idx <= 10) return `${idx - 7}º Líder da Elite Four`;
    return 'Campeão';
  }
  const subtituloDerrota = ginDerrota
    ? `Eliminado por ${ginDerrota.nome} (${labelPosicao(posDerrota)})`
    : 'Você conquistou a Liga Pokémon!';

  const totalInsignias = estado.insignias.length;
  const insigniasFimHtml = estado.liga.slice(0, 8)
    .filter(g => g.insignia)
    .map(g => {
      const conquistada = estado.insignias.includes(g.insignia.nome);
      return conquistada
        ? `<div class="insignia-fim conquistada" title="${g.insignia.nome} Badge"><img src="badges/${g.insignia.arquivo}" alt="${g.insignia.nome}"/></div>`
        : `<div class="insignia-fim vazia" title="${g.insignia.nome} Badge"></div>`;
    }).join('');

  const squadHtml = estado.squad.map(pk => `
    <div class="squad-fim-slot${pk.isShiny ? ' shiny' : ''}${pk === mvpPk ? ' mvp' : ''}">
      <img src="${spriteUrl(pk, pk.isShiny)}" alt="${pk.nome}" />
      <span>${nomePT(pk.nome)}</span>
    </div>`).join('');

  const svgPokebola = SVG_POKEBOLA;
  const svgTrofeu   = SVG_TROFEU;

  caixa.innerHTML = `
    <div class="resultado-icone">${vitoria ? svgTrofeu : svgPokebola}</div>
    <p class="titulo-fase">${vitoria ? 'CAMPEÃO!' : 'DERROTA...'}</p>
    <p class="subtitulo">${subtituloDerrota}</p>
    <div class="insignias-fim-container">
      <div class="insignias-fim-label">${totalInsignias}/8 insígnias</div>
      <div class="insignias-fim-row">${insigniasFimHtml}</div>
    </div>
    <div class="squad-fim">${squadHtml}</div>
    <div class="mvp-destaque">⭐ MVP: ${nomePT(mvpPk?.nome ?? '???')}${mvpPk?.isShiny ? ' ✦' : ''}</div>
    <div class="btns-fim">
      <button class="btn-imagem" id="btnImagem">📸 COMPARTILHAR IMAGEM</button>
      <button class="btn-reiniciar" id="btnReiniciar">↺ JOGAR NOVAMENTE</button>
    </div>
  `;

  mostrar(telaFim);

  document.getElementById('btnReiniciar').addEventListener('click', () => location.reload());

  document.getElementById('btnImagem').addEventListener('click', async () => {
    const btn = document.getElementById('btnImagem');
    btn.textContent = '⏳ GERANDO...';
    btn.disabled = true;
    try {
      const blob = await gerarImagemResultado(vitoria, ginDerrota, mvpNome);
      const file = new File([blob], 'pokedraft.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'PokéDraft' });
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 15000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
    btn.textContent = '📸 COMPARTILHAR IMAGEM';
    btn.disabled = false;
  });
}

function gerarTexto(vitoria, chegouAte, mvpNome) {
  const icone = vitoria ? '🏆' : '⚫';
  const squad = estado.squad.map(p => nomePT(p.nome) + (p.isShiny ? ' ★' : '')).join(', ');
  return `PokéDraft ${icone}
Cheguei até: ${chegouAte}
MVP: ${mvpNome}
Time: ${squad}
Jogue em: pokedraft-game.vercel.app`;
}

// ===== COMPARTILHAR COMO IMAGEM =====

function carregarImagem(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function gerarImagemResultado(vitoria, ginDerrota, mvpNome) {
  const W = 360, S = 2;
  const canvas = document.createElement('canvas');
  canvas.width  = W * S;

  // Primeira passagem para calcular altura
  const calcCtx = document.createElement('canvas').getContext('2d');
  const H = await _desenharCard(calcCtx, W, vitoria, ginDerrota, mvpNome, true);

  canvas.height = H * S;
  const ctx = canvas.getContext('2d');
  ctx.scale(S, S);
  await _desenharCard(ctx, W, vitoria, ginDerrota, mvpNome, false);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

async function _desenharCard(ctx, W, vitoria, ginDerrota, mvpNome, somenteCalcular) {
  const beige   = '#f0e8d0';
  const beigeEsc= '#c8a87a';
  const preto   = '#1a1a1a';
  const vermelho= '#c8342a';
  const dourado = '#b8860b';
  const cinzaT  = '#555';
  const verdeOk = '#155a28';

  const mono = '"Courier New", Courier, monospace';

  function texto(t, x, y, cor, tam, negrito = false) {
    if (somenteCalcular) return;
    ctx.fillStyle = cor;
    ctx.font = `${negrito ? 'bold ' : ''}${tam}px ${mono}`;
    ctx.textAlign = x === W / 2 ? 'center' : 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(t, x, y);
  }

  function linha(y) {
    if (somenteCalcular) return;
    ctx.fillStyle = beigeEsc;
    ctx.fillRect(20, y - 1, W - 40, 1);
  }

  let y = 0;

  // Fundo
  if (!somenteCalcular) {
    ctx.fillStyle = beige;
    ctx.fillRect(0, 0, W, 9999);
    ctx.strokeStyle = preto;
    ctx.lineWidth = 4;
    // borda será desenhada depois — usamos y final
  }

  y = 38;
  texto('PokéDraft', W / 2, y, vermelho, 18, true);

  y += 24;
  linha(y);

  // Ícone SVG
  const svgStr  = vitoria ? SVG_TROFEU : SVG_POKEBOLA;
  const iconW   = vitoria ? 72 : 60;
  const iconH   = vitoria ? 92 : 60;
  const iconTop = y + 14;
  if (!somenteCalcular) {
    const svgUrl = 'data:image/svg+xml,' + encodeURIComponent(svgStr);
    const iconImg = await carregarImagem(svgUrl);
    if (iconImg) ctx.drawImage(iconImg, W / 2 - iconW / 2, iconTop, iconW, iconH);
  }
  y = iconTop + iconH + 16;

  texto(vitoria ? 'CAMPEÃO!' : 'DERROTA...', W / 2, y, vitoria ? verdeOk : vermelho, 15, true);
  y += 22;

  const subtxt = vitoria ? 'Conquistou a Liga Pokémon!' : `Eliminado por ${ginDerrota?.nome || '?'}.`;
  texto(subtxt, W / 2, y, cinzaT, 8);
  y += 22;

  linha(y);
  y += 16;

  // Insígnias
  const badgeGins = estado.liga.slice(0, 8).filter(g => g.insignia);
  const BSZ = 28, BGAP = 5;
  const totalBW = badgeGins.length * BSZ + (badgeGins.length - 1) * BGAP;
  let bx = W / 2 - totalBW / 2;

  if (!somenteCalcular) {
    const badgeImgs = await Promise.all(badgeGins.map(g => carregarImagem(`badges/${g.insignia.arquivo}`)));

    texto(`${estado.insignias.length}/8 insígnias`, W / 2, y, cinzaT, 8);
    y += 16;

    for (let i = 0; i < badgeGins.length; i++) {
      const conquistada = estado.insignias.includes(badgeGins[i].insignia.nome);
      ctx.fillStyle = conquistada ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.08)';
      ctx.beginPath();
      ctx.arc(bx + BSZ / 2, y + BSZ / 2, BSZ / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = conquistada ? dourado : '#aaa';
      ctx.lineWidth = conquistada ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(bx + BSZ / 2, y + BSZ / 2, BSZ / 2, 0, Math.PI * 2);
      ctx.stroke();
      if (badgeImgs[i]) {
        ctx.globalAlpha = conquistada ? 1 : 0.18;
        ctx.drawImage(badgeImgs[i], bx + 4, y + 4, BSZ - 8, BSZ - 8);
        ctx.globalAlpha = 1;
      }
      bx += BSZ + BGAP;
    }
  } else {
    // modo cálculo: só avança y como se tivesse desenhado
    y += 16;
  }
  y += BSZ + 18;

  linha(y);
  y += 18;

  // MVP
  texto(`MVP: ${mvpNome}`, 24, y, preto, 9, true);
  y += 20;

  texto('Time:', 24, y, cinzaT, 8);
  y += 16;

  const nomes  = estado.squad.map(p => nomePT(p.nome) + (p.isShiny ? ' ★' : ''));
  const linha1 = nomes.slice(0, 3).join(' · ');
  const linha2 = nomes.slice(3).join(' · ');
  ctx.font = `7px ${mono}`;
  ctx.textAlign = 'center';
  if (!somenteCalcular) {
    ctx.fillStyle = preto;
    ctx.textBaseline = 'middle';
    ctx.fillText(linha1, W / 2, y);
  }
  y += 14;
  if (!somenteCalcular) ctx.fillText(linha2, W / 2, y);
  y += 22;

  linha(y);
  y += 16;

  texto('pokedraft-game.vercel.app', W / 2, y, cinzaT, 7);
  y += 24;

  // Borda (só no modo real, agora que temos a altura final)
  if (!somenteCalcular) {
    ctx.strokeStyle = preto;
    ctx.lineWidth = 4;
    ctx.strokeRect(3, 3, W - 6, y - 6);
    ctx.strokeStyle = dourado;
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, W - 20, y - 20);
  }

  return y;
}

// ===== EVENTOS INICIAIS =====

document.getElementById('btnIniciar').addEventListener('click', () => {
  sortearLiga();
  renderInsignias();
  iniciarRodadaDraft();
});

document.getElementById('btnRegras').addEventListener('click', () => {
  document.getElementById('modalRegras').classList.remove('oculto');
});
document.getElementById('btnFecharRegras').addEventListener('click', () => {
  document.getElementById('modalRegras').classList.add('oculto');
});
document.getElementById('modalRegras').addEventListener('click', e => {
  if (e.target === e.currentTarget)
    document.getElementById('modalRegras').classList.add('oculto');
});

document.getElementById('btnAvancarBatalha').addEventListener('click', () => {
  restaurarTime();
  mostrarPreJogo();
});

// ===== PWA =====

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

let promptInstalacao = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  promptInstalacao = e;

  if (localStorage.getItem('pwa-dispensado')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-banner';
  banner.innerHTML = `
    <span>⬇️ Instale o PokéDraft na sua tela inicial!</span>
    <button id="pwa-btn-instalar">Instalar</button>
    <button id="pwa-btn-fechar" aria-label="Fechar">✕</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwa-btn-instalar').addEventListener('click', () => {
    promptInstalacao.prompt();
    promptInstalacao.userChoice.then(() => banner.remove());
  });

  document.getElementById('pwa-btn-fechar').addEventListener('click', () => {
    localStorage.setItem('pwa-dispensado', '1');
    banner.remove();
  });
});
