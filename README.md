# Warhammer 40K — Phase Reminder App Generator

## How to use this prompt

1. Export your army list from **New Recruit** (or BattleScribe) as **JSON**
2. Paste this entire prompt into Claude, then paste your JSON roster after it
3. Claude will generate a React (.jsx) artifact — a fully interactive phase-by-phase tactical reminder app tailored to YOUR army

---

## Prompt

> **Create a React (.jsx) artifact**: a Warhammer 40,000 10th Edition interactive phase reminder app based on the army roster JSON I've pasted below.
>
> ### What to parse from my JSON
>
> The JSON is a BattleScribe / New Recruit roster export. Extract ALL of the following by walking the JSON structure:
>
> - **Army metadata**: faction, detachment name and rule, battle size, points used/limit
> - **Every unit**: name, point cost, model count, keywords, categories (Character, Battleline, Epic Hero, Vehicle, etc.)
> - **Unit stat profiles** (`typeName: "Unit"`): M, T, SV, W, LD, OC
> - **Weapon profiles** (`typeName: "Ranged Weapons"` and `typeName: "Melee Weapons"`): name, range, A, BS/WS, S, AP, D, keyword abilities
> - **Abilities** (`typeName: "Abilities"`): name and description text (`$text` field in characteristics)
> - **Transport profiles** (`typeName: "Transport"`): capacity text
> - **Rules** (in the `rules` arrays): name and description — these include army-wide rules (e.g. Battle Focus, Fights First, Deep Strike, Leader, etc.), weapon ability definitions (Assault, Melta, Lethal Hits, etc.), and detachment rules
> - **Invulnerable saves**: found in abilities with names like "Invulnerable Save"
> - **Leader attachments**: found in abilities named "Leader" that say "can be attached to..."
> - **Warlord**: identified by a selection with category name "Warlord"
> - **Agile Manoeuvres / faction-specific phase mechanics**: found in the top-level configuration selections (e.g. "Battle Focus - Agile Manoeuvres" for Asuryani)
>
> ### App structure — three tabs
>
> **Tab 1: Phase Reminders**
> A phase selector with buttons for each game phase. For each phase, show a checklist of context-aware reminders derived from the actual units, abilities, and rules in the roster. Include:
>
> - **Start of Round**: Faction resource mechanics (e.g. Battle Focus tokens, Oath of Moment, Miracle Dice, etc.), any start-of-round triggers
> - **Command Phase**: CP gain, Battle-shock reminders, any command-phase abilities from units in the roster
> - **Movement Phase**: Unit-specific movement abilities (Deep Strike, Infiltrators, Scouts, Advance-and-charge, transport embark/disembark, faction movement tricks), relevant faction resource spending
> - **Shooting Phase**: Detachment rule reminders, unit-specific shooting abilities (re-rolls, mortal wound riders, after-shooting triggers), weapon keyword reminders relevant to the army
> - **Charge Phase**: Charge-related abilities (charge after Advance/Fall Back, charge bonuses, overwatch denial)
> - **Fight Phase**: Fights First units, pile-in/consolidation modifiers, melee-specific abilities, detachment rule if it applies in melee
> - **Battleshock Phase**: Leadership values across the army, any Battle-shock modifiers from abilities
> - **Opponent's Turn**: Reactive abilities (e.g. Fade Back, Overwatch, re-deploy triggers, defensive abilities that activate in enemy phases)
>
> Each reminder should have:
> - A **priority** level: `critical` (don't forget this or you lose games), `high` (important tactical option), `info` (good to know)
> - An **icon** emoji
> - **Checkboxes** so the player can mark off completed actions during the phase
>
> **Tab 2: Faction Mechanic Reference** (e.g. Agile Manoeuvres, Miracle Dice, Oath of Moment — whatever the faction uses)
> - List each mechanic/option with its trigger, effect, phase, and any special notes
> - Show current resource count if applicable
>
> **Tab 3: Army Roster**
> - Expandable cards for every unit
> - Each card shows: stat block, invulnerable save, all abilities with descriptions, full weapon profiles in tables (ranged and melee), transport capacity, leader attachment info
> - Warlord badge on the warlord unit
>
> ### Header features
>
> - Army name, faction, detachment, points
> - **Round counter** with "Next Round" button (resets checkboxes and resource tokens)
> - **Resource token tracker** (visual, clickable to spend) — adapt to the faction's mechanic
>
> ### Design requirements
>
> - Dark theme with the faction's thematic color as accent (e.g. gold for Asuryani, red for Blood Angels, green for Orks, blue for Ultramarines, etc.)
> - Use `Cinzel` for headings (it has a Warhammer-appropriate feel) and `Outfit` for body text — import from Google Fonts
> - Priority badges: red for critical, amber for high, muted blue-grey for info
> - Phase selector buttons should highlight with the phase's color
> - Smooth transitions and fade-in animations
> - Mobile-friendly — should work on a phone propped up next to the battlefield
> - Use only Tailwind core utility classes or inline styles (no Tailwind compiler available)
> - No localStorage — use React state only
>
> ### Rules knowledge to apply
>
> Apply your knowledge of Warhammer 40,000 10th Edition core rules to generate accurate reminders. Key things to include where relevant:
>
> - Assault weapons can shoot after Advancing
> - Heavy weapons get +1 to Hit if the unit Remained Stationary
> - Pistols can shoot in Engagement Range
> - Torrent weapons auto-hit
> - Melta X increases damage within half range
> - Lethal Hits: Critical Hit auto-wounds
> - Devastating Wounds: Critical Wound bypasses all saves, deals mortal wounds
> - Sustained Hits X: Critical Hit scores X additional hits
> - Anti-X Y+: Unmodified wound roll of Y+ is a Critical Wound vs keyword X
> - Fights First units and chargers fight in the Fights First step
> - Leader / Attached unit rules (wound allocation, toughness)
> - Deep Strike: set up 9"+ from enemies
> - Infiltrators: deploy anywhere 9"+ from enemy deployment zone and models
> - Scouts X": pre-game move of X"
> - Battle-shock: 2D6 vs Leadership for units below half strength
> - Deadly Demise: on destruction, 6 = mortal wounds to nearby units
>
> Interpret each unit's specific abilities and translate them into actionable phase-specific reminders. Don't just list abilities generically — tell the player WHAT TO DO and WHEN.
>
> ### Important
>
> - Parse the actual JSON values. Do not invent stats or abilities.
> - If a unit appears multiple times in the roster, note the quantity (e.g. "Fire Dragons (x2)")
> - Group reminders by relevance to the phase, not by unit
> - Critical priority = game-changing if forgotten. High = strong tactical play. Info = general awareness.

---

## Your army roster JSON

Paste your New Recruit / BattleScribe JSON export below:

```json
PASTE YOUR JSON HERE
```
