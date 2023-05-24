export function initializeUtils() {
  OSRCB.util.getClassOptionObj = function (classSource) {

    const optionObj = OSRCB.util.mergeClassOptions();
    let sourceObj = optionObj.find((s) => s.name.toLowerCase() === classSource.toLowerCase());
    return sourceObj;
    
  };
  OSRCB.util.mergeClassOptions = function () {
    let defaultClasses = game.settings.get('osr-character-builder', 'defaultClasses');
    let externalClasses = game.settings.get('osr-character-builder', 'externalClasses');
    let classOptions = defaultClasses.concat(externalClasses);
    let osrCCBActive = game.modules.get('osr-ccb')?.active;
    const mergeClasses = osrCCBActive ? game.settings.get('osr-ccb', 'displayCustomClasses') : [];
    if (osrCCBActive && mergeClasses) {
      let customClasses = game.settings.get('osr-ccb', 'customClasses');
      return classOptions.concat(customClasses);
    } else {
      return classOptions;
    }
  };

  OSRCB.util.multiLvlHp = async function (actor, level, classObj, con, msg = false, whisper) {
    const conMod = [
      [3, -3],
      [5, -2],
      [8, -1],
      [12, 0],
      [15, 1],
      [17, 2],
      [18, 3]
    ];
    let hpMod = 0;
    for (let val of conMod) {
      hpMod = val[1];
      if (con === 3) break;
      if (con <= val[0]) {
        break;
      }
    }

    let { hd } = classObj;
    let hpTotal = 0;
    let hpBonus = 0;
    let bonus = 0;
    let hpMsg = ``;
    let hdArr = classObj.hdArr;
    let rollArr = [];

    if (level < 10) {
      hpBonus = level * hpMod;
      let formula = `${hdArr[level - 1]} + ${hpBonus}`;
      let roll = await new Roll(formula).evaluate({ async: true });
      hpMsg += `<p><b>roll</b>: ${roll.formula} = ${roll.total}</p>`;
      hpTotal += roll.total;
      msg = true;
    } else {
      let modArr = hdArr.slice(9);
      
      hpBonus = 9 * hpMod;
      modArr.map((i) => {
        let num = parseInt(i.slice(i.indexOf('+') + 1));
        bonus += num;
      });
      let formula = `${level}d${hd}+ ${hpBonus} + ${bonus}`;
      let roll = await new Roll(formula).evaluate({ async: true });
      hpMsg += `<p><b>roll</b>: ${roll.formula} = ${roll.total}</p>`;
      hpTotal += roll.total;
      msg = true;
    }

    if (msg == true) {
      let msgData = {
        speaker: ChatMessage.getSpeaker(),
        content: `
      <details>

      <summary>
       <b>${actor.name} HP Rolls:</b>
      </summary>
      </br>
      <div>
      ${hpMsg}
      </div>
      </details>
      `
      };
      if (whisper) msgData.whisper = [...game.users.filter((u) => u.isGM), game.user];
      ChatMessage.create(msgData);
    }
    return hpTotal;
  };
  OSRCB.util.renderCharacterBuilder = function(actor, dataObj){
    for(let form in ui.windows){
      form = ui.windows[form];
      if(form.options.id === 'osr-character-builder' && form?.actor?.id === actor.id){
        ui.notifications.warn('Window Already Open.')
        return false
      }
      
    }
    new OSRCB.characterBuilder(actor, dataObj).render(true)
  }
  OSRCB.util.statsToMsg = async function (data, single=false) {
    let { stats, actor, type } = data;
    let content
    if(single){
      let template = `modules/osr-character-builder/template/chat/single-stat-roll.hbs`

      let templateData = {
        actor: data.actor,
        stat: data.stat,
        type: data.type,
        result: data.result
      }
      content = await renderTemplate(template, templateData)
    }else{
      let templateData = {
        user: game.user,
        actor,
        stats,
        type
      }
       content = await renderTemplate(`modules/osr-character-builder/template/chat/stat-msg.hbs`, templateData);
    }
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: content,
      whisper: (await game.settings.get(`${OSRCB.moduleName}`, 'whisperStatRollMessage'))
        ? game.users.filter((u) => u.isGM)
        : []
    });
  };

  OSRCB.util.rollStats =  async function (hero = false, simple = false) {
    let statArr = ['str', 'int', 'wis', 'con', 'dex', 'cha'];
    const retObj = {};
    if (simple) {
      for (let stat of statArr) {
        retObj[stat] = await OSRCB.util.rollSingleStat(hero);
      }
    } else {
      for (let stat of statArr) {
        retObj[stat] = { value: await OSRCB.util.rollSingleStat(hero, true) };
      }
    }

    return retObj;
  };

  OSRCB.util.rollSingleStat = async (hero = false, showRoll = false) => {
    let rollArr = [];
    let rollResult = 0;
    let formula = hero ? '4d6dl': '3d6'
    const dieCount = hero === true ? 4 : 3;
    let roll = new Roll(formula).evaluate({async:false});
    if(showRoll)game?.dice3d?.showForRoll(roll);
    rollResult = roll.total
    return rollResult;
  };

  OSRCB.util.rollGold = function () {
    let amt = 0;
    for (let i = 0; i < 3; i++) {
      amt += Math.floor(Math.random() * 6 + 1) * 10;
    }
    return amt;
  };

  OSRCB.util.osrUpdateSheet = async function (dataObj, actor) {
    let { source, level } = dataObj;
    let updateData = {};
    const className = dataObj.classOption;
    const isNone = source === 'none'
    const classData = !isNone ? OSRCB.util.getClassOptionObj(source) : null;
    const classObj = !isNone ? classData.classes[className] : null;
    const packName = !isNone ? classObj.pack : null;
    const titles = !isNone ? classObj.title : null;
    let goldItem = actor.items.getName('GP');
    let packExists = !isNone ? await game.packs.get(packName): null;
    if (!isNone && !packExists) {
      ui.notifications.warn('Compendum pack not found. Ending character creation.');
      return;
    }
    // return saves array for level
    const getObj = (multiObj) => {
      let keys = [];
      for (let key of Object.keys(multiObj)) {
        keys.push(parseInt(key));
      }
      keys = keys.sort(function (a, b) {
        return b - a;
      });
      for (let key of keys) {
        if (level >= key) {
          return multiObj[key];
        }
      }
    };

    if (!isNone && level > classObj.maxLvl) {
      level = classObj.maxLvl;
      await actor.update({ data: { details: { level: level } } });
    }
    if (actor.name == '#randGen') {
      await actor.update({
        name: `${classObj.menu} - ${level}`,
        token: { name: `${classObj.menu} - ${level}` }
      });
    }
    if (className == 'default') {
      ui.notifications.warn('Please Choose A Class');
    } else if (source == 'none') {
      updateData = {
        system: {
          details: {
            alignment: dataObj.alignment,
            level: level
          },
          scores: {
            str: { value: dataObj.str },
            int: { value: dataObj.int },
            wis: { value: dataObj.wis },
            dex: { value: dataObj.dex },
            con: { value: dataObj.con },
            cha: { value: dataObj.cha }
          }
        }
      };
    } else {
      const saves = getObj(classObj.saves);
      const thac0 = getObj(classObj['thac0']);
      const xpValue = level === classObj.maxLvl ? 'Max Level' : classObj.xp[level - 1];
      updateData = {
        system: {
          details: {
            class: classObj.menu,
            // get current tile or last title listed
            title: level - 1 < titles.length ? titles[level - 1] : titles[titles.length - 1],
            xp: {
              next: xpValue,
              share: 100
            },
            biography: OSRCB.util.generateBio(classObj),
            notes: classObj.description,
            alignment: dataObj.alignment,
            level: level
          },
          saves: {
            death: {
              value: saves[0]
            },
            wand: {
              value: saves[1]
            },
            paralysis: {
              value: saves[2]
            },
            breath: {
              value: saves[3]
            },
            spell: {
              value: saves[4]
            }
          },
          languages: {
            value: classObj.languages
          },
          spells: {
            enabled: false
          },
          scores: {
            str: { value: dataObj.str },
            int: { value: dataObj.int },
            wis: { value: dataObj.wis },
            dex: { value: dataObj.dex },
            con: { value: dataObj.con },
            cha: { value: dataObj.cha }
          },
          thac0: {
            bba: thac0[1],
            value: thac0[0]
          }
        }
      };

      let hd = classObj.hdArr[level - 1];
      let hpMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage');
      let wHpMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage');
      let mod = actor.system.scores.con.mod;
      let hp = await OSRCB.util.multiLvlHp(actor, level, classObj, dataObj.con, hpMsg, wHpMsg);
      updateData.system.hp = {
        hd: hd,
        value: hp,
        max: hp
      };
    }
    if (dataObj.retainer) {
      updateData.system.retainer = { enabled: true };
      updateData.system.details.xp.share = 50;
    }
    if (!isNone && classObj.spellCaster) {
      updateData.system.spells = classObj.spellSlot[level];
      updateData.system.spells.enabled = true;
    }
    await actor.update(updateData);
    //if no gold item exists create one then update, else update gold amount
    // check for currency items
    let types = ['PP', 'GP', 'EP', 'SP', 'CP'];
    let curCheck = async (type) => {
      let itemExists = actor.items.getName(type);
      let pack = game.packs.get(`${OSRCB.moduleName}.osr-srd-items`);
      if (!itemExists) {
        let curItem = await pack.getDocument(pack.index.getName(type)._id);
        let itemData = curItem.clone();
        await actor.createEmbeddedDocuments('Item', [itemData]);
        if (type == 'GP') {
          goldItem = actor.items.getName('GP');
        }
      }
    };
    for (let type of types) {
      await curCheck(type);
    }
    await goldItem.update({ system: { quantity: { value: dataObj.goldAmount } } });
    if(source != 'none') await OSRCB.util.addClassAbilities(classObj.name, actor, packName);
    await actor.setFlag(`${OSRCB.moduleName}`, 'classSelected', true);
    await actor.setFlag(`${OSRCB.moduleName}`, 'classInfo', {source: source, class: className});
    if (dataObj.shopCheck) {
      OSRIS.shop.RUIS(actor._id);
    }
  };
  OSRCB.util.addClassAbilities = async function (className, actor, pack) {
    const compendium = game.packs.get(pack);
    const contents = await compendium.getDocuments()
    const items = contents.filter(i=> i?.system?.requirements?.toLowerCase() === className?.toLowerCase());
    
    ui.notifications.warn(game.i18n.localize(`${OSRCB.moduleName}.addClassWarn`));
    
    await actor.createEmbeddedDocuments('Item', items);
  };
  OSRCB.util.randomSpells = async function (data, actor) {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    let { source, classOption, level } = data;

    
    if (source == 'SRD') {
      source = OSRCB.util.oseActive() ? 'basic' : 'SRD';
    }
    const typeData = await OSRCB.util.getClassOptionObj(source);
    
    const classData = typeData.classes[classOption];
    //break out if not spellcaster
    if (!classData.spellCaster) {
      return;
    }
    const magicType = classData?.spellType;
    const slotData = classData?.spellSlot[level];
    const spells = await game.packs.get(classData.spellPackName)?.getDocuments();
    const classSpells = spells.filter(sp => sp?.system?.class?.toLowerCase() === magicType.toLowerCase());
    const pickedSpells = []
    for (let key in slotData) {
      if (slotData[key].max > 0) {
        let count = 0 
        let list = classSpells.filter(s=>s.system.lvl === parseInt(key));
        while(count < slotData[key].max){
          let idx = Math.floor(Math.random() * list.length);
          let picked = list[idx];
          let existing = pickedSpells.filter(s=>s.name === picked.name).length
          if(!existing){
            pickedSpells.push(picked);            
          }
          count++
        }
      }
    }

    await actor.createEmbeddedDocuments('Item', pickedSpells)
  };
  OSRCB.util.randomItems = async function (data, actor) {
    const oseActive = OSRCB.util.oseActive();
    const { classOption } = data;

    const compendium = await game.packs.get(`${OSRCB.moduleName}.osr-srd-items`);
    const gearList = [
      'Backpack',
      'Crowbar',
      'Garlic',
      'Grappling Hook',
      'Hammer (small)',
      'Holy Symbol',
      'Holy Water (vial)',
      'Iron Spikes (12)',
      'Lantern',
      'Mirror (hand sized, steel)',
      'Oil (1 flask)',
      "Pole (10' long, wooden)",
      'Rations (iron, 7 days)',
      'Rations (standard, 7 days)',
      "Rope (50')",
      'Sack (large)',
      'Sack (small)',
      'Stakes (3) and Mallet',
      'Thieves Tools',
      'Tinder Box (flint and steel)',
      'Torches (6)',
      'Waterskin',
      'Wine (2 pints)',
      'Wolfsbane (1 bunch)'
    ];
    const armorList = oseActive ? OSE.data.retainerGear[classOption].armor : OSRCB.data.retainerGear[classOption].armor;
    const weaponList = oseActive
      ? OSE.data.retainerGear[classOption].weapons
      : OSRCB.data.retainerGear[classOption].weapons;
    const weaponPick = [];
    let weaponCount = Math.floor(Math.random() * 2 + 1);
    if (weaponCount > weaponList.length) weaponCount = weaponList.length;
    const itemPick = [];
    let itemCount = Math.floor(Math.random() * 4 + 3);
    const armorPick = [];
    if (armorList.length > 0) armorPick.push(armorList[Math.floor(Math.random() * armorList.length)]);
    while (weaponPick.length < weaponCount) {
      let pick = weaponList[Math.floor(Math.random() * weaponList.length)];
      if (!weaponPick.includes(pick)) {
        weaponPick.push(pick);
      }
    }
    while (itemPick.length < itemCount) {
      let pick = gearList[Math.floor(Math.random() * gearList.length)];
      if (!itemPick.includes(pick)) {
        itemPick.push(pick);
      }
    }
    for (let item of armorPick) {
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data = itemObj.clone();
      data.system.equipped = true;

      await actor.createEmbeddedDocuments('Item', [data]);
      await actor.items.getName(data.name).update({ data: { equipped: true } });
    }
    let weapCount = 0;
    for (let item of weaponPick) {
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data = itemObj.clone();

      await actor.createEmbeddedDocuments('Item', [data]);
      if (weapCount == 0) {
        await actor.items.getName(data.name).update({ data: { equipped: true } });
      }
      weapCount++;
    }
    for (let item of itemPick) {
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data = itemObj.clone();

      await actor.createEmbeddedDocuments('Item', [data]);
    }
  };
  OSRCB.util.oseActive = function () {
    if (game.modules.get('old-school-essentials')?.active) {
      return true;
    } else return false;
  };
    //capitalize first letter in string
  OSRCB.util.capitalize = function (s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  //working: bonus experience calculator.
  //needs: check for stats, object containing rules per class, logic to use class rule to compare specified stats then add appropriate bonus to the sheet.
  OSRCB.util.osrBonusXp = async function (actor, reqObj) {
    const scores = actor.system.scores;
  };
  OSRCB.util.osrHelperAddItem = async function (itemName, compName, actor) {
    const compendium = await game.packs.get(compName);
    const index = await compendium.getIndex();
    const entry = await index.find((e) => e.name == itemName);
    const entity = await compendium.getDocument(entry._id);

    const newEntity = await entity.clone();
    actor.createEmbeddedDocuments('Item', [newEntity]);
  };
  OSRCB.util.generateBio = function(classObj){
    const biography = `
    <b>Requirements</b>: ${classObj.req} <br>
    <b>Prime requisite</b>: ${classObj.primeReq} <br>
    <b>Hit Dice</b>: ${classObj.hd} <br>
    <b>Maximum level</b>:${classObj.maxLvl} <br>
    <b>Armour</b>: ${classObj.armorTypes} <br>
    <b>Weapons</b>: ${classObj.weaponTypes} <br>
    <b>Languages</b>: ${classObj.languages} <br>
    `
    return biography
  }
}
