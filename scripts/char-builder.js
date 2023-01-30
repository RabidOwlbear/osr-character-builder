export async function registerCharacterBuilder() {
  OSRCB.util.renderCharacterBuilder = async function (actor, dataObj) {
    //options for the forApplication window
    const formOptions = {
      id: 'charBuilderForm',
      classes: ['charBuilderForm'],
      popOut: true,
      template: `modules/${OSRCB.moduleName}/template/characterBuilder.html`,
      id: 'osrCharacterBuilder',
      title: 'Character Builder',
      width: 550,
      height: 730
    };

    const templateData = {
      attrib: game.i18n.localize(`${OSRCB.moduleName}.formAttrib`),
      str: game.i18n.localize(`${OSRCB.moduleName}.formStr`),
      int: game.i18n.localize(`${OSRCB.moduleName}.formInt`),
      wis: game.i18n.localize(`${OSRCB.moduleName}.formWis`),
      dex: game.i18n.localize(`${OSRCB.moduleName}.formDex`),
      con: game.i18n.localize(`${OSRCB.moduleName}.formCon`),
      cha: game.i18n.localize(`${OSRCB.moduleName}.formCha`),
      reRoll: game.i18n.localize(`${OSRCB.moduleName}.formReRoll`),
      heroCheck: game.i18n.localize(`${OSRCB.moduleName}.formHeroCheck`),
      classType: game.i18n.localize(`${OSRCB.moduleName}.formClassType`),
      srd: game.i18n.localize(`${OSRCB.moduleName}.classTypeSRD`),
      alignment: game.i18n.localize(`${OSRCB.moduleName}.formAlignment`),
      lawful: game.i18n.localize(`${OSRCB.moduleName}.formLaw`),
      neutral: game.i18n.localize(`${OSRCB.moduleName}.formNeut`),
      chaotic: game.i18n.localize(`${OSRCB.moduleName}.formChaos`),
      gold: game.i18n.localize(`${OSRCB.moduleName}.formGold`),
      classSelect: game.i18n.localize(`${OSRCB.moduleName}.formClassSelect`),
      classInfo: game.i18n.localize(`${OSRCB.moduleName}.formClassInfo`),
      close: game.i18n.localize(`${OSRCB.moduleName}.formBtnClose`),
      choose: game.i18n.localize(`${OSRCB.moduleName}.formBtnChoose`),
      classTypeContent: OSRCB.util.renderClassTypes(dataObj)
    };
    // { content: listContent };
    // const formHTML = await renderTemplate(formTemplate, templateData);

    class OSRCharBuilder extends FormApplication {
      constructor(object, options, actor) {
        super(object, options);
        this.actor = actor;
        this.html;
      }

      static get defaultOptions() {
        return super.defaultOptions;
      }
      getData(options = {}) {
        return super.getData().object; // the object from the constructor is where we are storing the data
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
        let classTypes = html.find("input[type='radio'][name='classType']");
        for (let type of classTypes) {
          type.addEventListener('input', () => {
            OSRCB.util.renderClassOptions(html);
          });
        }

        lvlInput.addEventListener('change', async () => {
          const classType = html.find("input[type='radio'][name='classType']:checked")[0]?.value;
          const dataObj = OSRCB.util.getClassOptionObj(classType).classes;
          const classOption = html.find("input[type='radio'][name='classOption']:checked")[0]?.value;
          const classObj = dataObj[classOption];
          // const classObj = await OSRCB.util.getClassOptionObj(classType).classes[classOption];

          if (lvlInput.valueAsNumber > classObj.maxLvl) {
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
        const classTypeInp = await this.html.find("[name='classType']");
        const chooseBtn = await this.html.find('#cb-sub-btn')[0];
        chooseBtn.disabled = true;
        for (let i of classTypeInp) {
          if (i.checked) {
            formData.classType = i.value;
          }
        }

        // end fix

        await OSRCB.util.osrUpdateSheet(formData, this.actor);
        if (formData.spellCheck) {
          OSRCB.util.randomSpells(formData, this.actor);
        }
      }
    }
    const newForm = new OSRCharBuilder(templateData, formOptions, actor);
    await newForm.render(true);
  };

  //compile html for class source selection
  OSRCB.util.renderClassTypes = function (dataObj) {

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
        <input type="radio" name="classType" id="${option.name}" value="${option.name}" ${checked} />
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
    const classType = html.find("input[type='radio'][name='classType']:checked")[0]?.value;

    const classInfoTop = html.find('#cb-info-head')[0];
    const classInfoBody = html.find('#cb-info-body')[0];
    const lvlInput = html.find('#level')[0];
    let classListHtml = ``;
    //hacky swap between ose data object and carcass crawler object
    //const dataObj = classType == 'carcassCrawler' ? crawlerData.cc0 : oseClasses[classType];
    const dataObj = OSRCB.util.getClassOptionObj(classType).classes;

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
        classInfoBody.innerHTML = obj.notes;
      }
      count++;
    }
    classListDiv.innerHTML = classListHtml;

    const classRad = html.find("input[type='radio'][name='classOption']");
    for (let input of classRad) {
      input.addEventListener('input', () => {
        const classObj = dataObj[input.value];
        classInfoTop.innerHTML = classObj.description;
        classInfoBody.innerHTML = classObj.notes;
        if (lvlInput.valueAsNumber > classObj.maxLvl) {
          lvlInput.value = classObj.maxLvl;
        }
      });
    }
  };
  //retrieve the relevant class option data object from the game settings option object. requires source category name.
  //eg. basic, advanced, SRD
  OSRCB.util.getClassOptionObj = function (classType) {
    const optionObj = game.settings.get(`${OSRCB.moduleName}`, 'characterClasses');

    for (let key of Object.keys(optionObj)) {
      let options = optionObj[key].options;
      for (let i = 0; i < options.length; i++) {
        let obj = options[i];
        if (obj.name == classType) {
          return obj;
        }
      }
    }
  };

  OSRCB.util.osrUpdateSheet = async function (dataObj, actor) {
    const optionObj = await game.settings.get(`${OSRCB.moduleName}`, 'characterClasses');
    let { classType, level } = dataObj;
    const className = dataObj.classOption;
    const classData = OSRCB.util.getClassOptionObj(classType);
    const classObj = classData.classes[className];
    const packName = classData.pack;
    let goldItem = actor.items.getName('GP');
    
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

    if (level > classObj.maxLvl) {
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
    } else {
      const saves = getObj(classObj.saves);
      const thac0 = getObj(classObj['thac0']);
      console.log(saves, thac0)
      const xpValue = level == classObj.maxLvl ? 'Max Level' : classObj.xp[level - 1];
      let updateData = {
        system: {
          details: {
            class: classObj.menu,
            title: classObj.title,
            xp: {
              next: xpValue,
              share: 100
            },
            description: classObj.description,
            notes: classObj.notes + classObj.journal,
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
      function multiLvlHp(level, classObj, con, msg = false, whisper) {
        const conMod = [
          [3,-3], [5,-2],[8,-1],[12, 0],[15,1],[17,2],[18,3]
        ]
        let hpMod = 0
        for(let val of conMod){
          hpMod = val[1]
          if(con===3)break
          if(con <= val[0] ){
           break           
          }
        }
   
        let { hd, hdMod } = classObj;
        let hpTotal = 0;
        let hpMsg = ``
        for (let i = 0; i < level; i++) {
          if (i < 9) {
            let roll = Math.floor(Math.random() * hd + 1);
            hpMsg += `<p><b>roll${i+1}</b>: ${roll} + ${hpMod} = ${roll + hpMod}</p>` 
            let total = roll + hpMod > 1 ? roll + hpMod : 1
            hpTotal += total;

          }
          if (i >= 9) {
            let roll = Math.floor(Math.random() * hd + 1);
            hpMsg += `<p><b>roll${i+1}</b>: ${roll} + ${hpMod} = ${roll + hpMod}</p>` 
            hpTotal += roll + hdMod[i - 9] + hpMod;
            
          }
        }
        if(msg == true){
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
            `,
          }
          if(whisper) msgData.whisper = [...game.users.filter((u) => u.isGM), game.user];
          ChatMessage.create(msgData)
        }
        return hpTotal;
      }
      let hd = `1d${classObj.hd}`;
      if (level >= 10) {
        let idx = level - 10;
        hd = `9d${classObj.hd}+${classObj.hdMod[idx]}`;
      }
      let hpMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage')
      let wHpMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage')
      let mod = actor.system.scores.con.mod;
      let hp = multiLvlHp(level, classObj, dataObj.con, hpMsg, wHpMsg);
      updateData.system.hp = {
        hd: hd,
        value: hp,
        max: hp
      };
      if (dataObj.retainer) {
        updateData.system.retainer = { enabled: true };
        updateData.system.details.xp.share = 50;
      }
      if (classObj.spellCaster) {
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
      await OSRCB.util.osrAddClassAbilities(className, actor, packName);
      await actor.setFlag(`${OSRCB.moduleName}`, 'classSelected', true);

      if (dataObj.shopCheck) {
        OSRIS.shop.RUIS(actor._id)
      }
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
      if (item.system.requirements == className) {
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
