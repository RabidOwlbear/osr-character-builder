export function initializeUtils() {
  OSRCB.util.getClassOptionObj = function (classSource) {
    const optionObj = OSRCB.util.mergeClassOptions();

    let sourceObj;
    sourceObj = optionObj.find((s) => s.name.toLowerCase() === classSource.toLowerCase());
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
      let roll = await new Roll(formula).evaluate();
      hpMsg += `<p><b>${game.i18n.localize('osr-character-builder.roll')}</b>: ${roll.formula} = ${roll.total}</p>`;
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
      let roll = await new Roll(formula).evaluate();
      hpMsg += `<p><b>${game.i18n.localize('osr-character-builder.roll')}</b>: ${roll.formula} = ${roll.total}</p>`;
      hpTotal += roll.total;
      msg = true;
    }

    if (msg == true) {
      let msgData = {
        speaker: ChatMessage.getSpeaker(),
        content: `
      <details>

      <summary>
       <b>${actor.name} ${game.i18n.localize('osr-character-builder.HProlls')}:</b>
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
  OSRCB.util.renderCharacterBuilder = function (actor, dataObj) {
    for (let form in ui.windows) {
      form = ui.windows[form];
      if (form.options.id === 'osr-character-builder' && form?.actor?.id === actor.id) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.windowOpen'));
        return false;
      }
    }
    new OSRCB.characterBuilderV2({actor, dataObj}).render(true);
  };
  OSRCB.util.statsToMsg = async function (data, single = false) {
    let { stats, actor, type } = data;
    let content;
    if (single) {
      let template = `modules/osr-character-builder/template/chat/single-stat-roll.hbs`;

      let templateData = {
        actor: data.actor,
        stat: data.stat,
        type: data.type,
        result: data.result
      };
      content = await renderTemplate(template, templateData);
    } else {
      let templateData = {
        user: game.user,
        actor,
        stats,
        type
      };
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

  OSRCB.util.rollStats = async function (hero = false, simple = false) {
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
    let formula = hero ? '4d6dl' : '3d6';
    const dieCount = hero === true ? 4 : 3;
    let roll = await new Roll(formula).evaluate();
    if (showRoll) game?.dice3d?.showForRoll(roll);
    rollResult = roll.total;
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
    
    let untranslatedMod = false;
    const aftActive = await game.modules.get('ose-advancedfantasytome')?.active;
    const oseActive = await game.modules.get('old-school-essentials')?.active;
    if (aftActive || oseActive) {
      untranslatedMod = true;
    }
    let { source, level } = dataObj;
    let updateData = {};
    const className = dataObj.classOption;
    const isNone = source === 'none';
    const sourceData = !isNone ? OSRCB.util.getClassOptionObj(source) : null;
    const classObj = !isNone ? sourceData.classes[className] : { menu: 'None' };
    let packName = !isNone ? classObj.pack : null;
    if (packName === 'osr-character-builder.osr-srd-class-options') {
      //remove once advanced fantasy is updated
      if (untranslatedMod) {
        packName = `osr-character-builder.osr-srd-class-options-en`;
      } else {
        packName = `osr-character-builder.osr-srd-class-options-${game.i18n.lang}`;
      }
    }
    const titles = !isNone ? classObj.title : null;
    let goldItem = actor.items.getName(game.i18n.localize('osr-character-builder.gp'));
    let packExists = !isNone ? await game.packs.get(packName) : null;
    if (!isNone && !packExists) {
      ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.packNotFound'));
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
      ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.chooseClass'));
      return;
    }
    if (isNone || level === 0) {
      let hpVal;
      if (level) {
        let total = 0;
        for (let i = 0; i < level; i++) {
          total += Math.floor(Math.random() * 6 + 1);
        }
        hpVal = total;
      } else {
        hpVal = Math.floor(Math.random() * 4 + 1);
      }

      updateData = {
        name: dataObj.name || `${className} - ${level}`,
        system: {
          hp: {
            hd: level ? `${level}d6` : '1d4',
            value: hpVal,
            max: hpVal
          },
          encumbrance: { max: 1600 },
          details: {
            alignment: dataObj.alignment,
            level: level,
            xp: {}
          },
          scores: {
            str: { value: dataObj.str },
            int: { value: dataObj.int },
            wis: { value: dataObj.wis },
            dex: { value: dataObj.dex },
            con: { value: dataObj.con },
            cha: { value: dataObj.cha }
          },
          saves: {
            death: { value: 14 },
            wand: { value: 15 },
            paralysis: { value: 16 },
            breath: { value: 17 },
            spell: { value: 18 }
          }
        }
      };
    } else {
      const saves = getObj(classObj.saves);
      const thac0 = getObj(classObj['thac0']);
      const xpValue =
        level === classObj.maxLvl ? game.i18n.localize('osr-character-builder.maxLvl') : classObj.xp[level - 1];
      updateData = {
        name: dataObj.name || `${className} - ${level}`,
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
    let types = [
      game.i18n.localize('osr-character-builder.pp'),
      game.i18n.localize('osr-character-builder.gp'),
      game.i18n.localize('osr-character-builder.ep'),
      game.i18n.localize('osr-character-builder.sp'),
      game.i18n.localize('osr-character-builder.cp')
    ];
    let curCheck = async (type) => {
      let itemExists = actor.items.getName(type);
      let packName;
      switch (game.i18n.lang) {
        case 'en':
          packName = `${OSRCB.moduleName}.osr-srd-items-en`;
          break;
        case 'es':
          packName = `${OSRCB.moduleName}.osr-srd-items-es`;
          break;
        default:
          packName = `${OSRCB.moduleName}.osr-srd-items-en`;
      }
      let pack = await game.packs.get(packName);
      if (!itemExists) {
        let curItem = await pack.getDocument(pack.index.getName(type)._id);
        let itemData = curItem.clone();
        await actor.createEmbeddedDocuments('Item', [itemData]);
        let gp = game.i18n.localize('osr-character-builder.gp');
        if (type == gp) {
          goldItem = actor.items.getName(game.i18n.localize('osr-character-builder.gp'));
        }
      }
    };
    for (let type of types) {
      await curCheck(type);
    }
    await goldItem.update({ system: { quantity: { value: dataObj.goldAmount } } });
    if (source != 'none') await OSRCB.util.addClassAbilities(classObj.menu, actor, packName); //test menu instead of name fr ability item selection
    await actor.setFlag(`${OSRCB.moduleName}`, 'classSelected', true);
    await actor.setFlag(`${OSRCB.moduleName}`, 'classInfo', { source: source, class: className });
    if (dataObj.shopCheck) {
      OSRIS.shop.RUIS(actor._id);
    }
  };
  OSRCB.util.getClassAbilities = async (className, pack) => {
    if(pack === 'osr-character-builder.osr-srd-class-options'){ 
      pack = `osr-character-builder.osr-srd-class-options-${game.i18n.lang}`}
    let compendium = await game.packs.get(pack);
    if(!compendium){
      console.warn(`
      OSR CHARACTER BUILDER ERROR
      ------------------------------
        compendium pack: "${pack}" not found.
      ------------------------------
      `)
      // return
      compendium = await game.packs.get(`osr-character-builder.osr-srd-class-options-en`)
    }
    const contents = await compendium.getDocuments();
    let items = contents.filter((i) => i?.system?.requirements?.toLowerCase() === className?.toLowerCase());
    //old style naming shim
    if (!items.length) {
      const osName = className.replaceAll(' ', '-');
      items = contents.filter((i) => i?.system?.requirements?.toLowerCase() === osName?.toLowerCase());
    }
    return items;
  };
  OSRCB.util.addClassAbilities = async function (className, actor, pack) {
    let items = await OSRCB.util.getClassAbilities(className, pack);
    if (!items.length) {
      console.error(`
      ****OSRCB ERROR**** 
      -------------------
      No abilities with requirement of: ${className} found in compendium pack: ${pack}
      ___________________`);
      ui.notifications.warn(game.i18n.localize(`${OSRCB.moduleName}.itemsNotFound`));
    }
    ui.notifications.warn(game.i18n.localize(`${OSRCB.moduleName}.addClassWarn`));

    await actor.createEmbeddedDocuments('Item', items);
  };
  OSRCB.util.randomSpells = async function (data, actor) {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    let { source, classOption, level } = data;
    if(classOption == 'none'){
      return;
    } 
    if (source == 'SRD') {
      source = OSRCB.util.oseActive() ? 'basic' : 'SRD';
    }
    const typeData = await OSRCB.util.getClassOptionObj(source);

    const classData = typeData.classes[classOption];
    //break out if not spellcaster
    if (!classData.spellCaster) {
      return;
    }
    const spellPackName =
      OSRCB.util.oseAfActive() && classData.spellPackName.includes('old-school-essentials.')
        ? 'ose-advancedfantasytome.spells'
        : classData.spellPackName;
    const magicType = classData?.spellType;
    const slotData = classData?.spellSlot[level];
    let spellPack =  await game.packs.get(spellPackName)
    // temp lang fallback
    if (!spellPack) spellPack = await  game.packs.get(`osr-character-builder.osr-srd-class-options-en`)
    const spells = await spellPack.getDocuments();
   
    const classSpells = spells.filter((sp) => sp?.system?.class?.toLowerCase() === magicType.toLowerCase());
    const pickedSpells = [];
    for (let key in slotData) {
      if (slotData[key].max > 0) {
        let count = 0;
        let list = classSpells.filter((s) => s.system.lvl === parseInt(key));
        while (count < slotData[key].max) {
          let idx = Math.floor(Math.random() * list.length);
          let picked = list[idx];
          let existing = pickedSpells.filter((s) => s.name === picked.name).length;
          if (!existing) {
            pickedSpells.push(picked);
          }
          count++;
        }
      }
    }
    await actor.createEmbeddedDocuments('Item', pickedSpells);
  };
  OSRCB.util.randomItems = async function (data, actor) {
    const oseActive = OSRCB.util.oseActive();
    const { classOption } = data;
    if(classOption == 'none'){
      return;
    } 
    const isZero = data.level === 0;
    const compendium = await game.packs.get(`${OSRCB.moduleName}.osr-srd-items-${game.i18n.lang}`);
    const gearList = [
      game.i18n.localize('osr-character-builder.backpack'),
      game.i18n.localize('osr-character-builder.crowbar'),
      game.i18n.localize('osr-character-builder.garlic'),
      game.i18n.localize('osr-character-builder.gHook'),
      game.i18n.localize('osr-character-builder.hammer'),
      game.i18n.localize('osr-character-builder.holySymbo'),
      game.i18n.localize('osr-character-builder.holyWater'),
      game.i18n.localize('osr-character-builder.ironSpikes'),
      game.i18n.localize('osr-character-builder.lantern'),
      game.i18n.localize('osr-character-builder.mirror'),
      game.i18n.localize('osr-character-builder.oil'),
      game.i18n.localize('osr-character-builder.pole'),
      game.i18n.localize('osr-character-builder.rationsI'),
      game.i18n.localize('osr-character-builder.rationsS'),
      game.i18n.localize('osr-character-builder.rope'),
      game.i18n.localize('osr-character-builder.sackL'),
      game.i18n.localize('osr-character-builder.sackS'),
      game.i18n.localize('osr-character-builder.stakes'),
      game.i18n.localize('osr-character-builder.thieves Tools'),
      game.i18n.localize('osr-character-builder.tinder Box'),
      game.i18n.localize('osr-character-builder.torches'),
      game.i18n.localize('osr-character-builder.waterskin'),
      game.i18n.localize('osr-character-builder.wine'),
      game.i18n.localize('osr-character-builder.wolfsbane')
    ];
    const armorList = isZero ? [] : OSRCB.data.retainerGear[classOption].armor;
    const weaponList = isZero ? [] : OSRCB.data.retainerGear[classOption].weapons;
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
      const itemObj = await compendium.getDocument(itemData?._id);
      if (itemObj) {
        const data = itemObj.clone();
        await actor.createEmbeddedDocuments('Item', [data]);
      }
    }
  };
  OSRCB.util.oseActive = function () {
    if (game.modules.get('old-school-essentials')?.active) {
      return true;
    } else return false;
  };
  OSRCB.util.oseAfActive = function () {
    if (game.modules.get('ose-advancedfantasytome')?.active) {
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
  OSRCB.util.generateBio = function (classObj) {
    let languages = ``;
    classObj.languages.map((i) => (languages += `${i}, `));
    const biography = `
    <b>${game.i18n.localize('osr-character-builder.requirements')}</b>: ${classObj.req} <br>
    <b>${game.i18n.localize('osr-character-builder.primeRequisite')}</b>: ${classObj.primeReq} <br>
    <b>${game.i18n.localize('osr-character-builder.hitDice')}</b>: ${classObj.hd} <br>
    <b>${game.i18n.localize('osr-character-builder.maxLevel')}</b>:${classObj.maxLvl} <br>
    <b>${game.i18n.localize('osr-character-builder.armour')}</b>: ${classObj.armorTypes} <br>
    <b>${game.i18n.localize('osr-character-builder.weapons')}</b>: ${classObj.weaponTypes} <br>
    <b>${game.i18n.localize('osr-character-builder.languages')}</b>: ${languages} <br>
    `;
    return biography;
  };
  OSRCB.util.langCheck = function () {
    const curLang = game.i18n.lang;
    const langList = OSRCB.lang;
    let lang = 'en';
    if (langList.includes(curLang)) {
      lang = curLang;
    }
    return lang;
  };
  OSRCB.util.newPlayerCharacterDialog = () => {
    new Dialog({
      title: 'New Player Character Sheet',
      content: `
    <span>Character Name</span>
    <input type="text id="charName">
    `,
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Option One',
          callback: (a, b) => {
            const name = a[0].querySelector('#charName').value;
            OSRCB.util.newPlayerCharacterDialog();
          }
        }
      }
    }).render(true);
    // new foundry.applications.api.DialogV2({
    //   window: {title: 'New Player Character Sheet'},
    //   content: `  
    // <span>Character Name</span>
    // <input type="text id="charName">
    // `,
    // buttons: [
    //   {
    //     action: 'create',
    //     icon: '<i class="fas fa-check"></i>',
    //     label: 'Option One',
    //     callback: (ev, btn, dialog) => {
    //       const name = dialog.querySelector('#charName').value;
    //       OSRCB.util.newPlayerCharacterDialog();
    //     }
    //   }
    // ]
    // }).render({force:true})
  };
  OSRCB.util.newPlayerCharacter = async function () {
    const hasPermission = await game.settings.get(OSRCB.moduleName, 'allowUserCharacterMacro');
    if(hasPermission){
      game.socket.emit('module.osr-character-builder', { type: 'newPlayerCharacter', data: { user: game.user.id } });
    }
    
  };
  OSRCB.util.addExternalClasses= async function(classData, modName = 'external', set = false){
    if(OSRCB.singleGM){
      for(let option of classData){
        OSRCB.data.externalClasses.push(option)
      }
      console.log(`---- OSRCB: ${modName} classes added. ----`);
      if(set){
        await game.settings.set('osr-character-builder', 'externalClasses', []);
        await game.settings.set('osr-character-builder', 'externalClasses', OSRCB.data.externalClasses);
      }
    }
  }
  OSRCB.util.sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  OSRCB.singleGM =  function () {
    return game.users.filter((u) => u.active && u.isGM)[0]?.id === game.user.id;
  };
  OSRCB.util.renderCharacterBuilder = function (actor, dataObj) {
    new OSRCB.characterBuilderV2({actor, dataObj}).render(true);
  };
}
export const intializePackFolders = async () => {
  let singleGM = false;
  if (game.user.isGM && game.users.filter((u) => u.role == 4)[0]?.id === game.user.id) {
    singleGM = true;
  }
  if (singleGM) {
    const movePacks = await game.settings.get('osr-character-builder', 'makePackFolder');
    const folderName = await game.settings.get('osr-character-builder', 'packFolderName');
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    const packnames = [
      'osr-srd-class-options-en',
      'osr-srd-class-options-es',
      'osr-srd-items-en',
      'osr-srd-items-es',
      'osr-srd-spells-en',
      'osr-srd-spells-es',
      'osr-srd-classes-en',
      'osr-srd-classes-es',
      'osr-character-builder-macros-en'
    ];
    let folder = game.folders.getName(folderName);
    if (!folder && movePacks) {
      folder = await Folder.create([{ name: folderName, type: 'Compendium', color: '#713289' }]);
      packnames.forEach(async (pn) => {
        const pack = await game.packs.get(`osr-character-builder.${pn}`);
        if (pack) await pack.setFolder(folder[0]);
      });
      await sleep(150);
      ui.sidebar.render();
    }
  }
};
export const hideForeignPacks = () => {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  Hooks.on('changeSidebarTab', async (tab) => {
    if (await game.settings.get(`osr-character-builder`, 'hideForeignPacks')) {
      hfp(tab);
    }
  });
  Hooks.on('renderSidebarTab', async (tab) => {
    await sleep(250);
    if (await game.settings.get(`osr-character-builder`, 'hideForeignPacks')) {
      hfp(tab);
    }
  });
};
function hfp(tab) {
  const language = OSRCB.util.langCheck();
  const el = tab.element || tab._element;
  if (el[0]?.id === 'compendium' || el.id === 'compendium') {
    const lis = document.querySelectorAll('li.compendium');
    const osrcbPacks = [...lis].filter((li) => {
      const send = li.dataset?.entryId?.includes('osr-character-builder') ||li.dataset?.pack?.includes('osr-character-builder');
      return send ? send : false;
    });
    if (osrcbPacks.length) {
      if (OSRCB.lang.includes(language)) {
        const langstring = `(${language})`;
        osrcbPacks.forEach((p) => {
          const title = p.querySelector('h3.compendium-name')?.innerText || p.querySelector('.compendium-name strong')?.innerText;
          if (title.includes('(') && !title.includes(langstring)) {
            p.style.display = 'none';
          }
        });
      } else {
        const langs = OSRCB.lang.filter((i) => i != `en`);
        osrcbPacks.forEach((p) => {
          const title = p.querySelector('h3.compendium-name')?.innerText || p.querySelector('.compendium-name strong')?.innerText;
          for (let lang of langs) {
            if (title.includes(`(${lang})`)) {
              p.style.display = 'none';
            }
          }
        });
      }
    }
  }
}
