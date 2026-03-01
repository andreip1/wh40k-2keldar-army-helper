import { useState, useEffect, useCallback } from "react";

const PHASES = [
  { id: "command", name: "Command", icon: "⚡", color: "#c9a84c" },
  { id: "movement", name: "Movement", icon: "➤", color: "#4a9eff" },
  { id: "shooting", name: "Shooting", icon: "◎", color: "#ff6b4a" },
  { id: "charge", name: "Charge", icon: "⚔", color: "#e84393" },
  { id: "fight", name: "Fight", icon: "🗡", color: "#d63031" },
  { id: "battleshock", name: "Battleshock", icon: "💀", color: "#6c5ce7" },
];

const ROUND_START = {
  id: "roundstart",
  name: "Start of Round",
  icon: "◈",
  color: "#00b894",
};

const ARMY_DATA = {
  faction: "Asuryani",
  detachment: "Aspect Host",
  battleSize: "Strike Force",
  points: { used: 1985, limit: 2000 },
  battleFocusTokens: 4,
  units: [
    {
      name: "Fuegan",
      type: "Phoenix Lord",
      pts: 120,
      role: "Warlord",
      keywords: ["Character", "Epic Hero", "Infantry", "Phoenix Lord", "Aspect Warrior"],
      stats: { M: '7"', T: 3, SV: "2+", W: 5, LD: "6+", OC: 1 },
      invuln: "4+",
      leadsUnit: "Fire Dragons",
      abilities: [
        { name: "Burning Lance", desc: "While leading a unit, add 6\" to the Range of Melta weapons in that unit." },
        { name: "Unquenchable Resolve", desc: "First time destroyed, end of phase, roll D6: on 2+, set back up with full wounds (not within Engagement Range of enemy)." },
      ],
      weapons: {
        ranged: [
          { name: "Searsong - Beam", range: '12"', A: 3, BS: "2+", S: 8, AP: -3, D: 2, keywords: "Assault, Melta 1, Sustained Hits 2" },
          { name: "Searsong - Lance", range: '18"', A: 1, BS: "2+", S: 14, AP: -4, D: "D6", keywords: "Assault, Melta 6" },
        ],
        melee: [
          { name: "The Fire Axe", A: 6, WS: "2+", S: 5, AP: -4, D: 3 },
        ],
      },
    },
    {
      name: "Jain Zar",
      type: "Phoenix Lord",
      pts: 120,
      keywords: ["Character", "Epic Hero", "Infantry", "Phoenix Lord", "Aspect Warrior"],
      stats: { M: '8"', T: 3, SV: "2+", W: 5, LD: "6+", OC: 1 },
      invuln: "4+",
      leadsUnit: "Howling Banshees",
      abilities: [
        { name: "Fights First", desc: "This unit fights in the Fights First step." },
        { name: "Whirling Death", desc: "While leading, when unit Advances: no Advance roll, add 6\" to Move, ignore vertical distance on Advance moves." },
        { name: "Storm of Silence", desc: "Re-roll Wound rolls against Character units." },
      ],
      weapons: {
        ranged: [
          { name: "Silent Death", range: '12"', A: 6, BS: "2+", S: 6, AP: -2, D: 1, keywords: "Assault" },
        ],
        melee: [
          { name: "Blade of Destruction", A: 8, WS: "2+", S: 6, AP: -3, D: 2, keywords: "Anti-Infantry 3+" },
        ],
      },
    },
    {
      name: "Lhykhis",
      type: "Phoenix Lord",
      pts: 135,
      keywords: ["Character", "Epic Hero", "Infantry", "Phoenix Lord", "Aspect Warrior", "Jump Pack", "Fly"],
      stats: { M: '12"', T: 3, SV: "2+", W: 5, LD: "6+", OC: 1 },
      invuln: "4+",
      leadsUnit: "Warp Spiders",
      abilities: [
        { name: "Deep Strike", desc: "Can be set up in Reserves; arrive 9\"+ from enemies." },
        { name: "Empyric Ambush", desc: "While leading, unit can charge after using Flickerjump." },
        { name: "Whispering Web", desc: "After shooting, select enemy unit hit: until end of turn, friendly Aeldari attacks vs that unit get Critical Hits on 5+." },
      ],
      weapons: {
        ranged: [
          { name: "Brood Twain", range: '12"', A: "D6+3", BS: "N/A", S: 6, AP: -2, D: 1, keywords: "Ignores Cover, Torrent, Twin-Linked" },
        ],
        melee: [
          { name: "Spider's Fangs", A: 5, WS: "2+", S: 4, AP: -2, D: 1, keywords: "Extra Attacks, Lethal Hits" },
          { name: "Weaverender", A: 5, WS: "2+", S: 6, AP: -2, D: 2, keywords: "Lethal Hits" },
        ],
      },
    },
    {
      name: "Maugan Ra",
      type: "Phoenix Lord",
      pts: 100,
      keywords: ["Character", "Epic Hero", "Infantry", "Phoenix Lord", "Aspect Warrior"],
      stats: { M: '7"', T: 3, SV: "2+", W: 5, LD: "6+", OC: 1 },
      invuln: "4+",
      leadsUnit: "Dark Reapers",
      abilities: [
        { name: "Harvester of Souls", desc: "While leading, after shooting same target with all attacks: roll D6 for target + each enemy within 3\". On 5+, that unit takes D3 mortal wounds." },
        { name: "Face of Death", desc: "After shooting, target must take Battle-shock test at -1." },
      ],
      weapons: {
        ranged: [
          { name: "Maugetar", range: '36"', A: 6, BS: "2+", S: 7, AP: -2, D: 2, keywords: "Devastating Wounds, Ignores Cover" },
        ],
        melee: [
          { name: "Maugetar", A: 5, WS: "2+", S: 6, AP: -2, D: 2 },
        ],
      },
    },
    {
      name: "Guardian Defenders",
      type: "Battleline",
      pts: 100,
      count: "10 Guardians + 1 Heavy Weapon Platform",
      keywords: ["Infantry", "Guardians", "Grenades"],
      stats: { M: '7"', T: 3, SV: "4+", W: 1, LD: "7+", OC: 2 },
      abilities: [
        { name: "Fleet of Foot", desc: "Can perform Fade Back without spending a Battle Focus token. Can do so even if other units have, and doesn't block others." },
        { name: "Crewed Platform", desc: "When last Guardian Defender destroyed, remaining Heavy Weapon Platforms also destroyed." },
      ],
      weapons: {
        ranged: [
          { name: "Shuriken Catapult", range: '18"', A: 2, BS: "3+", S: 4, AP: -1, D: 1, keywords: "Assault" },
          { name: "Shuriken Cannon (Platform)", range: '24"', A: 3, BS: "3+", S: 6, AP: -1, D: 2, keywords: "Lethal Hits" },
        ],
        melee: [
          { name: "Close Combat Weapon", A: 1, WS: "3+", S: 3, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Dark Reapers",
      type: "Infantry",
      pts: 90,
      count: "4 Reapers + 1 Exarch",
      keywords: ["Infantry", "Aspect Warrior"],
      stats: { M: '6"', T: 3, SV: "3+", W: "1/2", LD: "6+", OC: 1 },
      invuln: "5+",
      abilities: [
        { name: "Inescapable Accuracy", desc: "Ignore any/all modifiers to BS and Hit rolls for ranged attacks." },
      ],
      weapons: {
        ranged: [
          { name: "Reaper Launcher - Starshot", range: '48"', A: 1, BS: "3+", S: 10, AP: -2, D: 3, keywords: "Ignores Cover" },
          { name: "Reaper Launcher - Starswarm", range: '48"', A: 2, BS: "3+", S: 5, AP: -2, D: 1, keywords: "Ignores Cover" },
        ],
        melee: [
          { name: "Close Combat Weapon", A: 2, WS: "3+", S: 3, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Fire Dragons (x2)",
      type: "Infantry",
      pts: "120 each",
      count: "4 Dragons + 1 Exarch (per unit)",
      keywords: ["Infantry", "Aspect Warrior", "Grenades"],
      stats: { M: '7"', T: 3, SV: "3+", W: "1/2", LD: "6+", OC: 1 },
      invuln: "5+",
      abilities: [
        { name: "Assured Destruction", desc: "Re-roll Hit, Wound, AND Damage rolls vs Monsters/Vehicles in Shooting phase." },
      ],
      weapons: {
        ranged: [
          { name: "Dragon Fusion Gun", range: '12"', A: 1, BS: "3+", S: 9, AP: -4, D: "D6", keywords: "Assault, Melta 3" },
          { name: "Exarch's Dragon Fusion Gun", range: '12"', A: 1, BS: "3+", S: 9, AP: -4, D: "D6", keywords: "Assault, Melta 6" },
        ],
        melee: [
          { name: "Close Combat Weapon", A: 2, WS: "3+", S: 3, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Howling Banshees",
      type: "Infantry",
      pts: 95,
      count: "4 Banshees + 1 Exarch",
      keywords: ["Infantry", "Aspect Warrior"],
      stats: { M: '8"', T: 3, SV: "4+", W: "1/2", LD: "6+", OC: 1 },
      invuln: "5+ (4+ in melee)",
      abilities: [
        { name: "Fights First", desc: "Fights in the Fights First step." },
        { name: "Acrobatic", desc: "Eligible to charge after Advancing or Falling Back." },
      ],
      weapons: {
        ranged: [
          { name: "Shuriken Pistol", range: '12"', A: 1, BS: "3+", S: 4, AP: -1, D: 1, keywords: "Assault, Pistol" },
        ],
        melee: [
          { name: "Banshee Blade", A: 2, WS: "2+", S: 4, AP: -2, D: 2, keywords: "Anti-Infantry 3+" },
          { name: "Triskele (Exarch)", A: 6, WS: "2+", S: 3, AP: -1, D: 1, keywords: "Anti-Infantry 3+" },
        ],
      },
    },
    {
      name: "Rangers",
      type: "Infantry",
      pts: 55,
      count: 5,
      keywords: ["Infantry"],
      stats: { M: '7"', T: 3, SV: "5+", W: 1, LD: "7+", OC: 1 },
      invuln: "5+ (ranged only)",
      abilities: [
        { name: "Infiltrators", desc: "Deploy anywhere 9\"+ from enemy deployment zone and all enemy models." },
        { name: "Stealth", desc: "Subtract 1 from ranged attack Hit rolls targeting this unit." },
        { name: "Path of the Outcast", desc: "Once per turn, when enemy ends Normal/Advance/Fall Back move within 9\", Rangers can make a Normal move of D6\"." },
      ],
      weapons: {
        ranged: [
          { name: "Long Rifle", range: '36"', A: 1, BS: "3+", S: 4, AP: -1, D: 2, keywords: "Heavy, Precision" },
          { name: "Shuriken Pistol", range: '12"', A: 1, BS: "2+", S: 4, AP: -1, D: 1, keywords: "Assault, Pistol" },
        ],
        melee: [
          { name: "Close Combat Weapon", A: 1, WS: "3+", S: 3, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Striking Scorpions (x2)",
      type: "Infantry",
      pts: "85 each",
      count: "4 Scorpions + 1 Exarch (per unit)",
      keywords: ["Infantry", "Aspect Warrior"],
      stats: { M: '7"', T: 3, SV: "3+", W: "1/2", LD: "6+", OC: 1 },
      invuln: "5+",
      abilities: [
        { name: "Infiltrators", desc: "Deploy anywhere 9\"+ from enemy deployment zone and all enemy models." },
        { name: "Stealth", desc: "-1 to Hit rolls for ranged attacks against this unit." },
        { name: "Scouts 7\"", desc: "Pre-game Normal move up to 7\" (must end 9\"+ from enemies)." },
        { name: "Mandiblasters", desc: "On a charge turn, unmodified Hit roll of 5+ = Critical Hit in melee." },
      ],
      weapons: {
        melee: [
          { name: "Scorpion Chainsword", A: 4, WS: "3+", S: 4, AP: -1, D: 1, keywords: "Sustained Hits 1" },
          { name: "Scorpion's Claw (Exarch)", A: 3, WS: "3+", S: 8, AP: -2, D: 2 },
        ],
        ranged: [
          { name: "Shuriken Pistol", range: '12"', A: 1, BS: "3+", S: 4, AP: -1, D: 1, keywords: "Assault, Pistol" },
        ],
      },
    },
    {
      name: "Swooping Hawks (x2)",
      type: "Infantry",
      pts: "95 each",
      count: "4 Hawks + 1 Exarch (per unit)",
      keywords: ["Infantry", "Aspect Warrior", "Fly", "Jump Pack", "Grenades"],
      stats: { M: '14"', T: 3, SV: "4+", W: "1/2", LD: "6+", OC: 1 },
      invuln: "5+",
      abilities: [
        { name: "Deep Strike", desc: "Can set up in Reserves; arrive 9\"+ from enemies." },
        { name: "Grenade Pack Flyover", desc: "Once/turn in Movement phase when set up or after move: pick enemy within 8\"/visible, roll D6 per Swooping Hawk model. 4+ = 1 MW (max 6 MW). Cannot use Grenades Stratagem same turn." },
      ],
      weapons: {
        ranged: [
          { name: "Lasblaster", range: '24"', A: 4, BS: "3+", S: 4, AP: 0, D: 1, keywords: "Assault, Lethal Hits" },
          { name: "Hawk's Talon (Exarch)", range: '24"', A: 2, BS: "3+", S: 6, AP: -2, D: 2, keywords: "Lethal Hits" },
        ],
        melee: [
          { name: "Close Combat Weapon", A: 2, WS: "3+", S: 3, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Warp Spiders (x3)",
      type: "Infantry",
      pts: "105 each",
      count: "4 Spiders + 1 Exarch (per unit)",
      keywords: ["Infantry", "Aspect Warrior", "Fly", "Jump Pack"],
      stats: { M: '12"', T: 3, SV: "3+", W: "1/2", LD: "6+", OC: 1 },
      invuln: "5+",
      abilities: [
        { name: "Deep Strike", desc: "Can set up in Reserves; arrive 9\"+ from enemies." },
        { name: "Flickerjump", desc: "In Movement phase: Move = 24\" but cannot charge this turn. End of phase, roll D6 per model: each 1 = 1 MW." },
      ],
      weapons: {
        ranged: [
          { name: "Death Spinner", range: '12"', A: "D6", BS: "N/A", S: 4, AP: -1, D: 1, keywords: "Ignores Cover, Torrent" },
          { name: "Exarch's Deathspinner", range: '12"', A: "D6", BS: "N/A", S: 6, AP: -2, D: 1, keywords: "Ignores Cover, Torrent" },
        ],
        melee: [
          { name: "Close Combat Weapon", A: 2, WS: "3+", S: 3, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Falcon",
      type: "Vehicle",
      pts: 130,
      keywords: ["Vehicle", "Fly", "Transport"],
      stats: { M: '14"', T: 9, SV: "3+", W: 12, LD: "7+", OC: 3 },
      transport: "6 Aeldari Infantry (Wraith = 2 slots, no Jump Pack/non-Asuryani Ynnari)",
      abilities: [
        { name: "Deadly Demise D3", desc: "On destruction, roll D6: on 6, each unit within 6\" suffers D3 MW." },
        { name: "Deep Strike", desc: "Can set up in Reserves." },
        { name: "Fire Support", desc: "After shooting, select enemy hit. Until end of turn, models that disembarked from this transport re-roll Wound rolls vs that enemy." },
        { name: "Damaged: 1-4 Wounds", desc: "Subtract 1 from Hit rolls when 1-4 wounds remaining." },
      ],
      weapons: {
        ranged: [
          { name: "Pulse Laser", range: '48"', A: 3, BS: "3+", S: 9, AP: -2, D: "D6" },
          { name: "Shuriken Cannon", range: '24"', A: 3, BS: "3+", S: 6, AP: -1, D: 2, keywords: "Lethal Hits" },
          { name: "Twin Shuriken Catapult", range: '18"', A: 2, BS: "3+", S: 4, AP: -1, D: 1, keywords: "Assault, Twin-Linked" },
        ],
        melee: [
          { name: "Wraithbone Hull", A: 3, WS: "4+", S: 6, AP: 0, D: 1 },
        ],
      },
    },
    {
      name: "Wave Serpent",
      type: "Dedicated Transport",
      pts: 125,
      keywords: ["Vehicle", "Fly", "Transport"],
      stats: { M: '14"', T: 9, SV: "3+", W: 13, LD: "7+", OC: 2 },
      invuln: "5+",
      transport: "12 Aeldari Infantry (Wraith = 2 slots, no Jump Pack/non-Asuryani Ynnari)",
      abilities: [
        { name: "Deadly Demise D3", desc: "On destruction, roll D6: on 6, each unit within 6\" suffers D3 MW." },
        { name: "Wave Serpent Shield", desc: "When S > T for ranged attacks, subtract 1 from Wound roll." },
        { name: "Damaged: 1-4 Wounds", desc: "Subtract 1 from Hit rolls when 1-4 wounds remaining." },
      ],
      weapons: {
        ranged: [
          { name: "Twin Shuriken Cannon", range: '24"', A: 3, BS: "3+", S: 6, AP: -1, D: 2, keywords: "Lethal Hits, Twin-Linked" },
          { name: "Twin Shuriken Catapult", range: '18"', A: 2, BS: "3+", S: 4, AP: -1, D: 1, keywords: "Assault, Twin-Linked" },
        ],
        melee: [
          { name: "Wraithbone Hull", A: 3, WS: "4+", S: 6, AP: 0, D: 1 },
        ],
      },
    },
  ],
};

const AGILE_MANOEUVRES = [
  { name: "Swift as the Wind", trigger: "Unit selected to Normal/Advance/Fall Back move", effect: "+2\" to Move until end of phase.", phase: "movement", note: "Can trigger multiple times (different unit each time)." },
  { name: "Flitting Shadows", trigger: "Unit selected to Normal/Advance/Fall Back move, set up, or declares charge", effect: "Enemy cannot use Fire Overwatch against that unit until end of turn.", phase: "movement", note: "" },
  { name: "Star Engines", trigger: "VEHICLE unit selected to Advance", effect: "Ranged weapons gain [Assault] until end of turn.", phase: "movement", note: "Vehicles only." },
  { name: "Sudden Strike", trigger: "Unit selected to fight", effect: "Pile-in and Consolidation moves up to 6\" instead of 3\".", phase: "fight", note: "" },
  { name: "Opportunity Seized", trigger: "Enemy unit ends a Fall Back move", effect: "One non-Titanic unit that was in Engagement Range can Normal move D6+1\".", phase: "movement", note: "Enemy phase trigger." },
  { name: "Fade Back", trigger: "After an enemy unit has shot (opponent's Shooting phase)", effect: "One non-Titanic unit hit can Normal move D6+1\".", phase: "shooting", note: "Opponent's phase. Guardian Defenders do this for FREE." },
];

const DETACHMENT_RULE = {
  name: "Path of the Warrior",
  desc: "Each time an Aspect Warriors or Avatar of Khaine unit shoots or fights, pick one: Re-roll Hit rolls of 1, OR Re-roll Wound rolls of 1.",
};

const PHASE_REMINDERS = {
  roundstart: [
    { priority: "critical", text: "Receive 4 Battle Focus tokens (Strike Force).", icon: "⚡" },
    { priority: "critical", text: "All unspent tokens from last round are LOST. Plan usage now.", icon: "⚠" },
    { priority: "info", text: "Battle Focus tokens fuel Agile Manoeuvres throughout the round.", icon: "ℹ" },
  ],
  command: [
    { priority: "high", text: "Gain 1 CP (if not first battle round).", icon: "⬆" },
    { priority: "high", text: "Check for Battle-shocked units — they cannot use OC and cannot benefit from Stratagems.", icon: "⚠" },
    { priority: "info", text: "Declare any universal Stratagems if needed (Command Re-roll costs 1 CP).", icon: "ℹ" },
  ],
  movement: [
    { priority: "critical", text: "PATH OF THE WARRIOR: Applies when Aspect Warriors SHOOT or FIGHT — choose re-roll 1s to Hit OR re-roll 1s to Wound.", icon: "⭐" },
    { priority: "critical", text: "BATTLE FOCUS — spend tokens for Agile Manoeuvres:", icon: "⚡" },
    { priority: "high", text: "Swift as the Wind: +2\" Move on Normal/Advance/Fall Back (can trigger multiple times, different units).", icon: "➤" },
    { priority: "high", text: "Flitting Shadows: No Overwatch against selected unit (on move, set up, or charge declaration).", icon: "🛡" },
    { priority: "high", text: "Star Engines: Vehicle Advance → ranged weapons gain [Assault].", icon: "🚀" },
    { priority: "high", text: "SWOOPING HAWKS: After set up or move, Grenade Pack Flyover — D6 per model within 8\", 4+ = 1 MW (max 6). No Grenades Stratagem after.", icon: "💣" },
    { priority: "high", text: "WARP SPIDERS: Flickerjump option — Move becomes 24\" but cannot charge. Roll D6 per model after: 1 = 1 MW.", icon: "✦" },
    { priority: "high", text: "LHYKHIS + WARP SPIDERS: Empyric Ambush — unit CAN charge even after Flickerjump.", icon: "⚔" },
    { priority: "high", text: "JAIN ZAR + BANSHEES: Whirling Death Advance — no roll, +6\" Move, ignore vertical distance.", icon: "🌀" },
    { priority: "info", text: "HOWLING BANSHEES: Acrobatic — eligible to charge after Advancing or Falling Back.", icon: "🩰" },
    { priority: "info", text: "RANGERS: Path of the Outcast — once/turn when enemy ends move within 9\", move D6\".", icon: "👁" },
    { priority: "info", text: "STRIKING SCORPIONS: Already deployed via Infiltrators + Scouts 7\" (pre-game). Stealth = -1 to hit them at range.", icon: "🦂" },
    { priority: "info", text: "FALCON/WAVE SERPENT: 14\" Move, can transport infantry. Plan disembarkation before moving.", icon: "🚗" },
    { priority: "info", text: "Units with Assault weapons (most of your army) can shoot after Advancing.", icon: "ℹ" },
  ],
  shooting: [
    { priority: "critical", text: "PATH OF THE WARRIOR: Choose per Aspect unit — re-roll 1s to Hit OR re-roll 1s to Wound.", icon: "⭐" },
    { priority: "critical", text: "FIRE DRAGONS vs Monsters/Vehicles: Re-roll Hit, Wound, AND Damage rolls (Assured Destruction).", icon: "🔥" },
    { priority: "high", text: "FUEGAN leading Fire Dragons: Melta weapons get +6\" Range. Searsong Lance at half range (12\") = Melta 6 → D6+6 damage!", icon: "🔥" },
    { priority: "high", text: "MAUGAN RA: Harvester of Souls — after shooting same target, roll D6 for target + each unit within 3\": 5+ = D3 MW.", icon: "💀" },
    { priority: "high", text: "MAUGAN RA: Face of Death — target takes Battle-shock at -1 after being shot.", icon: "😱" },
    { priority: "high", text: "LHYKHIS: Whispering Web — after shooting, select enemy hit. Friendly Aeldari get Crit Hits on 5+ vs that unit.", icon: "🕸" },
    { priority: "high", text: "FALCON: Fire Support — after shooting, disembarked models re-roll Wounds vs that target.", icon: "🎯" },
    { priority: "high", text: "DARK REAPERS: Inescapable Accuracy — ignore ALL BS modifiers and Hit roll modifiers.", icon: "◎" },
    { priority: "info", text: "WARP SPIDERS / LHYKHIS: Death Spinners are Torrent (auto-hit) + Ignores Cover.", icon: "🌀" },
    { priority: "info", text: "MAUGETAR: Devastating Wounds — Critical Wounds bypass all saves and deal mortal wounds equal to Damage.", icon: "💥" },
    { priority: "info", text: "Remember Pistols can shoot in Engagement Range (target engaged enemy only).", icon: "🔫" },
  ],
  charge: [
    { priority: "critical", text: "BATTLE FOCUS: Flitting Shadows can trigger when declaring a charge (no Overwatch).", icon: "🛡" },
    { priority: "high", text: "HOWLING BANSHEES: Can charge after Advancing or Falling Back (Acrobatic).", icon: "🩰" },
    { priority: "high", text: "LHYKHIS + WARP SPIDERS: Can charge after Flickerjump (Empyric Ambush).", icon: "✦" },
    { priority: "high", text: "STRIKING SCORPIONS: Mandiblasters — on charge turn, 5+ to Hit = Critical Hit in melee.", icon: "🦂" },
    { priority: "info", text: "Charge range is 2D6\". Must end within Engagement Range (1\") of at least one target.", icon: "📏" },
  ],
  fight: [
    { priority: "critical", text: "PATH OF THE WARRIOR: Choose per Aspect unit — re-roll 1s to Hit OR re-roll 1s to Wound.", icon: "⭐" },
    { priority: "critical", text: "FIGHTS FIRST: Jain Zar + Howling Banshees fight in Fights First step (before normal combats).", icon: "⚡" },
    { priority: "critical", text: "BATTLE FOCUS: Sudden Strike — spend token for 6\" Pile-in/Consolidation instead of 3\".", icon: "⚡" },
    { priority: "high", text: "JAIN ZAR: Storm of Silence — re-roll Wound rolls vs Characters.", icon: "⚔" },
    { priority: "high", text: "STRIKING SCORPIONS: If they charged this turn, 5+ to Hit = Critical Hit (Mandiblasters).", icon: "🦂" },
    { priority: "high", text: "LHYKHIS: Spider's Fangs = Extra Attacks + Lethal Hits; Weaverender = Lethal Hits.", icon: "🕷" },
    { priority: "info", text: "Fight sequence: Pile in → attack → consolidate. Pile in/consolidate towards nearest enemy.", icon: "ℹ" },
    { priority: "info", text: "Chargers fight first (in the Fights First step alongside Jain Zar/Banshees if they charged).", icon: "ℹ" },
  ],
  battleshock: [
    { priority: "high", text: "Take Battle-shock tests for units below Half-strength (2D6 vs Leadership).", icon: "💀" },
    { priority: "high", text: "Most of your army is LD 6+ (need 6+ on 2D6). Guardians/Wave Serpent are LD 7+.", icon: "📊" },
    { priority: "info", text: "Battle-shocked units: OC becomes 0, cannot benefit from Stratagems.", icon: "⚠" },
    { priority: "info", text: "Maugan Ra's Face of Death forces an enemy test at -1 (applied earlier in Shooting).", icon: "😱" },
  ],
};

const OPPONENT_PHASE_REMINDERS = [
  { priority: "critical", text: "BATTLE FOCUS: Fade Back — after enemy shoots a unit, that unit can Normal move D6+1\". Costs 1 token.", icon: "↩" },
  { priority: "critical", text: "GUARDIAN DEFENDERS: Fade Back is FREE (no token needed, doesn't block others).", icon: "🆓" },
  { priority: "high", text: "BATTLE FOCUS: Opportunity Seized — when enemy Falls Back, a unit that was engaged can Normal move D6+1\".", icon: "➤" },
  { priority: "high", text: "RANGERS: Path of the Outcast — when enemy ends move within 9\", Rangers can move D6\".", icon: "👁" },
  { priority: "info", text: "WAVE SERPENT: Wave Serpent Shield — S > T ranged attacks subtract 1 from Wound roll.", icon: "🛡" },
  { priority: "info", text: "FIRE OVERWATCH: Can use Overwatch Stratagem (1 CP) when enemies charge. Hit on 6s only.", icon: "🔥" },
  { priority: "info", text: "FUEGAN: Unquenchable Resolve — first time destroyed, 2+ to come back with full wounds.", icon: "♻" },
];

// ── Styles ──
const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
`;

const darkBg = "#0a0b0f";
const cardBg = "#12141c";
const cardBorder = "#1e2130";
const textPrimary = "#e8e6e3";
const textSecondary = "#8a8d98";
const accent = "#c9a84c";
const accentDim = "#8a7434";

function PriorityBadge({ priority }) {
  const colors = {
    critical: { bg: "rgba(255, 59, 48, 0.15)", border: "rgba(255, 59, 48, 0.4)", text: "#ff6b5b" },
    high: { bg: "rgba(255, 175, 64, 0.12)", border: "rgba(255, 175, 64, 0.35)", text: "#ffaf40" },
    info: { bg: "rgba(100, 120, 160, 0.12)", border: "rgba(100, 120, 160, 0.3)", text: "#7b8db8" },
  };
  const c = colors[priority] || colors.info;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
      padding: "2px 7px", borderRadius: 4, background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, whiteSpace: "nowrap", fontFamily: "Outfit, sans-serif",
    }}>
      {priority}
    </span>
  );
}

function ReminderCard({ item, index }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px",
      background: index % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
      borderRadius: 6, transition: "background 0.2s",
    }}>
      <span style={{ fontSize: 18, lineHeight: "24px", flexShrink: 0, width: 24, textAlign: "center" }}>
        {item.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <PriorityBadge priority={item.priority} />
        </div>
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.55, color: textPrimary,
          fontFamily: "Outfit, sans-serif", fontWeight: 400,
        }}>
          {item.text}
        </p>
      </div>
    </div>
  );
}

function UnitCard({ unit }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 8,
      overflow: "hidden", transition: "all 0.2s",
    }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer",
        color: textPrimary, fontFamily: "Outfit, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{unit.name}</span>
          {unit.role === "Warlord" && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
              background: "rgba(201,168,76,0.2)", border: `1px solid ${accentDim}`, color: accent,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>Warlord</span>
          )}
          <span style={{ fontSize: 12, color: textSecondary }}>{unit.type}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: textSecondary }}>{unit.pts} pts</span>
          <span style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s",
            fontSize: 12, color: textSecondary,
          }}>▼</span>
        </div>
      </button>
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${cardBorder}` }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: 2, margin: "12px 0 8px", flexWrap: "wrap" }}>
            {unit.stats && Object.entries(unit.stats).map(([k, v]) => (
              <div key={k} style={{
                textAlign: "center", padding: "4px 8px", background: "rgba(255,255,255,0.04)",
                borderRadius: 4, minWidth: 40,
              }}>
                <div style={{ fontSize: 9, color: textSecondary, fontWeight: 600, letterSpacing: "0.05em", fontFamily: "Outfit" }}>{k}</div>
                <div style={{ fontSize: 13, color: textPrimary, fontWeight: 600, fontFamily: "Outfit" }}>{v}</div>
              </div>
            ))}
            {unit.invuln && (
              <div style={{
                textAlign: "center", padding: "4px 8px", background: "rgba(201,168,76,0.1)",
                borderRadius: 4, border: `1px solid ${accentDim}`, minWidth: 40,
              }}>
                <div style={{ fontSize: 9, color: accent, fontWeight: 600, letterSpacing: "0.05em", fontFamily: "Outfit" }}>INV</div>
                <div style={{ fontSize: 13, color: accent, fontWeight: 600, fontFamily: "Outfit" }}>{unit.invuln}</div>
              </div>
            )}
          </div>
          {/* Abilities */}
          {unit.abilities && unit.abilities.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "Outfit" }}>ABILITIES</div>
              {unit.abilities.map((a, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: textPrimary, fontFamily: "Outfit" }}>{a.name}: </span>
                  <span style={{ fontSize: 12, color: textSecondary, fontFamily: "Outfit", lineHeight: 1.5 }}>{a.desc}</span>
                </div>
              ))}
            </div>
          )}
          {/* Weapons */}
          {unit.weapons && (
            <div style={{ marginTop: 10 }}>
              {unit.weapons.ranged && unit.weapons.ranged.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#ff6b4a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, fontFamily: "Outfit" }}>RANGED</div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Outfit" }}>
                      <thead>
                        <tr style={{ color: textSecondary }}>
                          {["Weapon", "Rng", "A", "BS", "S", "AP", "D", "Keywords"].map(h => (
                            <th key={h} style={{ padding: "3px 5px", textAlign: "left", fontWeight: 600, fontSize: 9, letterSpacing: "0.05em", borderBottom: `1px solid ${cardBorder}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {unit.weapons.ranged.map((w, i) => (
                          <tr key={i} style={{ color: textPrimary }}>
                            <td style={{ padding: "3px 5px", fontWeight: 500, whiteSpace: "nowrap" }}>{w.name}</td>
                            <td style={{ padding: "3px 5px" }}>{w.range}</td>
                            <td style={{ padding: "3px 5px" }}>{w.A}</td>
                            <td style={{ padding: "3px 5px" }}>{w.BS}</td>
                            <td style={{ padding: "3px 5px" }}>{w.S}</td>
                            <td style={{ padding: "3px 5px" }}>{w.AP}</td>
                            <td style={{ padding: "3px 5px" }}>{w.D}</td>
                            <td style={{ padding: "3px 5px", fontSize: 10, color: textSecondary }}>{w.keywords || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {unit.weapons.melee && unit.weapons.melee.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#d63031", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8, marginBottom: 4, fontFamily: "Outfit" }}>MELEE</div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "Outfit" }}>
                      <thead>
                        <tr style={{ color: textSecondary }}>
                          {["Weapon", "A", "WS", "S", "AP", "D", "Keywords"].map(h => (
                            <th key={h} style={{ padding: "3px 5px", textAlign: "left", fontWeight: 600, fontSize: 9, letterSpacing: "0.05em", borderBottom: `1px solid ${cardBorder}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {unit.weapons.melee.map((w, i) => (
                          <tr key={i} style={{ color: textPrimary }}>
                            <td style={{ padding: "3px 5px", fontWeight: 500, whiteSpace: "nowrap" }}>{w.name}</td>
                            <td style={{ padding: "3px 5px" }}>{w.A}</td>
                            <td style={{ padding: "3px 5px" }}>{w.WS}</td>
                            <td style={{ padding: "3px 5px" }}>{w.S}</td>
                            <td style={{ padding: "3px 5px" }}>{w.AP}</td>
                            <td style={{ padding: "3px 5px" }}>{w.D}</td>
                            <td style={{ padding: "3px 5px", fontSize: 10, color: textSecondary }}>{w.keywords || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
          {unit.transport && (
            <div style={{ marginTop: 8, fontSize: 11, color: textSecondary, fontFamily: "Outfit" }}>
              <span style={{ fontWeight: 600, color: "#4a9eff" }}>Transport: </span>{unit.transport}
            </div>
          )}
          {unit.leadsUnit && (
            <div style={{ marginTop: 4, fontSize: 11, color: textSecondary, fontFamily: "Outfit" }}>
              <span style={{ fontWeight: 600, color: accent }}>Leads: </span>{unit.leadsUnit}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgileManoeuvreCard({ m }) {
  const phaseColor = PHASES.find(p => p.id === m.phase)?.color || textSecondary;
  return (
    <div style={{
      padding: "12px 16px", background: cardBg, border: `1px solid ${cardBorder}`,
      borderRadius: 8, borderLeft: `3px solid ${phaseColor}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: textPrimary, fontFamily: "Cinzel" }}>{m.name}</span>
        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${phaseColor}22`, color: phaseColor, fontWeight: 600, fontFamily: "Outfit", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {m.phase}
        </span>
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 12, color: accent, fontFamily: "Outfit", fontWeight: 500 }}>
        Trigger: {m.trigger}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: textPrimary, fontFamily: "Outfit", lineHeight: 1.5 }}>
        {m.effect}
      </p>
      {m.note && <p style={{ margin: "4px 0 0", fontSize: 11, color: textSecondary, fontFamily: "Outfit", fontStyle: "italic" }}>{m.note}</p>}
    </div>
  );
}

export default function AsuryaniPhaseTracker() {
  const [activeTab, setActiveTab] = useState("phases");
  const [activePhase, setActivePhase] = useState("roundstart");
  const [round, setRound] = useState(1);
  const [tokens, setTokens] = useState(4);
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = useCallback((key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const nextRound = () => {
    setRound(r => r + 1);
    setTokens(4);
    setCheckedItems({});
    setActivePhase("roundstart");
  };

  const spendToken = () => {
    if (tokens > 0) setTokens(t => t - 1);
  };

  const currentReminders = activePhase === "opponent"
    ? OPPONENT_PHASE_REMINDERS
    : PHASE_REMINDERS[activePhase] || [];

  const allPhases = [ROUND_START, ...PHASES];
  const currentPhaseData = allPhases.find(p => p.id === activePhase) || { name: "Opponent's Turn", color: "#636e72", icon: "⟲" };

  return (
    <div style={{
      minHeight: "100vh", background: darkBg, color: textPrimary,
      fontFamily: "Outfit, sans-serif",
    }}>
      <style>{fonts}</style>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)`,
        borderBottom: `1px solid ${cardBorder}`, padding: "20px 24px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{
              margin: 0, fontSize: 22, fontFamily: "Cinzel, serif", fontWeight: 900,
              color: accent, letterSpacing: "0.04em",
            }}>
              ASURYANI WAR COUNCIL
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: textSecondary }}>
              Aspect Host · {ARMY_DATA.points.used}/{ARMY_DATA.points.limit} pts · Strike Force
            </p>
          </div>

          {/* Round & Token Tracker */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: textSecondary, letterSpacing: "0.1em", textTransform: "uppercase" }}>ROUND</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: textPrimary, fontFamily: "Cinzel", lineHeight: 1 }}>{round}</div>
            </div>
            <div style={{ width: 1, height: 36, background: cardBorder }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: textSecondary, letterSpacing: "0.1em", textTransform: "uppercase" }}>TOKENS</div>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: i < tokens ? accent : "rgba(201,168,76,0.15)",
                    border: `2px solid ${i < tokens ? accent : accentDim}`,
                    transition: "all 0.3s",
                    cursor: i < tokens ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: darkBg, fontWeight: 700,
                  }} onClick={i < tokens ? spendToken : undefined}>
                    {i < tokens ? "⚡" : ""}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={nextRound} style={{
              padding: "8px 16px", background: "rgba(201,168,76,0.15)", border: `1px solid ${accentDim}`,
              borderRadius: 6, color: accent, fontWeight: 600, fontSize: 12, cursor: "pointer",
              fontFamily: "Outfit", transition: "all 0.2s", letterSpacing: "0.03em",
            }}>
              Next Round →
            </button>
          </div>
        </div>

        {/* Main tabs */}
        <div style={{ display: "flex", gap: 2, marginTop: 16 }}>
          {[
            { id: "phases", label: "Phase Reminders" },
            { id: "manoeuvres", label: "Agile Manoeuvres" },
            { id: "units", label: "Army Roster" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 18px", background: activeTab === tab.id ? "rgba(201,168,76,0.15)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? accentDim : "transparent"}`,
              borderBottom: activeTab === tab.id ? `2px solid ${accent}` : "2px solid transparent",
              borderRadius: "6px 6px 0 0", color: activeTab === tab.id ? accent : textSecondary,
              fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit", transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 24px 80px", maxWidth: 960, margin: "0 auto" }}>

        {activeTab === "phases" && (
          <div className="fade-in">
            {/* Phase selector */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              <button onClick={() => setActivePhase("roundstart")} style={{
                padding: "7px 14px", borderRadius: 6, border: `1px solid ${activePhase === "roundstart" ? ROUND_START.color : cardBorder}`,
                background: activePhase === "roundstart" ? `${ROUND_START.color}18` : cardBg,
                color: activePhase === "roundstart" ? ROUND_START.color : textSecondary,
                fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "Outfit", transition: "all 0.2s",
              }}>
                {ROUND_START.icon} Start
              </button>
              {PHASES.map(p => (
                <button key={p.id} onClick={() => setActivePhase(p.id)} style={{
                  padding: "7px 14px", borderRadius: 6, border: `1px solid ${activePhase === p.id ? p.color : cardBorder}`,
                  background: activePhase === p.id ? `${p.color}18` : cardBg,
                  color: activePhase === p.id ? p.color : textSecondary,
                  fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "Outfit", transition: "all 0.2s",
                }}>
                  {p.icon} {p.name}
                </button>
              ))}
              <button onClick={() => setActivePhase("opponent")} style={{
                padding: "7px 14px", borderRadius: 6, border: `1px solid ${activePhase === "opponent" ? "#636e72" : cardBorder}`,
                background: activePhase === "opponent" ? "rgba(99,110,114,0.15)" : cardBg,
                color: activePhase === "opponent" ? "#b2bec3" : textSecondary,
                fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "Outfit", transition: "all 0.2s",
              }}>
                ⟲ Opponent's Turn
              </button>
            </div>

            {/* Phase header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
              padding: "14px 18px", background: `${currentPhaseData.color}10`,
              border: `1px solid ${currentPhaseData.color}30`, borderRadius: 8,
            }}>
              <span style={{ fontSize: 28 }}>{currentPhaseData.icon}</span>
              <div>
                <h2 style={{
                  margin: 0, fontSize: 20, fontFamily: "Cinzel, serif", fontWeight: 700,
                  color: currentPhaseData.color,
                }}>
                  {activePhase === "opponent" ? "Opponent's Turn" : currentPhaseData.name + " Phase"}
                </h2>
                {activePhase !== "opponent" && activePhase !== "roundstart" && (
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: textSecondary }}>
                    Round {round} · {tokens} Battle Focus token{tokens !== 1 ? "s" : ""} remaining
                  </p>
                )}
              </div>
            </div>

            {/* Detachment rule reminder */}
            {(activePhase === "shooting" || activePhase === "fight") && (
              <div style={{
                padding: "12px 16px", marginBottom: 12, background: "rgba(201,168,76,0.08)",
                border: `1px solid ${accentDim}`, borderRadius: 8,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, fontFamily: "Outfit" }}>
                  DETACHMENT RULE — {DETACHMENT_RULE.name}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: textPrimary, lineHeight: 1.5, fontFamily: "Outfit" }}>
                  {DETACHMENT_RULE.desc}
                </p>
              </div>
            )}

            {/* Reminders */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 8,
              overflow: "hidden",
            }}>
              {currentReminders.map((item, i) => (
                <div key={`${activePhase}-${i}`} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  borderBottom: i < currentReminders.length - 1 ? `1px solid ${cardBorder}` : "none",
                  opacity: checkedItems[`${activePhase}-${i}`] ? 0.4 : 1,
                  transition: "opacity 0.3s",
                }}>
                  <button onClick={() => toggleCheck(`${activePhase}-${i}`)} style={{
                    flexShrink: 0, width: 20, height: 20, marginTop: 14, marginLeft: 12,
                    borderRadius: 4, border: `2px solid ${checkedItems[`${activePhase}-${i}`] ? accent : cardBorder}`,
                    background: checkedItems[`${activePhase}-${i}`] ? accent : "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: darkBg, fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                  }}>
                    {checkedItems[`${activePhase}-${i}`] ? "✓" : ""}
                  </button>
                  <div style={{ flex: 1 }}>
                    <ReminderCard item={item} index={i} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "manoeuvres" && (
          <div className="fade-in">
            <div style={{
              padding: "14px 18px", marginBottom: 16,
              background: "rgba(201,168,76,0.08)", border: `1px solid ${accentDim}`, borderRadius: 8,
            }}>
              <h3 style={{ margin: "0 0 4px", fontFamily: "Cinzel", fontSize: 16, color: accent }}>Battle Focus</h3>
              <p style={{ margin: 0, fontSize: 13, color: textSecondary, lineHeight: 1.5 }}>
                Spend tokens to trigger Agile Manoeuvres. A unit can only perform one per phase. Unless noted, each manoeuvre triggers once per phase. You have <strong style={{ color: accent }}>{tokens} tokens</strong> remaining this round.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {AGILE_MANOEUVRES.map((m, i) => (
                <AgileManoeuvreCard key={i} m={m} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "units" && (
          <div className="fade-in">
            <p style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>
              Tap any unit to expand its full datasheet with stats, abilities, and weapons.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ARMY_DATA.units.map((unit, i) => (
                <UnitCard key={i} unit={unit} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
