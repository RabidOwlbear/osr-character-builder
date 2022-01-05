const SRDClassData = {
  cleric: {
    name: 'cleric',
    menu: 'Cleric',
    title: 'Acolyte',
    hd: 6,
    saves: [11, 12, 14, 16, 15],
    xp: 1500,
    req: 'WIS',
    spellCaster: true,
    description: `<b>Requirements</b>: None<br>
    <b>Prime requisite</b>: WIS<br>
    <b>Hit Dice</b>: 1d6<br>
    <b>Maximum level</b>: 14<br>
    <b>Armour</b>: Any, including shields<br>
    <b>Weapons</b>: Any blunt weapons<br>
    <b>Languages</b>: Alignment, Common<br>`,
    notes:
      'Clerics are adventurers who have sworn to serve a deity. They are trained for battle and channel the power of their deity.',
    languages: ['Alignment', 'Common'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.MxTAGtazZxJfvF7M]{Cleric}<br>`
  },
  dwarf: {
    name: 'dwarf',
    menu: 'Dwarf',
    title: ' Dwarven Veteran',
    hd: 8,
    saves: [8, 9, 10, 13, 12],
    xp: 2200,
    req: 'STR | CON 9',
    spellCaster: false,
    description: `<b>Requirements</b>: Minimum CON 9<br>
    <b>Prime requisite</b>: STR<br>
    <b>Hit Dice</b>: 1d8<br>
    <b>Maximum level</b>: 12<br>
    <b>Armour</b>: Any, including shields<br>
    <b>Weapons</b>: Small or normal sized<br>
    <b>Languages</b>: Alignment, Common,<br>
    Dwarvish, Gnomish, Goblin, Kobold<br>`,
    notes:
      'Dwarves are stout, bearded demihumans, about 4’ tall and weighing about 150 pounds. Dwarves typically live underground and love fine craftsmanship, gold, hearty food, and strong drink. They have skin, hair, and eye colours in earth tones. Dwarves are known for their stubbornness and practicality. They are a hardy people and have a strong resistance to magic, as reflected in their saving throws.',
    languages: ['Alignment', 'Common', 'Dwarvish', 'Gnomish', 'Goblin', 'Kobold'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.8FaYQ5BwGMxlWJA7]{Dwarf}<br>`
  },
  elf: {
    name: 'elf',
    menu: 'Elf',
    title: 'Medium/Veteran',
    hd: 6,
    saves: [12, 13, 13, 15, 15],
    xp: 4000,
    req: 'INT, STR | INT 9',
    spellCaster: true,
    spellSlot: 1,
    description: `<b>Requirements</b>: Minimum INT 9<br>
    <b>Prime requisite</b>: INT and STR<br>
    <b>Hit Dice:</b> 1d6<br>
    <b>Maximum level</b>: 10<br>
    <b>Armour</b>: Any, including shields<br>
    <b>Weapons</b>: Any<br>
    <b>Languages</b>: Alignment, Common, Elvish, Gnoll, Hobgoblin, Orcish<br>`,
    notes: `Elves are slender, fey demihumans with pointed ears. They typically weigh about 120 pounds and are between 5 and 5½ feet tall. Elves are seldom met in human settlements, preferring to feast and make merry in the woods. If crossed, they are dangerous enemies, as they are masters of both sword and spell. Elves are fascinated by spells and beautifully constructed magic items and love to collect both.<br>
    <b>Prime requisites</b>: An elf with at least 13 INT and STR gains a 5% bonus to experience. An elf with an INT of at least 16 and a STR of at least 13 receives a +10% XP bonus.`,
    languages: ['Alignment', 'Common', 'Elvish', 'Gnoll', 'Hobgoblin', 'Orcish'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.iH341o9KMs0jx96z]{Elf}<br>`
  },
  fighter: {
    name: 'fighter',
    menu: 'Fighter',
    title: 'Veteran',
    hd: 8,
    saves: [12, 13, 14, 15, 16],
    xp: 2000,
    req: 'STR',
    spellCaster: false,
    description: `<b>Requirements</b>: None<br>
    <b>Prime requisite</b>: STR<br>
    <b>Hit Dice</b>: 1d8<br>
    <b>Maximum level</b>: 14<br>
    <b>Armour</b>: Any, including shields<br>
    <b>Weapons</b>: Any<br>
    <b>Languages</b>: Alignment, Common<br>`,
    notes:
      'Fighters are adventurers dedicated to mastering the arts of combat and war. In a group of adventurers, the role of fighters is to battle monsters and to defend other characters.',
    languages: ['Alignment', 'Common'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.tuxYnX5oQOhSkHrp]{Fighter}<br>`
  },
  halfling: {
    name: 'halfling',
    menu: 'Halfling',
    title: 'Halfling Veteran',
    hd: 6,
    saves: [8, 9, 10, 13, 12],
    xp: 2000,
    req: 'DEX, STR | CON 9, DEX 9',
    spellCaster: false,
    description: `<b>Requirements</b>: Minimum CON 9, minimum DEX 9<br>
    <b>Prime requisite</b>: DEX and STR<br>
    <b>Hit Dice</b>: 1d6<br>
    <b>Maximum</b> level: 8<br>
    <b>Armour</b>: Any appropriate to size, including shields<br>
    <b>Weapons</b>: Any appropriate to size<br>
    <b>Languages</b>: Alignment, Common, Halfling<br>`,
    notes: `Halflings are small, rotund demihumans with furry feet and curly hair. They weigh about 60 pounds and are around 3’ tall. Halflings are a friendly and welcoming folk. Above all, they love the comforts of home and are not known for their bravery. Halflings who gain treasure through adventuring will often use their wealth in pursuit of a quiet, comfortable life. <br>
      <b>Prime requisites</b>: A halfling with at least 13 in one prime requisite gains a 5% bonus to experience. If both DEX and STR are 13 or higher, the halfling gets a +10% bonus.`,
    languages: ['Alignment', 'Common', 'Halfling'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.56pppv5spL3hnIbc]{Halfling}<br>`
  },
  'magic-user': {
    name: 'magic-user',
    menu: 'Magic User',
    title: 'Medium',
    hd: 4,
    saves: [13, 14, 13, 16, 15],
    xp: 2500,
    req: 'INT',
    spellCaster: true,
    spellSlot: 1,
    description: `<b>Requirements</b>: None<br>
    <b>Prime requisite</b>: INT<br>
    <b>Hit Dice</b>: 1d4<br>
    <b>Maximum level</b>: 14<br>
    <b>Armour</b>: None<br>
    <b>Weapons</b>: Dagger, staff (optional)<br>
    <b>Languages</b>: Alignment, Common<br>`,
    notes:
      'Magic-users are adventurers whose study of arcane secrets has taught them how to cast spells. Magic-users are able to cast a greater number of increasingly powerful spells as they advance in level.',
    languages: ['Alignment', 'Common'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.8xWQ2MGa2LPMA43Z]{Magic-User}<br>`
  },
  thief: {
    name: 'thief',
    menu: 'Thief',
    title: 'Apprentice',
    hd: 4,
    saves: [13, 14, 13, 16, 15],
    xp: 1200,
    req: 'DEX',
    spellCaster: false,
    description: `<b>Requirements</b>: None<br>
    <b>Prime requisite</b>: DEX<br>
    <b>Hit Dice</b>: 1d4<br>
    <b>Maximum level</b>: 14<br>
    <b>Armour</b>: Leather, no shields<br>
    <b>Weapons</b>: Any<br>
    <b>Languages</b>: Alignment, Common<br>`,
    notes: `Thieves are adventurers who live by their skills of deception and stealth. Their range of unique skills makes them very handy companions in adventures. However, thieves are not always to be trusted.
    Adjust ability scores: In step 3 of character creation, thieves may not lower STR.`,
    languages: ['Alignment', 'Common'],
    journal: `<br><br><b>Journal Entry</b>: @Compendium[OSE-CharacterBuilder.OSE-SRD-classes.aTfwtSoLj0EYkOR7]{Thief}<br>`
  }
};
const gpObj = {
  name: 'GP',
  type: 'item',
  img: '/systems/ose/assets/gold.png',
  data: {
    description: '',
    quantity: {
      value: 0,
      max: 0
    },
    treasure: true,
    cost: 1,
    weight: 1,
    containerId: '',
    isContainer: false
  },
  effects: [],
  folder: null,
  sort: 0,
  permission: {
    default: 0
  },
  flags: {}
};
