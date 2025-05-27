export async function registerSrdDataEn() {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  OSRCB.data.SRDClassData = {
    cleric: {
      name: 'cleric',
      menu: 'Cleric',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: ['Acolyte', 'Adept', 'Priest(ess)', 'Vicar', 'Curate', 'Elder', 'Bishop', 'Lama', 'Patriarch (Matriarch)'],
      hdArr: [
        '1d6',
        '2d6',
        '3d6',
        '4d6',
        '5d6',
        '6d6',
        '7d6',
        '8d6',
        '9d6',
        '9d6+1',
        '9d6+2',
        '9d6+3',
        '9d6+4',
        '9d6+5'
      ],
      hd: 6,
      hdMod: [1, 2, 3, 4, 5],
      saves: {
        13: [3, 5, 7, 8, 7],
        9: [6, 7, 9, 11, 9],
        5: [9, 10, 12, 14, 12],
        1: [11, 12, 14, 16, 15]
      },
      thac0: {
        // starting lvl: [thaco, bba]
        13: [12, 7],
        9: [14, 5],
        5: [17, 2],
        1: [19, 0]
      },
      xp: [1500, 3000, 6000, 12000, 25000, 50000, 100000, 200000, 300000, 400000, 500000, 600000, 700000],
      req: 'none',
      primeReq: 'WIS',
      spellCaster: true,
      spellSlot: {
        1: { 1: { max: 0 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        2: { 1: { max: 1 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        3: { 1: { max: 2 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        4: { 1: { max: 2 }, 2: { max: 1 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        5: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        6: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 1 }, 4: { max: 1 }, 5: { max: 0 }, 6: { max: 0 } },
        7: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 2 }, 4: { max: 1 }, 5: { max: 1 }, 6: { max: 0 } },
        8: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 2 }, 4: { max: 2 }, 5: { max: 1 }, 6: { max: 0 } },
        9: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 3 }, 4: { max: 2 }, 5: { max: 2 }, 6: { max: 0 } },
        10: { 1: { max: 4 }, 2: { max: 4 }, 3: { max: 3 }, 4: { max: 3 }, 5: { max: 2 }, 6: { max: 0 } },
        11: { 1: { max: 4 }, 2: { max: 4 }, 3: { max: 4 }, 4: { max: 3 }, 5: { max: 3 }, 6: { max: 0 } },
        12: { 1: { max: 5 }, 2: { max: 5 }, 3: { max: 4 }, 4: { max: 4 }, 5: { max: 3 }, 6: { max: 0 } },
        13: { 1: { max: 5 }, 2: { max: 5 }, 3: { max: 5 }, 4: { max: 4 }, 5: { max: 4 }, 6: { max: 0 } },
        14: { 1: { max: 6 }, 2: { max: 5 }, 3: { max: 5 }, 4: { max: 5 }, 5: { max: 4 }, 6: { max: 0 } }
      },
      spellType: 'cleric',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-${game.i18n.lang}`,
      armorTypes: 'Any, including shields',
      weaponTypes: 'Any blunt weapons',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: WIS<br>
      <b>Hit Dice</b>: 1d6<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Any blunt weapons<br>
      <b>Languages</b>: Alignment, Common<br>`,
      description: `Clerics are adventurers who have sworn to serve a deity. They are trained for battle and channel the power of their deity.
          <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.MxTAGtazZxJfvF7M]{Cleric}<br>`,
      languages: ['Alignment', 'Common'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.MxTAGtazZxJfvF7M]{Cleric}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    dwarf: {
      name: 'dwarf',
      menu: 'Dwarf',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: [
        'Dwarven Veteran',
        'Dwarven Warrior',
        'Dwarven Swordmaster',
        'Dwarven Hero',
        'Dwarven Swashbuckler',
        'Dwarven Myrmidon',
        'Dwarven Champion',
        'Dwarven Superhero',
        'Dwarven Lord (Lady)'
      ],
      hdArr: ['1d8', '2d8', '3d8', '4d8', '5d8', '6d8', '7d8', '8d8', '9d8', '9d8+3', '9d8+6', '9d8+9'],
      hd: 8,
      hdMod: [3, 6, 9],
      saves: {
        10: [2, 3, 4, 4, 6],
        7: [4, 5, 6, 7, 8],
        4: [6, 7, 8, 10, 10],
        1: [8, 9, 10, 13, 12]
      },
      thac0: {
        10: [12, 7],
        7: [14, 5],
        4: [17, 2],
        1: [19, 0]
      },
      xp: [2200, 4400, 8800, 17000, 35000, 70000, 140000, 270000, 400000, 530000, 660000],
      req: 'Minimum CON 9',
      primeReq: 'STR',
      spellCaster: false,
      armorTypes: 'Any, including shields',
      weaponTypes: 'Small or normal sized',
      bio: `<b>Requirements</b>: Minimum CON 9<br>
      <b>Prime requisite</b>: STR<br>
      <b>Hit Dice</b>: 1d8<br>
      <b>Maximum level</b>: 12<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Small or normal sized<br>
      <b>Languages</b>: Alignment, Common,<br>
      Dwarvish, Gnomish, Goblin, Kobold<br>`,
      description: `Dwarves are stout, bearded demihumans, about 4’ tall and weighing about 150 pounds. Dwarves typically live underground and love fine craftsmanship, gold, hearty food, and strong drink. They have skin, hair, and eye colours in earth tones. Dwarves are known for their stubbornness and practicality. They are a hardy people and have a strong resistance to magic, as reflected in their saving throws.
          <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.8FaYQ5BwGMxlWJA7]{Dwarf}<br>`,
      languages: ['Alignment', 'Common', 'Dwarvish', 'Gnomish', 'Goblin', 'Kobold'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.8FaYQ5BwGMxlWJA7]{Dwarf}<br>`,
      maxLvl: 12,
      classTables: '',
      nameType: 'dwarf'
    },
    elf: {
      name: 'elf',
      menu: 'Elf',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: [
        'Medium/Veteran',
        'Seer/Warrior',
        'Conjurer/Swordmaster',
        'Magician/Hero',
        'Enchanter (Enchantress)/Swashbuckler',
        'Warlock (Witch)/Myrmidon',
        'Sorcerer (Sorceress)/Champion',
        'Necromancer/ Superhero',
        'Wizard/Lord (Lady)'
      ],
      hdArr: ['1d6', '2d6', '3d6', '4d6', '5d6', '6d6', '7d6', '8d6', '9d6', '9d6+2'],
      hd: 6,
      hdMod: [2],
      saves: {
        10: [6, 7, 8, 8, 8],
        7: [8, 9, 9, 10, 10],
        4: [10, 11, 11, 13, 12],
        1: [12, 13, 13, 15, 15]
      },
      thac0: {
        10: [12, 7],
        7: [14, 5],
        4: [17, 2],
        1: [19, 0]
      },
      xp: [4000, 8000, 16000, 32000, 65000, 120000, 250000, 400000, 600000],
      req: 'Minimum INT 9',
      primeReq: 'INT and STR',
      spellCaster: true,
      spellSlot: {
        1: { 1: { max: 1 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        2: { 1: { max: 2 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        3: { 1: { max: 2 }, 2: { max: 1 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        4: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        5: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 1 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        6: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 2 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        7: { 1: { max: 3 }, 2: { max: 2 }, 3: { max: 2 }, 4: { max: 1 }, 5: { max: 0 }, 6: { max: 0 } },
        8: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 2 }, 4: { max: 2 }, 5: { max: 0 }, 6: { max: 0 } },
        9: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 3 }, 4: { max: 2 }, 5: { max: 1 }, 6: { max: 0 } },
        10: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 3 }, 4: { max: 3 }, 5: { max: 2 }, 6: { max: 0 } }
      },
      spellType: 'magic-user',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-${game.i18n.lang}`,
      armorTypes: 'Any, including shields',
      weaponTypes: 'Any',
      bio: `<b>Requirements</b>: Minimum INT 9<br>
      <b>Prime requisite</b>: INT and STR<br>
      <b>Hit Dice:</b> 1d6<br>
      <b>Maximum level</b>: 10<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Any<br>
      <b>Languages</b>: Alignment, Common, Elvish, Gnoll, Hobgoblin, Orcish<br>`,
      description: `Elves are slender, fey demihumans with pointed ears. They typically weigh about 120 pounds and are between 5 and 5½ feet tall. Elves are seldom met in human settlements, preferring to feast and make merry in the woods. If crossed, they are dangerous enemies, as they are masters of both sword and spell. Elves are fascinated by spells and beautifully constructed magic items and love to collect both.<br>
      <b>Prime requisites</b>: An elf with at least 13 INT and STR gains a 5% bonus to experience. An elf with an INT of at least 16 and a STR of at least 13 receives a +10% XP bonus.
      <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.iH341o9KMs0jx96z]{Elf}<br>`,
      languages: ['Alignment', 'Common', 'Elvish', 'Gnoll', 'Hobgoblin', 'Orcish'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.iH341o9KMs0jx96z]{Elf}<br>`,
      maxLvl: 10,
      classTables: '',
      nameType: 'elf'
    },
    fighter: {
      name: 'fighter',
      menu: 'Fighter',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: [
        'Veteran',
        'Warrior',
        'Sword-master',
        'Hero',
        'Swashbuckler',
        'Myrmidon',
        'Champion',
        'Superhero',
        'Lord (Lady)'
      ],
      hdArr: [
        '1d8',
        '2d8',
        '3d8',
        '4d8',
        '5d8',
        '6d8',
        '7d8',
        '8d8',
        '9d8',
        '9d8+2',
        '9d8+4',
        '9d8+6',
        '9d8+8',
        '9d8+10'
      ],
      hd: 8,
      hdMod: [2, 4, 6, 8, 10],
      saves: {
        13: [4, 5, 6, 5, 8],
        10: [6, 7, 8, 8, 10],
        7: [8, 9, 10, 10, 12],
        4: [10, 11, 12, 13, 14],
        1: [12, 13, 14, 15, 16]
      },
      thac0: {
        13: [10, 9],
        10: [12, 7],
        7: [14, 5],
        4: [17, 2],
        1: [19, 0]
      },
      xp: [2000, 4000, 8000, 16000, 32000, 64000, 120000, 240000, 360000, 480000, 600000, 720000, 840000],
      req: 'none',
      primeReq: 'STR',
      spellCaster: false,
      armorTypes: 'Any, including shields',
      weaponTypes: 'Any',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: STR<br>
      <b>Hit Dice</b>: 1d8<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Any<br>
      <b>Languages</b>: Alignment, Common<br>`,
      description: `Fighters are adventurers dedicated to mastering the arts of combat and war. In a group of adventurers, the role of fighters is to battle monsters and to defend other characters.
          <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.tuxYnX5oQOhSkHrp]{Fighter}<br>`,
      languages: ['Alignment', 'Common'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.tuxYnX5oQOhSkHrp]{Fighter}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    halfling: {
      name: 'halfling',
      menu: 'Halfling',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: [
        'Halfling Veteran',
        'Halfling Warrior',
        'Halfling Swordmaster',
        'Halfling Hero',
        'Halfling Swashbuckler',
        'Halfling Myrmidon',
        'Halfling Champion',
        'Sherif'
      ],
      hdArr: ['1d6', '2d6', '3d6', '4d6', '5d6', '6d6', '7d6', '8d6'],
      hd: 6,
      hdMod: [],
      saves: {
        7: [4, 5, 6, 7, 8],
        4: [6, 7, 8, 10, 10],
        1: [8, 9, 10, 13, 12]
      },
      thac0: {
        7: [14, 5],
        4: [17, 2],
        1: [19, 0]
      },
      xp: [2000, 4000, 8000, 16000, 32000, 64000, 120000],
      req: 'DEX, STR | CON 9, DEX 9',
      primeReq: 'DEX and STR',
      spellCaster: false,
      armorTypes: 'Any appropriate to size, including shields',
      weaponTypes: 'Any appropriate to size',
      bio: `<b>Requirements</b>: Minimum CON 9, minimum DEX 9<br>
      <b>Prime requisite</b>: DEX and STR<br>
      <b>Hit Dice</b>: 1d6<br>
      <b>Maximum</b> level: 8<br>
      <b>Armour</b>: Any appropriate to size, including shields<br>
      <b>Weapons</b>: Any appropriate to size<br>
      <b>Languages</b>: Alignment, Common, Halfling<br>`,
      description: `Halflings are small, rotund demihumans with furry feet and curly hair. They weigh about 60 pounds and are around 3’ tall. Halflings are a friendly and welcoming folk. Above all, they love the comforts of home and are not known for their bravery. Halflings who gain treasure through adventuring will often use their wealth in pursuit of a quiet, comfortable life. <br>
        <b>Prime requisites</b>: A halfling with at least 13 in one prime requisite gains a 5% bonus to experience. If both DEX and STR are 13 or higher, the halfling gets a +10% bonus.
        <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.56pppv5spL3hnIbc]{Halfling}<br>`,
      languages: ['Alignment', 'Common', 'Halfling'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.56pppv5spL3hnIbc]{Halfling}<br>`,
      maxLvl: 8,
      classTables: '',
      nameType: 'halfling'
    },
    'magic-user': {
      name: 'magic-user',
      menu: 'Magic User',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: [
        'Medium',
        'Seer',
        'Conjurer',
        'Magician',
        'Enchanter (Enchantress)',
        'Warlock (Witch)',
        'Sorcerer (Sorceress)',
        'Necromancer',
        'Wizard'
      ],
      hdArr: [
        '1d4',
        '2d4',
        '3d4',
        '4d4',
        '5d4',
        '6d4',
        '7d4',
        '8d4',
        '9d4',
        '9d4+1',
        '9d4+2',
        '9d4+3',
        '9d4+4',
        '9d4+5'
      ],
      hd: 4,
      hdMod: [1, 2, 3, 4, 5],
      saves: {
        11: [8, 9, 8, 11, 8],
        6: [11, 12, 11, 14, 12],
        1: [13, 14, 13, 16, 15]
      },
      thac0: {
        11: [14, 5],
        6: [17, 2],
        1: [19, 0]
      },
      xp: [2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000, 750000, 900000, 1050000],
      req: 'none',
      primeReq: 'INT',
      spellCaster: true,
      spellSlot: {
        1: { 1: { max: 1 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        2: { 1: { max: 2 }, 2: { max: 0 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        3: { 1: { max: 2 }, 2: { max: 1 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        4: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 0 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        5: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 1 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        6: { 1: { max: 2 }, 2: { max: 2 }, 3: { max: 2 }, 4: { max: 0 }, 5: { max: 0 }, 6: { max: 0 } },
        7: { 1: { max: 3 }, 2: { max: 2 }, 3: { max: 2 }, 4: { max: 1 }, 5: { max: 0 }, 6: { max: 0 } },
        8: { 1: { max: 3 }, 2: { max: 2 }, 3: { max: 2 }, 4: { max: 2 }, 5: { max: 0 }, 6: { max: 0 } },
        9: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 3 }, 4: { max: 2 }, 5: { max: 1 }, 6: { max: 0 } },
        10: { 1: { max: 3 }, 2: { max: 3 }, 3: { max: 3 }, 4: { max: 3 }, 5: { max: 2 }, 6: { max: 0 } },
        11: { 1: { max: 4 }, 2: { max: 3 }, 3: { max: 3 }, 4: { max: 3 }, 5: { max: 2 }, 6: { max: 1 } },
        12: { 1: { max: 4 }, 2: { max: 4 }, 3: { max: 3 }, 4: { max: 3 }, 5: { max: 3 }, 6: { max: 2 } },
        13: { 1: { max: 4 }, 2: { max: 4 }, 3: { max: 4 }, 4: { max: 3 }, 5: { max: 3 }, 6: { max: 3 } },
        14: { 1: { max: 4 }, 2: { max: 4 }, 3: { max: 4 }, 4: { max: 4 }, 5: { max: 3 }, 6: { max: 3 } }
      },
      spellType: 'magic-user',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-${game.i18n.lang}`,
      armorTypes: 'None',
      weaponTypes: 'Dagger, staff (optional)',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: INT<br>
      <b>Hit Dice</b>: 1d4<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: None<br>
      <b>Weapons</b>: Dagger, staff (optional)<br>
      <b>Languages</b>: Alignment, Common<br>`,
      description: `Magic-users are adventurers whose study of arcane secrets has taught them how to cast spells. Magic-users are able to cast a greater number of increasingly powerful spells as they advance in level.
          <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.8xWQ2MGa2LPMA43Z]{Magic-User}<br>`,
      languages: ['Alignment', 'Common'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.8xWQ2MGa2LPMA43Z]{Magic-User}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    thief: {
      name: 'thief',
      menu: 'Thief',
      pack: 'osr-character-builder.osr-srd-class-options-en',
      title: ['Apprentice', 'Footpad', 'Robber', 'Burglar', 'Cutpurse', 'Sharper', 'Pilferer', 'Thief', 'Master Thief'],
      hdArr: [
        '1d4',
        '2d4',
        '3d4',
        '4d4',
        '5d4',
        '6d4',
        '7d4',
        '8d4',
        '9d4',
        '9d4+2',
        '9d4+4',
        '9d4+6',
        '9d4+8',
        '9d4+10'
      ],
      hd: 4,
      hdMod: [2, 4, 6, 8, 10],
      saves: {
        13: [8, 9, 7, 10, 8],
        9: [10, 11, 9, 12, 10],
        5: [12, 13, 11, 14, 13],
        1: [13, 14, 13, 16, 15]
      },
      thac0: {
        13: [12, 7],
        9: [14, 5],
        5: [17, 2],
        1: [19, 0]
      },
      xp: [1200, 2400, 4800, 9600, 20000, 40000, 80000, 160000, 280000, 400000, 520000, 640000, 760000],
      req: 'none',
      primeReq: 'DEX',
      spellCaster: false,
      armorTypes: 'Leather, no shields',
      weaponTypes: 'Any',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: DEX<br>
      <b>Hit Dice</b>: 1d4<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: Leather, no shields<br>
      <b>Weapons</b>: Any<br>
      <b>Languages</b>: Alignment, Common<br>`,
      description: `Thieves are adventurers who live by their skills of deception and stealth. Their range of unique skills makes them very handy companions in adventures. However, thieves are not always to be trusted.
      Adjust ability scores: In step 3 of character creation, thieves may not lower STR.
      <br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.aTfwtSoLj0EYkOR7]{Thief}<br>`,
      languages: ['Alignment', 'Common'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-en.JournalEntry.aTfwtSoLj0EYkOR7]{Thief}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    }
  };
  OSRCB.gpObj = {
    name: 'GP',
    type: 'item',
    img: '/systems/ose/assets/gold.png',
    data: {
      bio: '',
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
  OSRCB.spells.spellList = {
    cleric: {
      1: [
        `Cure Light Wounds`,
        `Cause Light Wounds`,
        `Detect Evil`,
        `Detect Magic`,
        `Light`,
        `Darkness`,
        `Protection from Evil`,
        `Purify Food and Water`,
        `Remove Fear`,
        `Cause Fear`,
        `Resist Cold`
      ],
      2: [
        `Bless`,
        `Blight`,
        `Find Traps`,
        `Hold Person`,
        `Know Alignment`,
        `Resist Fire`,
        `Silence 15’ Radius`,
        `Snake Charm`,
        `Speak with Animals`
      ],
      3: [
        `Continual Light`,
        `Continual Darkness`,
        `Cure Disease`,
        `Cause Disease`,
        `Growth of Animal`,
        `Locate Object`,
        `Remove Curse`,
        `Curse`,
        `Striking`
      ],
      4: [
        `Create Water`,
        `Cure Serious Wounds`,
        `Cause Serious Wounds`,
        `Neutralize Poison`,
        `Protection from Evil 10’ Radius`,
        `Speak with Plants`,
        `Sticks to Snakes`
      ],
      5: [
        `Commune`,
        `Create Food`,
        `Dispel Evil`,
        `Insect Plague`,
        `Quest`,
        `Remove Quest`,
        `Raise Dead`,
        `Finger of Death`
      ]
    },
    'magic-user': {
      1: [
        `Charm Person`,
        `Detect Magic`,
        `Floating Disc`,
        `Hold Portal`,
        `Light`,
        `Darkness`,
        `Magic Missile`,
        `Protection from Evil`,
        `Read Languages`,
        `Read Magic`,
        `Shield`,
        `Sleep`,
        `Ventriloquism`
      ],
      2: [
        `Continual Light`,
        `Continual Darkness`,
        `Detect Evil`,
        `Detect Invisible`,
        `ESP`,
        `Invisibility`,
        `Knock`,
        `Levitate`,
        `Locate Object`,
        `Mirror Image`,
        `Phantasmal Force`,
        `Web`,
        `Wizard Lock`
      ],
      3: [
        `Clairvoyance`,
        `Dispel Magic`,
        `Fire Ball`,
        `Fly`,
        `Haste`,
        `Hold Person`,
        `Infravision`,
        `Invisibility 10’ Radius`,
        `Lightning Bolt`,
        `Protection from Evil 10’ Radius`,
        `Protection from Normal Missiles`,
        `Water Breathing`
      ],
      4: [
        `Charm Monster`,
        `Confusion`,
        `Dimension Door`,
        `Growth of Plants`,
        `Hallucinatory Terrain`,
        `Massmorph`,
        `Polymorph Others`,
        `Polymorph Self`,
        `Remove Curse`,
        `Curse`,
        `Wall of Fire`,
        `Wall of Ice`,
        `Wizard Eye`
      ],
      5: [
        `Animate Dead`,
        `Cloudkill`,
        `Conjure Elemental`,
        `Contact Higher Plane`,
        `Feeblemind`,
        `Hold Monster`,
        `Magic Jar`,
        `Pass-Wall`,
        `Telekinesis`,
        `Teleport`,
        `Transmute Rock to Mud`,
        `Transmute Mud to Rock`,
        `Wall of Stone`
      ],
      6: [
        `Anti-Magic Shell`,
        `Control Weather`,
        `Death Spell`,
        `Disintegrate`,
        `Geas`,
        `Remove Geas`,
        `Invisible Stalker`,
        `Lower Water`,
        `Move Earth`,
        `Part Water`,
        `Projected Image`,
        `Reincarnation`,
        `Stone to Flesh`,
        `Flesh to Stone`
      ]
    }
  };
  OSRCB.data.retainerGear = {
    cleric: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Club', 'Mace', 'Warhammer']
    },
    dwarf: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace']
    },
    elf: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    fighter: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    halfling: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace']
    },
    'magic-user': {
      armor: [],
      weapons: ['Dagger', 'Staff']
    },
    thief: {
      armor: ['Leather Armor'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Longbow', 'Shortbow']
    },
    acrobat: {
      armor: ['Leather Armor'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Longbow', 'Shortbow', 'Sling']
    },
    assassin: {
      armor: ['Leather Armor'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    barbarian: {
      armor: ['Leather Armor', 'Chain Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    bard: {
      armor: ['Leather Armor', 'Chain Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Longbow', 'Shortbow']
    },
    drow: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    druid: {
      armor: ['Leather Armor'],
      weapons: ['Club', 'Dagger', 'Sling', 'Staff']
    },
    duergar: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    gnome: {
      armor: ['Leather Armor'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    'half-elf': {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    'half-orc': {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    illusionist: {
      armor: [],
      weapons: ['Dagger', 'Staff']
    },
    knight: {
      armor: ['Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword']
    },
    paladin: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    ranger: {
      armor: ['Leather Armor', 'Chain Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    },
    svirfneblin: {
      armor: ['Leather Armor', 'Chain Mail', 'Plate Mail'],
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Two-handed Sword', 'Longbow', 'Shortbow']
    }
  };
  await sleep(50);
  OSRCB.spells.mergedList = foundry.utils.mergeObject(OSRCB.spells.spellList, OSRCB.spells.mergedList);
}
