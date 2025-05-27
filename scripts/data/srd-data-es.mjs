export async function registerSrdDataEs() {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  OSRCB.data.SRDClassData = {
    cleric: {
      name: 'cleric',
      menu: 'Clérigo',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: ['Acólito(a)', 'Adepto(a)', 'Sacerdote(isa)', 'Vicario(a)', 'Cura', 'Anciano(a)', 'Obispo(a)', 'Lama', 'Patriarca (Matriarca)'],
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
      req: 'Ninguno',
      primeReq: 'SAB',
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
      spellType: 'clérigo',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-es`,
      armorTypes: 'Cualquiera, incluyendo escudos',
      weaponTypes: 'Cualquier arma contundente',
      bio: `<b>Requisitos</b>: Ninguno<br>
      <b>Requisito principal</b>: SAB<br>
      <b>Dados de golpe</b>: 1d6<br>
      <b>Nivel máximo</b>: 14<br>
      <b>Armadura:</b>: Cualquiera, incluyendo escudos<br>
      <b>Armas:</b>: Cualquier arma contundente<br>
      <b>Idiomas:</b>: Alineamiento, común<br>`,
      description: `Los clérigos son aventureros que han jurado servir a una deidad. Están entrenados para la batalla y canalizan el poder de su deidad..
          <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.zvbpm2eYfnWWFglY]{Clérigo}<br>`,
      languages: ['Alineamiento', 'Común'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.zvbpm2eYfnWWFglY]{Clérigo}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    dwarf: {
      name: 'dwarf',
      menu: 'Enano',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: [
        'Veterano(a) enano(a)',
        'Guerrero(a) enano(a)',
        'Espadachín enano(a)',
        'Héroe(ina) enano(a)',
        'Maestro(a) del filo enano(a)',
        'Mirmidón enano(a)',
        'Campeón(a) enano(a)',
        'Señor(a) enano(a)'
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
      req: 'Mínimo CON 9',
      primeReq: 'FUE',
      spellCaster: false,
      armorTypes: 'Cualquiera, incluyendo escudos',
      weaponTypes: 'Pequeñas o de tamaño normal',
      bio: `<b>Requisitos</b>: Mínimo CON 9<br>
      <b>Requisito principal</b>: STR<br>
      <b>Dados de Golpe</b>: 1d8<br>
      <b>Nivel máximo</b>: 12<br>
      <b>Armadura:</b>: Any, including shields<br>
      <b>Armas:</b>: Small or normal sized<br>
      <b>Idiomas:</b>: Alineamiento, Común,<br>
      Enano, Gnomo, Goblin, Kobold<br>`,
      description: `Los enanos son semihumanos robustos y con largas barbas, de unos 4 pies de altura y 150 libras de peso. Suelen vivir bajo tierra y aman la artesanía, el oro, una buena comida y las bebidas fuertes. Su piel, pelo y ojos suelen compartir un tono cobrizo. Los enanos son conocidos por su testarudez y practicidad. Son un pueblo estoico y poseen una fuerte resistencia a la magia, como se refleja en sus tiradas de salvación
          <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.dYIvX6i9noBpK4Ed]{Enano}<br>`,
      languages: ['Alineamiento', 'Común', 'Enano', 'Gnomo', 'Goblin', 'Kobold'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.dYIvX6i9noBpK4Ed]{Enano}<br>`,
      maxLvl: 12,
      classTables: '',
      nameType: 'dwarf'
    },
    elf: {
      name: 'elf',
      menu: 'Elfo',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: [
        'Médium/Veterano(a)',
        'Vidente/Guerrero(a)',
        'Conjurador(a)/Maestro(a) del filo',
        'Mago(a)/Héroe(ína)',
        'Encantador(a)/Espadachín',
        'Brujo(a)/Mirmidón',
        'Hechicero(a)/Campeón(a)',
        'Nigromante/Héroe(ína)',
        'Señor(a) elfo(a)'
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
      req: 'Mínimo INT 9',
      primeReq: 'INT y FUE',
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
      spellType: 'mago',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-es`,
      armorTypes: 'Cualquiera, incluyendo escudos',
      weaponTypes: 'Cualquiera',
      bio: `<b>Requisitos</b>: Mínimo INT 9<br>
      <b>Requisito principal</b>: INT y FUE<br>
      <b>Dados de Golpe:</b> 1d6<br>
      <b>Nivel máximo</b>: 10<br>
      <b>Armadura:</b>: Cualquiera, incluyendo escudos<br>
      <b>Armas:</b>: Cualquiera<br>
      <b>Idiomas:</b>: Alineamiento, Común, Élfico, Gnoll, Hobgoblin, Orco<br>`,
      description: `Los elfos son delgados semihumanos con orejas puntiagudas. Suelen pesar alrededor de 120 libras y miden unos 5 pies y medio. Resulta difícil encontrar un elfo en un asentamiento humano, ya que prefieren recluirse en sus bosques mágicos. Su maestría con la espada y la magia los convierte en peligrosos enemigos. Les fascinan los conjuros y los objetos mágicos bien fabricados y les encanta coleccionarlos.<br>
      <b>Requisitos principales</b>: Un elfo con al menos INT y FUE 13 gana una bonificación de 5% a sus PX. Un elfo con al menos INT 16 y FUE 13 recibe una bonificación de +10% a sus PX.
      <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.UsY41anXwoh8JbTD]{Elfo}<br>`,
      languages: ['Alineamiento', 'Común', 'Élfico', 'Gnoll', 'Hobgoblin', 'Orco'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.UsY41anXwoh8JbTD]{Elfo}<br>`,
      maxLvl: 10,
      classTables: '',
      nameType: 'elf'
    },
    fighter: {
      name: 'fighter',
      menu: 'Guerrero',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: [
        'Veterano(a)',
        'Guerrero(a)',
        'Maestro(a) del filo',
        'Héroe(ina)',
        'Espadachín',
        'Mirmidón',
        'Campeón(a)',
        'Señor (Señora)'
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
      req: 'Ninguno',
      primeReq: 'FUE',
      spellCaster: false,
      armorTypes: 'Cualquiera, incluyendo escudos',
      weaponTypes: 'Cualquiera',
      bio: `<b>Requisitos</b>: Ninguno<br>
      <b>Requisito principal</b>: FUE<br>
      <b>Dados de golpe</b>: 1d8<br>
      <b>Nivel máximo</b>: 14<br>
      <b>Armadura</b>: Cualquiera, incluyendo escudos<br>
      <b>Armas</b>: Cualquiera<br>
      <b>Idiiomas</b>: Alineamiento, Común<br>`,
      description: `Los guerreros son aventureros dedicados a dominar las artes del combate y la guerra. En un grupo de aventureros, el papel del guerrero es combatir a los monstruos y defender a sus compañeros.
          <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.hhPzWrNMmig1wcSA]{Guerrero}<br>`,
      languages: ['Alineamiento', 'Común'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.hhPzWrNMmig1wcSA]{Guerrero}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    halfling: {
      name: 'halfling',
      menu: 'Mediano',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: [
        'Veterano(a) mediano(a)',
        'Guerrero(a) mediano(a)',
        'Maestro(a) del filo mediano(a)',
        'Héroe(ina) mediano(a)',
        'Espadachín mediano(a)',
        'Mirmidón mediano(a)',
        'Campeón(a) mediano(a)',
        'Sheriff'
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
      req: 'DES, FUE | CON 9, DES 9',
      primeReq: 'DES and FUE',
      spellCaster: false,
      armorTypes: 'Cualquiera de su tamaño, incluyendo escudos',
      weaponTypes: 'Cualquiera de su tamaño',
      bio: `<b>Requisitos</b>: Mínimo CON 9, mínimo DES 9<br>
      <b>Requisito principal</b>: DES y FUE<br>
      <b>Dados de golpe</b>: 1d6<br>
      <b>Nivel máximo</b>: 8<br>
      <b>Armadura</b>: Cualquiera de su tamaño, incluyendo escudos<br>
      <b>Armas</b>: Cualquiera de su tamaño<br>
      <b>Idiomas</b>: Alineamiento, Común, Mediano<br>`,
      description: `Los medianos son pequeños y rechonchos semihumanos de pies peludos y pelo rizado. Suelen pesar alrededor de 60 libras y miden unos 3 pies. Los medianos son un pueblo amigable y acogedor y, sobre todo, aman las comodidades del hogar; por lo que emplearán sus riquezas en la búsqueda de una vida tranquila y cómoda. <br>
        <b>Requisitos principales</b>: Un mediano con al menos 13 puntos en un requisito principal gana una bonificación de 5% a sus PX. Si tanto su DES como FUE tienen 13 puntos o más, un mediano gana un bono de +10% de PX.
        <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.c8b3WK5xRuf0IUO1]{Mediano}<br>`,
      languages: ['Alineamiento', 'Común', 'Mediano'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.c8b3WK5xRuf0IUO1]{Mediano}<br>`,
      maxLvl: 8,
      classTables: '',
      nameType: 'mediano'
    },
    'magic-user': {
      name: 'magic-user',
      menu: 'Mago',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: [
        'Médium',
        'Vidente',
        'Conjurador(a)',
        'Mago(a)',
        'Encantador(a)',
        'Brujo(a)',
        'Hechicero(a)',
        'Nigromante',
        'Gran Mago(a)'
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
      req: 'ninguno',
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
      spellType: 'mago',
      spellPackName: `${OSRCB.moduleName}.osr-srd-spells-es`,
      armorTypes: 'Ninguno',
      weaponTypes: 'Daga, bastón (opcional)',
      bio: `<b>Requisitos</b>: Ninguno<br>
      <b>Requisito principal</b>: INT<br>
      <b>Dados de golpe</b>: 1d4<br>
      <b>Nivel máximo</b>: 14<br>
      <b>Armadura</b>: Ninguna<br>
      <b>Armas</b>: Daga, bastón (opcional)<br>
      <b>Idiomas</b>: Alineamiento, Común<br>`,
      description: `Los magos son aventureros cuyo estudio de los secretos arcanos les ha enseñado a lanzar hechizos. Estos personajes son capaces de lanzar una gran cantidad de poderosos hechizos a medida que avanzan de nivel.
          <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.GPCuAn5z6epeQg41]{Mago}<br>`,
      languages: ['Alineamiento', 'Común'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.GPCuAn5z6epeQg41]{Mago}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    },
    thief: {
      name: 'thief',
      menu: 'Ladrón',
      pack: 'osr-character-builder.osr-srd-class-options-es',
      title: ['Aprendiz', 'Carterista', 'Saqueador(a)', 'Cortabolsas', 'Ladrón(a)', 'Maestro(a) Ladrón(a)'],
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
      req: 'Ninguno',
      primeReq: 'DES',
      spellCaster: false,
      armorTypes: 'Cuero, no puede usar escudos',
      weaponTypes: 'Cualquiera',
      bio: `<b>Requisitos</b>: Ninguno<br>
      <b>Requisito principal</b>: DES<br>
      <b>Dados de golpe</b>: 1d4<br>
      <b>Nivel máximo</b>: 14<br>
      <b>Armadura</b>: Cuero, no puede usar escudos<br>
      <b>Weapons</b>: Cualquiera<br>
      <b>Languages</b>: Alineamiento, Común<br>`,
      description: `Los ladrones son aventureros que viven de sus habilidades de engaño y sigilo. Sus peculiares habilidades los convierte en compañeros de aventuras muy útiles en muchas ocasiones. Sin embargo, no siempre se puede confiar en su lealtad.
      Ajustar características: En el tercer paso durante la creación de personajes, los ladrones no pueden reducir su FUE.
      <br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.aPzYP5zD1ueiIv4c]{Ladrón}<br>`,
      languages: ['Alineamiento', 'Común'],
      journal: `<br><br><b>Entrada de diario</b>: @UUID[Compendium.osr-character-builder.osr-srd-classes-es.JournalEntry.aPzYP5zD1ueiIv4c]{Ladrón}<br>`,
      maxLvl: 14,
      classTables: '',
      nameType: 'human'
    }
  };
  OSRCB.gpObj = {
    name: 'MO',
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
        `Curar heridas leves`,
        `Causar heridas leves`,
        `Detectar magia`,
        `Detectar el mal`,
        `Luz`,
        `Oscuridad`,
        `Protección contra el mal`,
        `Purificar agua y comida`,
        `Quitar el miedo`,
        `Causar miedo`,
        `Resistir frío`
      ],
      2: [
        `Bendición`,
        `Infortunio`,
        `Conocer alineamiento`,
        `Encantar serpiente`,
        `Encontrar trampas`,
        `Hablar con los animales`,
        `Resistir fuego`,
        `Retener persona`,
        `Silencio en un radio de 15’`
      ],
      3: [
        `Crecimiento animal`,
        `Curar enfermedad`,
        `Causar enfermedad`,
        `Encontrar objeto`,
        `Extirpar maldición`,
        `Maldecir`,
        `Golpear`,
        `Luz continua`,
        `Oscuridad continua`
      ],
      4: [
        `Conjurar agua`,
        `Curar heridas graves`,
        `Causar heridas graves`,
        `Hablar con las plantas`,
        `Neutralizar veneno`,
        `Palos a serpientes`,
        `Protección contra el mal en un radio de 10’`
      ],
      5: [
        `Alzar a los muertos`,
        `Rayo de la muerte`,
        `Comulgar`,
        `Conjurar comida`,
        `Disipar el mal`,
        `Misión`,
        `Abandonar misión`,
        `Plaga de insectos`
      ]
    },
    'magic-user': {
      1: [
        `Detectar magia`,
        `Disco flotante`,
        `Dormir`,
        `Encantar persona`,
        `Escudo`,
        `Leer idiomas`,
        `Leer magia`,
        `Luz`,
        `Oscuridad`,
        `Mantener portal`,
        `Protección contra el mal`,
        `Proyectil mágico`,
        `Ventriloquía`
      ],
      2: [
        `Abrir`,
        `Bloqueo mágico`,
        `Detectar el mal`,
        `Detectar lo invisible`,
        `Encontrar objeto`,
        `Fuerza fantasmal`,
        `Invisibilidad`,
        `Leer pensamientos`,
        `Levitar`,
        `Luz continua`,
        `Oscuridad continua`,
        `Reflejo`,
        `Telaraña`
      ],
      3: [
        `Bola de fuego`,
        `Celeridad`,
        `Clarividencia`,
        `Disipar magia`,
        `Infravisión`,
        `Invisibilidad en un radio de 10’`,
        `Protección contra el mal en un radio de 10’`,
        `Protección contra proyectiles normales`,
        `Relámpago`,
        `Respirar bajo el agua`,
        `Retener persona`,
        `Volar`
      ],
      4: [
        `Confusión`,
        `Crecimiento vegetal`,
        `Encantar monstruos`,
        `Extirpar maldición`,
        `Maldecir`,
        `Masamorfismo`,
        `Muro de fuego`,
        `Muro de hielo`,
        `Ojo de mago`,
        `Polimorfizar a otro`,
        `Polimorfizarse a sí mismo`,
        `Puerta dimensional`,
        `Terreno alucinatorio`
      ],
      5: [
        `Alzar a los muertos`,
        `Atravesar pared`,
        `Conjurar elemental`,
        `Contactar plano superior`,
        `Imbecilidad`,
        `Muro de piedra`,
        `Nube letal`,
        `Receptáculo mágico`,
        `Retener monstruo`,
        `Telequinesis`,
        `Teletransporte`,
        `Transmutar roca en lodo`,
        `Transmutar lodo en roca`
      ],
      6: [
        `Abrir las aguas`,
        `Acechador invisible`,
        `Calmar las aguas`,
        `Concha antimágica`,
        `Conjuro de muerte`,
        `Controlar el clima`,
        `Desintegrar`,
        `Geas`,
        `Extirpar geas`,
        `Mover la tierra`,
        `Piedra a carne`,
        `Carne a piedra`,
        `Proyectar imagen`,
        `Reencarnación`
      ]
    }
  };
  OSRCB.data.retainerGear = {
    cleric: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Garrote', 'Maza', 'Martillo de guerra']
    },
    dwarf: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza']
    },
    elf: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    fighter: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    halfling: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza']
    },
    'magic-user': {
      armor: [],
      weapons: ['Daga', 'Bastón']
    },
    thief: {
      armor: ['Cuero'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Arco largo', 'Arco corto']
    },
    acrobat: {
      armor: ['Cuero'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Arco largo', 'Arco corto', 'Honda']
    },
    assassin: {
      armor: ['Cuero'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Arco largo', 'Arco corto']
    },
    barbarian: {
      armor: ['Cuero', 'Cota de malla'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    bard: {
      armor: ['Cuero', 'Cota de malla'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Arco largo', 'Arco corto']
    },
    drow: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    druid: {
      armor: ['Cuero'],
      weapons: ['Garrote', 'Daga', 'Honda', 'Bastón']
    },
    duergar: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    gnome: {
      armor: ['Cuero'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    'half-elf': {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    'half-orc': {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    illusionist: {
      armor: [],
      weapons: ['Daga', 'Bastón']
    },
    knight: {
      armor: ['Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos']
    },
    paladin: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    ranger: {
      armor: ['Cuero', 'Cota de malla'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    },
    svirfneblin: {
      armor: ['Cuero', 'Cota de malla', 'Cota de placas'],
      weapons: ['Espada', 'Daga', 'Hacha de mano', 'Maza', 'Espada a dos manos', 'Arco largo', 'Arco corto']
    }
  };
  await sleep(50);
  OSRCB.spells.mergedList = foundry.utils.mergeObject(OSRCB.spells.spellList, OSRCB.spells.mergedList);
}






