import { mergeClassOptions, multiLvlHp } from './util.mjs';
export async function registerCharacterBuilder() {
  OSRCB.util.renderCharacterBuilder = async function (actor, dataObj) {
    class OSRCharBuilder extends FormApplication {
      constructor(actor, dataObj) {
        super();
        this.actor = actor;
        this.dataObj = dataObj;
        this.html;
      }

      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          id: 'charBuilderForm',
          classes: ['charBuilderForm'],
          popOut: true,
          template: `modules/${OSRCB.moduleName}/template/characterBuilder.hbs`,
          id: 'osrCharacterBuilder',
          title: 'Character Builder',
          width: 550,
          height: 730
        });
      }
      getData() {
        const context = super.getData();
        context.attrib = game.i18n.localize(`${OSRCB.moduleName}.formAttrib`);
        context.str = game.i18n.localize(`${OSRCB.moduleName}.formStr`);
        context.int = game.i18n.localize(`${OSRCB.moduleName}.formInt`);
        context.wis = game.i18n.localize(`${OSRCB.moduleName}.formWis`);
        context.dex = game.i18n.localize(`${OSRCB.moduleName}.formDex`);
        context.con = game.i18n.localize(`${OSRCB.moduleName}.formCon`);
        context.cha = game.i18n.localize(`${OSRCB.moduleName}.formCha`);
        context.reRoll = game.i18n.localize(`${OSRCB.moduleName}.formReRoll`);
        context.heroCheck = game.i18n.localize(`${OSRCB.moduleName}.formHeroCheck`);
        context.classSource = game.i18n.localize(`${OSRCB.moduleName}.formClassSource`);
        context.srd = game.i18n.localize(`${OSRCB.moduleName}.classTypeSRD`);
        context.alignment = game.i18n.localize(`${OSRCB.moduleName}.formAlignment`);
        context.lawful = game.i18n.localize(`${OSRCB.moduleName}.formLaw`);
        context.neutral = game.i18n.localize(`${OSRCB.moduleName}.formNeut`);
        context.chaotic = game.i18n.localize(`${OSRCB.moduleName}.formChaos`);
        context.gold = game.i18n.localize(`${OSRCB.moduleName}.formGold`);
        context.classSelect = game.i18n.localize(`${OSRCB.moduleName}.formClassSelect`);
        context.classInfo = game.i18n.localize(`${OSRCB.moduleName}.formClassInfo`);
        context.close = game.i18n.localize(`${OSRCB.moduleName}.formBtnClose`);
        context.choose = game.i18n.localize(`${OSRCB.moduleName}.formBtnChoose`);
        // context.classTypeContent = OSRCB.util.renderClassTypes(this.dataObj);
        context.data = this.dataObj;
        return context;
      }
      activateListeners(html) {
        super.activateListeners(html);
        const closeBtn = html.find('#cb-close-btn')[0];
        const goldRerollBtn = html.find('#cb-reroll-gold')[0];
        const statRerollBtn = html.find('#stat-reroll-btn')[0];
        const heroSelect = html.find('#hero-check')[0];
        const lvlInput = html.find('#level')[0];
        closeBtn.addEventListener('click', () => {
          this.close();
        });
        goldRerollBtn.addEventListener('click', () => {
          OSRCB.util.renderGold(html, this.actor, true);
        });
        statRerollBtn.addEventListener('click', () => {
          OSRCB.util.renderAbilScores(html, this.actor, true);
        });
        let classSources = html.find("input[type='radio'][name='source']");
        for (let type of classSources) {
          type.addEventListener('input', () => {
            OSRCB.util.renderClassOptions(html);
          });
        }

        lvlInput.addEventListener('change', async () => {
          const classSource = html.find("input[type='radio'][name='source']:checked")[0]?.value;
          const dataObj = OSRCB.util.getClassOptionObj(classSource)?.classes;
          const classOption = html.find("input[type='radio'][name='classOption']:checked")[0]?.value;
          const classObj = dataObj[classOption];
          // const classObj = await OSRCB.util.getClassOptionObj(classSource).classes[classOption];
          if (lvlInput.valueAsNumber > classObj?.maxLvl) {
            lvlInput.value = classObj.maxLvl;
          }
        });

        this.html = html;
      }
      async _updateObject(event, formData) {
        this.render();
        // dont know why this is ncessary, temp fix for the issue of formData not recieving the value of the selected radio button
        const lvl = await this.html.find('#level');
        const spells = await this.html.find('#spells')[0];
        formData.level = lvl[0].valueAsNumber;
        formData.spellCheck = spells.checked;
        const classSourceInp = await this.html.find("[name='source']");
        const chooseBtn = await this.html.find('#cb-sub-btn')[0];
        chooseBtn.disabled = true;
        for (let i of classSourceInp) {
          if (i.checked) {
            formData.classSource = i.value;
          }
        }

        // end fix


        await OSRCB.util.osrUpdateSheet(formData, this.actor);
        if (formData.spellCheck) {
          OSRCB.util.randomSpells(formData, this.actor);
        }
      }
    }
    const newForm = new OSRCharBuilder(actor, dataObj);
    await newForm.render(true);
  };

  //compile html for class source selection
  OSRCB.util.renderclassSources = function (dataObj) {
    //if dataObj has key of 'OSE' use basic as the default checked option, else use 'SRD'
    const defaultCheck = dataObj?.OSE ? 'basic' : 'SRD';
    //output html content
    let retHTML = ``;
    //loop through the data object
    for (let source in dataObj) {
      let current = dataObj[source];
      //if header = true create header before list entry
      if (current.header) {
        retHTML += `<div class="cb-list-cat">${current.name}</div>`;
      }
      //add all class categories
      for (let option of current.options) {
        //if option is 'srd' add checked property, else add empty space
        let checked = option.name == defaultCheck ? 'checked' : '';
        retHTML += `
      <div class="fx-sb cb-list">
        <label for="${option.name}">${option.name}</label>
        <input type="radio" name="classSource" id="${option.name}" value="${option.name}" ${checked} />
      </div>
      `;
      }
    }

    return retHTML;
  };

  OSRCB.util.renderGold = function (html, actor, reroll = false) {
    const goldInp = html.find('#cb-gold-input')[0];
    const actorGold = actor.items.getName('GP')?.system?.quantity?.value;
    if (actorGold == undefined && !reroll) {
      goldInp.value = 0;
      return;
    }
    if (reroll) {
      goldInp.value = OSRCB.util.osrRollGold();
      return;
    }

    goldInp.value = actorGold;
  };

  OSRCB.util.osrRollGold = function () {
    let amt = 0;
    for (let i = 0; i < 3; i++) {
      amt += Math.floor(Math.random() * 6 + 1) * 10;
    }
    return amt;
  };

  OSRCB.util.renderAbilScores = async function (html, actor, reroll = false) {
    const heroCheck = html.find('#hero-check')[0].checked;
    const actorScores = actor.system.scores;
    const scoreObj = reroll == true ? await OSRCB.util.osrRollStats(heroCheck) : actor.system.scores;
    const statInputs = html.find("input[type='number'][ class='cb-stat-inp']");
    for (let input of statInputs) {
      input.value = scoreObj[input.name].value;
    }
    const statsToMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage');
    if (statsToMsg && reroll) {
      OSRCB.util.statsToMsg({ stats: scoreObj, actor: actor, type: heroCheck ? '4d6 Drop Lowest' : '3d6 Standard' });
    }
  };
  OSRCB.util.statsToMsg = async function (data) {
    let { stats, actor, type } = data;
    let msgContent = `
  <details>
  
  <summary>
    <h4 style="display: inline">${game.user.name} Rolled Stats For ${actor.name}</h4>
  </summary>
  </br>
  <div><b>Roll Type:</b> ${type}</div>
  </br>
  <div style="border-bottom: 2px solid black; margin-bottom: 3px;">Results:</div>
  <div style="display: flex; justify-content: space-between; width: 150px">
    <div style"width: 75px"><b>Str:</b></div>
    <div> ${stats.str.value}</div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 150px">
    <div style"width: 75px"><b>Int:</b></div>
    <div> ${stats.int.value}</div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 150px">
    <div style"width: 75px"><b>Wis:</b></div>
    <div> ${stats.wis.value}</div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 150px">
    <div style"width: 75px"><b>Dex:</b></div>
    <div> ${stats.dex.value}</div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 150px">
    <div style"width: 75px"><b>Con:</b></div>
    <div> ${stats.con.value}</div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 150px">
    <div style"width: 75px"><b>Cha:</b></div>
    <div> ${stats.cha.value}</div>
  </div>
  </details>
  
  `;
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: msgContent,
      whisper: (await game.settings.get(`${OSRCB.moduleName}`, 'whisperStatRollMessage'))
        ? game.users.filter((u) => u.isGM)
        : []
    });
  };
  OSRCB.util.osrRollStats = async function (hero = false, simple = false) {
    let statArr = ['str', 'int', 'wis', 'con', 'dex', 'cha'];

    const retObj = {};
    if (simple) {
      for (let stat of statArr) {
        retObj[stat] = OSRCB.util.osrRollStat(hero);
      }
    } else {
      for (let stat of statArr) {
        retObj[stat] = { value: OSRCB.util.osrRollStat(hero) };
      }
    }

    return retObj;
  };

  OSRCB.util.osrRollStat = (hero = false) => {
    let rollArr = [];
    let rollResult = 0;
    const dieCount = hero === true ? 4 : 3;
    for (let i = 0; i < dieCount; i++) {
      rollArr.push(Math.floor(Math.random() * 6 + 1));
    }
    if (rollArr.length > 3) {
      let dropLowest = [];
      rollArr.reduce((prev, cur) => {
        let retVal = 0;
        if (prev >= cur) {
          retVal = cur;
          dropLowest.push(prev);
        } else {
          retVal = prev;
          dropLowest.push(cur);
        }
        return retVal;
      });
      rollArr = dropLowest;
    }
    for (let die of rollArr) {
      rollResult += die;
    }
    return rollResult;
  };

  OSRCB.util.renderClassOptions = function (html) {
    const classListDiv = html.find('#cb-class-list')[0];
    const source = html.find("input[type='radio'][name='source']:checked")[0]?.value;

    const classInfoTop = html.find('#cb-info-head')[0];
    const classInfoBody = html.find('#cb-info-body')[0];
    const lvlInput = html.find('#level')[0];
    let classListHtml = ``;
    //hacky swap between ose data object and carcass crawler object
    //const dataObj = classSource == 'carcassCrawler' ? crawlerData.cc0 : oseClasses[classSource];
    if(source === 'none'){
      classListDiv.innerHTML = ''
      classInfoTop.innerHTML = ''
      classInfoBody.innerHTML = ''
    }else {
    const dataObj = OSRCB.util.getClassOptionObj(source).classes;

    let length = Object.keys(dataObj).length;
    let pick = Math.floor(Math.random() * length + 1);
    let count = 1;
    for (let entry in dataObj) {
      let checked = pick == count ? 'checked' : '';
      const obj = dataObj[entry];
      classListHtml += `<div class="fx-sb cb-list">
    <label for"${obj.name}">${obj.menu}</label>
    <input type="radio" name="classOption" id="${obj.name} - ${obj.req}" value="${obj.name}" + ${checked}>
    </div>`;
      if (checked === 'checked') {
        classInfoTop.innerHTML = obj.description;
        classInfoBody.innerHTML = TextEditor.enrichHTML(obj.notes, { async: false });
      }
      count++;
    }
    classListDiv.innerHTML = classListHtml;

    const classRad = html.find("input[type='radio'][name='classOption']");
    for (let input of classRad) {
      input.addEventListener('input', () => {
        const classObj = dataObj[input.value];
        classInfoTop.innerHTML = classObj.description;
        classInfoBody.innerHTML = TextEditor.enrichHTML(classObj.notes, { async: false });
        if (lvlInput.valueAsNumber > classObj.maxLvl) {
          lvlInput.value = classObj.maxLvl;
        }
      });
    }}
  };
  //retrieve the relevant class option data object from the game settings option object. requires source category name.
  //eg. basic, advanced, SRD
  OSRCB.util.getClassOptionObj = function (classSource) {

    const optionObj = mergeClassOptions();
    let sourceObj = optionObj.find((s) => s.name.toLowerCase() === classSource.toLowerCase());
    return sourceObj;
    
  };

  OSRCB.util.osrUpdateSheet = async function (dataObj, actor) {
    const optionObj = await game.settings.get(`${OSRCB.moduleName}`, 'characterClasses');
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
            biography: classObj.description,
            notes: classObj.notes,
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
      let hp = await multiLvlHp(actor, level, classObj, dataObj.con, hpMsg, wHpMsg);
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
    await goldItem.update({ data: { quantity: { value: dataObj.goldAmount } } });
    if(source != 'none') await OSRCB.util.osrAddClassAbilities(classObj.menu, actor, packName);
    await actor.setFlag(`${OSRCB.moduleName}`, 'classSelected', true);

    if (dataObj.shopCheck) {
      OSRIS.shop.RUIS(actor._id);
    }
  };

  OSRCB.util.shopCheck = async function (html) {
    let addShopCheck;
    try {
      addShopCheck = await game.settings.get('osr-item-shop', 'charBuilderCheck');
    } catch {
      addShopCheck = false;
    }

    //check for shop
    if (addShopCheck) {
      const checkHtml = `<label for="cb-shop-check">Open Item Shop?</label>
    <input type="checkbox" name="shopCheck" id="cb-shop-check">`;
      const checkDiv = html.find('#shop-check')[0];
      checkDiv.innerHTML = checkHtml;
    }
  };

  OSRCB.util.osrHelperAddItem = async function (itemName, compName, actor) {
    const compendium = await game.packs.get(compName);
    const index = await compendium.getIndex();
    const entry = await index.find((e) => e.name == itemName);
    const entity = await compendium.getDocument(entry._id);

    const newEntity = await entity.clone();
    actor.createEmbeddedDocuments('Item', [newEntity]);
  };

  //add class abilities to sheet
  OSRCB.util.osrAddClassAbilities = async function (className, actor, pack) {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    const compendium = game.packs.get(pack);
    ui.notifications.warn(game.i18n.localize(`${OSRCB.moduleName}.addClassWarn`));
    for (let abil of compendium.index.contents) {
      const item = await compendium.getDocument(abil._id);
      if (item.system.requirements?.toLowerCase() == className?.toLowerCase()) {
        await sleep(50);
        await actor.createEmbeddedDocuments('Item', [item]);
      }
    }
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
}
