export async function registerSrdDataCn() {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  OSRCB.data.SRDClassData = {
    cleric: {
      name: 'cleric',
      menu: '牧师',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: ['侍僧', '修士', '祭司（女祭司）', '代牧', '助理牧师', '长老', '主教', '喇嘛', '牧首（女牧首）'],
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
      req: '无',
      primeReq: '睿知',
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
      spellType: '牧师',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-${game.i18n.lang}`,
      armorTypes: '任意，包括盾牌',
      weaponTypes: '任意钝器',
      bio: `<b>Requirements</b>: 无<br>
      <b>Prime requisite</b>: 睿知<br>
      <b>Hit Dice</b>: 1d6<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: 任意，包括盾牌<br>
      <b>Weapons</b>: 任意钝器<br>
      <b>Languages</b>: 阵营语, 通用语<br>`,
      description: `牧师是立誓要服侍神明的冒险者。他们受过战斗训练，还能够引导其神祇的力量。
          <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.JmFSur5cdmf9lHxh]{牧师}<br>`,
      languages: ['阵营语', '通用语'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.JmFSur5cdmf9lHxh]{牧师}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    dwarf: {
      name: 'dwarf',
      menu: '矮人',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: [
        '矮人老兵',
        '矮人武士',
        '矮人剑师',
        '矮人英雄',
        '矮人浪客',
        '矮人侍卫',
        '矮人勇士',
        '矮人豪侠',
        '矮人领主（女领主）'
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
      req: '体质最低为 9',
      primeReq: '力量',
      spellCaster: false,
      armorTypes: '任意，包括盾牌',
      weaponTypes: '小型或中型',
      bio: `<b>Requirements</b>: Minimum CON 9<br>
      <b>Prime requisite</b>: STR<br>
      <b>Hit Dice</b>: 1d8<br>
      <b>Maximum level</b>: 12<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Small or normal sized<br>
      <b>Languages</b>: Alignment, Common,<br>
      Dwarvish, Gnomish, Goblin, Kobold<br>`,
      description: `矮人这些健壮长须的亚人身高约 4'，体重 150 磅左右。矮人通常深居地底，衷情于工艺、黄金、美食与烈酒。他们的皮肤、须发与瞳孔都有着大地的色彩。矮人以顽固与务实闻名。这些坚韧的族裔有着对魔法的强力抗性，其豁免也体现了这一点。
          <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.SyJMz80CgR0q4qCV]{矮人}<br>`,
      languages: ['阵营语', '通用语', '矮人语', '侏儒语', '地精语', '狗头人语'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.SyJMz80CgR0q4qCV]{Dwarf}<br>`,
      maxLvl: 12,
      classTables: '',
      nameType: 'dwarf'
    },
    elf: {
      name: 'elf',
      menu: '精灵',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: [
        '灵媒 / 老兵',
        '先知 / 武士',
        '咒术师 / 剑师',
        '魔法师 / 英雄',
        '附魔师（女附魔师）/ 浪客',
        '巫术师（女巫）/ 侍卫',
        '术士（女术士）/ 勇士',
        '死灵法师 / 豪侠',
        '法师 / 领主（女领主）'
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
      req: '智力最低为 9',
      primeReq: '智力与力量',
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
      spellType: '魔法师',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-${game.i18n.lang}`,
      armorTypes: '任意，包括盾牌',
      weaponTypes: '任意',
      bio: `<b>Requirements</b>: Minimum INT 9<br>
      <b>Prime requisite</b>: INT and STR<br>
      <b>Hit Dice:</b> 1d6<br>
      <b>Maximum level</b>: 10<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Any<br>
      <b>Languages</b>: Alignment, Common, Elvish, Gnoll, Hobgoblin, Orcish<br>`,
      description: `精灵是长着尖耳，身材纤细的妖精亚人。他们重约 120 磅，身高通常在 5 到 5.5 英尺之间。精灵在人类聚居点中相对少见，他们更喜欢在林间举办盛宴、寻欢作乐。如果爆发冲突，同样擅长刀剑与法术的精灵会成为危险的敌人。法术与精美的魔法物品都是精灵的心头之好，其热衷于收集这两样东西。<br>
      <b>主要属性</b>: 拥有至少 13 点智力与力量的精灵会获得 5% 的经验奖励。拥有至少 16 点智力与至少 13 点力量的精灵会获得 10% 的经验奖励。
      <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.rTwGxLzN0rvZiPlI]{精灵}<br>`,
      languages: ['阵营语', '通用语', '精灵语', '鬣狗人语', '大地精语', '兽人语'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.rTwGxLzN0rvZiPlI]{Elf}<br>`,
      maxLvl: 10,
      classTables: '',
      nameType: 'elf'
    },
    fighter: {
      name: 'fighter',
      menu: '战士',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: [
        '老兵',
        '武士',
        '剑师',
        '英雄',
        '浪客',
        '侍卫',
        '勇士',
        '豪侠',
        '领主（女领主）'
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
      req: '无',
      primeReq: '力量',
      spellCaster: false,
      armorTypes: '任意，包括盾牌',
      weaponTypes: '任意',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: STR<br>
      <b>Hit Dice</b>: 1d8<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: Any, including shields<br>
      <b>Weapons</b>: Any<br>
      <b>Languages</b>: 阵营语, 通用语<br>`,
      description: `战士是专精格斗与战争技艺的冒险者。在冒险团队之中，战士负责与怪物搏斗并保护其他角色。
          <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.q3DpdraizRb6lIRQ]{战士}<br>`,
      languages: ['阵营语', '通用语'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.q3DpdraizRb6lIRQ]{Fighter}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    halfling: {
      name: 'halfling',
      menu: '半身人',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: [
        '半身人老兵',
        '半身人武士',
        '半身人剑师',
        '半身人英雄',
        '半身人浪客',
        '半身人侍卫',
        '半身人勇士',
        '郡长'
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
      req: '体质最低为 9，敏捷最低为 9',
      primeReq: '敏捷与力量',
      spellCaster: false,
      armorTypes: '任意符合尺寸的护甲，包括盾牌',
      weaponTypes: '任意符合尺寸的武器',
      bio: `<b>Requirements</b>: Minimum CON 9, minimum DEX 9<br>
      <b>Prime requisite</b>: DEX and STR<br>
      <b>Hit Dice</b>: 1d6<br>
      <b>Maximum</b> level: 8<br>
      <b>Armour</b>: Any appropriate to size, including shields<br>
      <b>Weapons</b>: Any appropriate to size<br>
      <b>Languages</b>: Alignment, Common, Halfling<br>`,
      description: `半身人是个子矮小，身材圆胖的亚人种族，脚上长毛，头顶卷发，体重约 60 磅，通常有 3' 高。半身人天性友好热情。最重要的是，他们热爱家宅的舒适惬意，并且不以勇敢著称。在冒险中获得财宝的半身人通常会用这笔财富来追求平静而安逸的生活。 <br>
        <b>主要属性</b>: 一项主要属性到达 13 的半身人会获得 5% 的经验奖励。如果半身人的敏捷与力量都到达 13 或以上，则会获得 10% 的经验奖励。
        <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.6XOXusawNQA4QnfJ]{半身人}<br>`,
      languages: ['阵营语', '通用语', '半身人语'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.6XOXusawNQA4QnfJ]{Halfling}<br>`,
      maxLvl: 8,
      classTables: '',
      nameType: 'halfling'
    },
    'magic-user': {
      name: 'magic-user',
      menu: '魔法师',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: [
        '灵媒',
        '先知',
        '咒术师',
        '魔术师',
        '附魔师（女附魔师）',
        '巫术师（女巫）',
        '术士（女术士）',
        '死灵法师',
        '法师'
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
      req: '无',
      primeReq: '智力',
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
      spellType: '魔法师',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-${game.i18n.lang}`,
      armorTypes: '无',
      weaponTypes: '匕首, 杖 (可选)',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: INT<br>
      <b>Hit Dice</b>: 1d4<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: None<br>
      <b>Weapons</b>: Dagger, staff (optional)<br>
      <b>Languages</b>: Alignment, Common<br>`,
      description: `作为冒险者，魔法师对奥法秘密的研究使其学会了施放法术的方法。随着等级提升，魔法师能够施放数量更多、威力更强的法术。
          <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.1v23MW5ozxMcATSB]{魔法师}<br>`,
      languages: ['阵营语', '通用语'],
      journal: `<br><br><b>Journal Entry</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.1v23MW5ozxMcATSB]{Magic-User}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    thief: {
      name: 'thief',
      menu: '盗贼',
      pack: 'osr-character-builder.osr-srd-class-options-cn',
      title: ['盗徒', '拦路贼', '劫匪', '飞贼', '扒手', '欺诈师', '小偷', '盗贼', '神偷'],
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
      req: '无',
      primeReq: '敏捷',
      spellCaster: false,
      armorTypes: '皮甲，无盾牌',
      weaponTypes: '任意',
      bio: `<b>Requirements</b>: None<br>
      <b>Prime requisite</b>: DEX<br>
      <b>Hit Dice</b>: 1d4<br>
      <b>Maximum level</b>: 14<br>
      <b>Armour</b>: Leather, no shields<br>
      <b>Weapons</b>: Any<br>
      <b>Languages</b>: Alignment, Common<br>`,
      description: `盗贼是以欺诈与潜行技艺为生的冒险者。在冒险中，盗贼所掌握的诸般独门技能使之成为了优秀的搭档。然而，盗贼并不总是那么可靠。
      调整属性值: 在创建角色的第 3 步时，盗贼不能降低力量。
      <br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.93e4CJ6gqsbN2AX3]{盗贼}<br>`,
      languages: ['阵营语', '通用语'],
      journal: `<br><br><b>日志条目</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-cn.JournalEntry.93e4CJ6gqsbN2AX3]{盗贼}<br>`,
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
