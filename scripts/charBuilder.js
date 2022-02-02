Hooks.once('OSECB Registered', ()=>{
OSECB.util.renderCharacterBuilder = async function (actor, dataObj) {
  //options for the forApplication window
  const formOptions = {
    id: 'charBuilderForm',
    classes: ['charBuilderForm'],
    popOut: true,
    template: `modules/OSE-CharacterBuilder/template/characterBuilder.html`,
    id: 'osrCharacterBuilder',
    title: 'Character Builder',
    width: 550,
    height: 730
  };

  const templateData = {
    attrib: game.i18n.localize('OSE-CharacterBuilder.formAttrib'),
    str: game.i18n.localize('OSE-CharacterBuilder.formStr'),
    int: game.i18n.localize('OSE-CharacterBuilder.formInt'),
    wis: game.i18n.localize('OSE-CharacterBuilder.formWis'),
    dex: game.i18n.localize('OSE-CharacterBuilder.formDex'),
    con: game.i18n.localize('OSE-CharacterBuilder.formCon'),
    cha: game.i18n.localize('OSE-CharacterBuilder.formCha'),
    reRoll: game.i18n.localize('OSE-CharacterBuilder.formReRoll'),
    heroCheck: game.i18n.localize('OSE-CharacterBuilder.formHeroCheck'),
    classType: game.i18n.localize('OSE-CharacterBuilder.formClassType'),
    srd: game.i18n.localize('OSE-CharacterBuilder.classTypeSRD'),
    alignment: game.i18n.localize('OSE-CharacterBuilder.formAlignment'),
    lawful: game.i18n.localize('OSE-CharacterBuilder.formLaw'),
    neutral: game.i18n.localize('OSE-CharacterBuilder.formNeut'),
    chaotic: game.i18n.localize('OSE-CharacterBuilder.formChaos'),
    gold: game.i18n.localize('OSE-CharacterBuilder.formGold'),
    classSelect: game.i18n.localize('OSE-CharacterBuilder.formClassSelect'),
    classInfo: game.i18n.localize('OSE-CharacterBuilder.formClassInfo'),
    close: game.i18n.localize('OSE-CharacterBuilder.formBtnClose'),
    choose: game.i18n.localize('OSE-CharacterBuilder.formBtnChoose'),
    classTypeContent: OSECB.util.renderClassTypes(dataObj)
  };
  // { content: listContent };
  // const formHTML = await renderTemplate(formTemplate, templateData);

  class OSECharBuilder extends FormApplication {
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
      const lvlInput = html.find('#level')[0]
      closeBtn.addEventListener('click', () => {
        this.close();
      });
      goldRerollBtn.addEventListener('click', () => {
        
        OSECB.util.renderGold(html, this.actor, true);
      });
      statRerollBtn.addEventListener('click', () => {
        
        OSECB.util.renderAbilScores(html, this.actor, true);
      });
      let classTypes = html.find("input[type='radio'][name='classType']");
      for (let type of classTypes) {
        
        type.addEventListener('input', () => {
          OSECB.util.renderClassOptions(html);
        });
      }

      lvlInput.addEventListener('change',async  ()=>{

        const classType = html.find("input[type='radio'][name='classType']:checked")[0]?.value;
        const dataObj = OSECB.util.getClassOptionObj(classType).classes;
        const classOption = html.find("input[type='radio'][name='classOption']:checked")[0]?.value;
        const classObj = dataObj[classOption];
        // const classObj = await OSECB.util.getClassOptionObj(classType).classes[classOption];
        console.log(classObj, classObj.maxLvl, this)
        if(lvlInput.valueAsNumber > classObj.maxLvl){
          lvlInput.value = classObj.maxLvl
        }
    
      })

      this.html = html;
    }

    async _updateObject(event, formData) {
      this.render();
      console.log(formData)

    // dont know why this is ncessary, temp fix for the issue of formData not recieving the value of the selected radio button
      const lvl = await this.html.find("#level")
      const spells = await this.html.find('#spells')[0]
      formData.level = lvl[0].valueAsNumber
      formData.spellCheck = spells.checked
      const classTypeInp = this.html.find("[name='classType']");
      for (let i of classTypeInp){
        if(i.checked){
          formData.classType = i.value
        }
      }

    // end fix 
    
      await OSECB.util.oseUpdateSheet(formData, this.actor);
      if(formData.spellCheck){
        OSECB.util.randomSpells(formData, this.actor)
      }
    }
  }
  const newForm = new OSECharBuilder(templateData, formOptions, actor);
  await newForm.render(true);
}

//compile html for class source selection
OSECB.util.renderClassTypes = function (dataObj) {
  //if dataObj has key of 'OSE' use basic as the default checked option, else use 'SRD'
  const defaultCheck = dataObj.OSE ? 'Basic' : 'SRD';
  //output html content
  let retHTML = ``;
  //loop through the data object
  for (const source in dataObj) {
    current = dataObj[source];
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
}

OSECB.util.renderGold = function (html, actor, reroll = false) {
  const goldInp = html.find('#cb-gold-input')[0];
  const actorGold = actor.data.items.getName('GP')?.data?.data?.quantity?.value;
  if (actorGold == undefined && !reroll) {
    goldInp.value = 0;
    return;
  }
  if (reroll) {
    goldInp.value = OSECB.util.oseRollGold();
    return;
  }

  goldInp.value = actorGold;
}

OSECB.util.oseRollGold = function () {
  let amt = 0;
  for (let i = 0; i < 3; i++) {
    amt += Math.floor(Math.random() * 6 + 1) * 10;
  }
  return amt;
}

OSECB.util.renderAbilScores = function (html, actor, reroll = false) {
  const heroCheck = html.find('#hero-check')[0].checked;
  const actorScores = actor.data.data.scores;
  const scoreObj = reroll == true ? OSECB.util.oseRollStats(heroCheck) : actor.data.data.scores;
  const statInputs = html.find("input[type='number'][ class='cb-stat-inp']");
  for (let input of statInputs) {
    input.value = scoreObj[input.name].value;
  }
}

OSECB.util.oseRollStats = function (hero = false, simple = false) {
  let statArr = ['str', 'int', 'wis', 'con', 'dex', 'cha'];
  const retObj = {};
  if(simple){
    for(let stat of statArr){
      retObj[stat] = OSECB.util.oseRollStat(hero)
    }
  }else{
    for (let stat of statArr) {
      retObj[stat] = { value: OSECB.util.oseRollStat(hero) };
    }
  }
  

  return retObj;
}

OSECB.util.oseRollStat  = (hero = false) => {
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

OSECB.util.renderClassOptions = function (html) {
  const classListDiv = html.find('#cb-class-list')[0];
  const classType = html.find("input[type='radio'][name='classType']:checked")[0]?.value;
  console.log(classType)
  const classInfoTop = html.find('#cb-info-head')[0];
  const classInfoBody = html.find('#cb-info-body')[0];
  const lvlInput = html.find('#level')[0]
  let classListHtml = ``;
  //hacky swap between ose data object and carcass crawler object
  //const dataObj = classType == 'carcassCrawler' ? crawlerData.cc0 : oseClasses[classType];
  const dataObj = OSECB.util.getClassOptionObj(classType).classes;
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
      if(lvlInput.valueAsNumber > classObj.maxLvl){
        lvlInput.value = classObj.maxLvl
      }
    });
  }

  
}
//retrieve the relevant class option data object from the game settings option object. requires source category name.
//eg. basic, advanced, SRD
OSECB.util.getClassOptionObj = function (classType) {
  const optionObj = game.settings.get('OSE-CharacterBuilder', 'characterClasses');

  for (let key of Object.keys(optionObj)) {
    let options = optionObj[key].options;
    for (let i = 0; i < options.length; i++) {
      let obj = options[i];
      if (obj.name == classType) {
        return obj;
      }
    }
  }
}

