export async function registerSrdData() {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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
      weapons: ['Sword', 'Dagger', 'Hand Axe', 'Mace', 'Longbow', 'Shortbow', 'sling']
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