OSECB.util.oseUpdateSheet = async function (dataObj, actor) {
  console.log(dataObj)
  const optionObj = await game.settings.get('OSE-CharacterBuilder', 'characterClasses');
  let {classType, level} = dataObj
  const className = dataObj.classOption;
  
  const classData = OSECB.util.getClassOptionObj(classType);
  
  const classObj = classData.classes[className];
  const packName = classData.pack;
  let goldItem = actor.data.items.getName('GP');
  console.log('cd', classData, classObj)
  // return saves array for level
  const getSaves = (saveObj)=>{
    let keys =[]
    for(let key of Object.keys(saveObj)){
      keys.push(parseInt(key))
    }
    keys = keys.sort(function(a, b) {
      return b - a;
    });
    for(let key of keys){
      if(level >= key){
        console.log(level, key)
        return saveObj[key]
      }
    }

    
  }
  console.log('actor', actor, level> classObj.maxLvl)
  if(level > classObj.maxLvl){
    level = classObj.maxLvl;
    await actor.update({data: {details:{level: level}}})
    console.log('level changed to', level)
  } 
  if(actor.data.name == '#randGen'){
    await actor.update({name: `${classObj.menu} - ${level}`})
  }
  console.log('after', actor)
  if (className == 'default') {
    ui.notifications.warn('Please Choose A Class');
  } else {
    const saves =  getSaves(classObj.saves)
    let updateData = {
      data: {
        details: {
          class: classObj.menu,
          title: classObj.title,
          xp: {
            next: classObj.xp[level - 1],
            share: 100,
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
        }
      }
    };
    // if (rollHp) {
    //roll Hp
    function multiLvlHp(level, classObj){
     let  {hd, hdMod} = classObj;
     let hpTotal = 0;
      for(let i = 1; i <= level; i++){
        // console.log(i)
        if(i <= 9){
          let rollTot =  0
          for(let t=0; t < i; t++){
            rollTot += Math.floor(Math.random() * hd + 1)
          }
          // console.log(rollTot)
          hpTotal += rollTot
        }
        if(i >= 10){
          let rollTot = 0
          for(let t=0; t < 9; t++){
            rollTot += Math.floor(Math.random() * hd + 1)
          }
            // console.log(rollTot, hdMod[i - 10])
            hpTotal += hdMod[i - 10]
            hpTotal += rollTot
          }
      }
      return hpTotal
    }


    let hd = `1d${classObj.hd}`;

    if(level >= 10){
      let idx = level - 10;
      console.log(idx, classObj)
      hd = `9d${classObj.hd}+${classObj.hdMod[idx]}`
    }

    let hp = multiLvlHp(level, classObj)
    updateData.data.hp = {
      hd: hd,
      value: hp,
      max: hp
    };
    // }
    if(dataObj.retainer){
      updateData.data.retainer = {enabled: true}
      updateData.data.details.xp.share = 50
    }
    if (classObj.spellCaster) {
      updateData.data.spells = classObj.spellSlot[level];
      updateData.data.spells.enabled = true
      //  console.log('after', updateData);
      // if (classObj.spellSlot) {
      //   console.log(classObj.spellSlot[dataObj.level])
      //   const spellObj = classObj.spellSlot[dataObj.level];
      //   spellObj.enabled = true
      //   // updateData.data.spells[1] = { max: classObj.spellSlot[1] };
      //   updateData.data.spells = spellObj
      // }
    }
    await actor.update(updateData);
    //if no gold item exists create one then update, else update gold amount
    if (goldItem == undefined) {
      let pack = game.packs.get('OSE-CharacterBuilder.OSE-SRD-items');
      let gpId = pack.index.contents.find((a) => a.name == 'GP')._id;
      const blankGp = await pack.getDocument(gpId);
      await actor.createEmbeddedDocuments('Item', [blankGp.data]);
      goldItem = actor.data.items.getName('GP');
    }
    await goldItem.update({ data: { quantity: { value: dataObj.goldAmount } } });

    // ui.notifications.warn('Adding Class Abilities: Please Be Patient');
    await OSECB.util.OseAddClassAbilities(className, actor, packName);
    // ui.notifications.info('Finished Adding Class Abilities');
    await actor.setFlag('OSE-CharacterBuilder', 'classSelected', true);
    //check for Osr item shop
    // const shopActive = game.settings.get('osr-item-shop', 'charBuilderCheck');

    if (dataObj.shopCheck) {
      // old shop
      // new osrItemShopForm(actor).render(true);
      OSRIS.shop.renderItemShop(actor);
    }
  }
  
}

OSECB.util.shopCheck = async function (html) {
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
}

OSECB.util.OseHelperAddItem = async function (itemName, compName, actor) {
  const compendium = await game.packs.get(compName);
  const index = await compendium.getIndex();
  const entry = await index.find((e) => e.name == itemName);
  const entity = await compendium.getDocument(entry._id);

  const newEntity = await entity.clone();
  actor.createEmbeddedDocuments('Item', [newEntity.data]);
}

//add class abilities to sheet
OSECB.util.OseAddClassAbilities = async function (className, actor, pack) {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const compendium = game.packs.get(pack);
  for (let abil of compendium.index.contents) {  
    const item = await compendium.getDocument(abil._id);
    if (item.data.data.requirements == className) {
      await sleep(50);
      await actor.createEmbeddedDocuments('Item', [item.data]);
    }
  }
}

//capitalize first letter in string
OSECB.util.capitalize = function (s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

//working: bonus experience calculator.
//needs: check for stats, object containing rules per class, logic to use class rule to compare specified stats then add appropriate bonus to the sheet.
OSECB.util.oseBonusXp = async function (actor, reqObj) {
  const scores = actor.data.data.scores;
}
})