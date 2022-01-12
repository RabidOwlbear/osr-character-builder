async function renderCharacterBuilder(actor, dataObj) {
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
    classTypeContent: renderClassTypes(dataObj)
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
      closeBtn.addEventListener('click', () => {
        this.close();
      });
      goldRerollBtn.addEventListener('click', () => {
        
        renderGold(html, this.actor, true);
      });
      statRerollBtn.addEventListener('click', () => {
        
        renderAbilScores(html, this.actor, true);
      });
      let classTypes = html.find("input[type='radio'][name='classType']");
      for (let type of classTypes) {
        
        type.addEventListener('input', () => {
          renderClassOptions(html);
        });
      }
      this.html = html;
    }

    async _updateObject(event, formData) {
      this.render();
      

    // dont know why this is ncessary, temp fix for the issue of formData not recieving the value of the selected radio button

      const classTypeInp = this.html.find("[name='classType']");
      for (let i of classTypeInp){
        if(i.checked){
          formData.classType = i.value
        }
      }

    // end fix 
    
      oseUpdateSheet(formData, this.actor);
    }
  }
  const newForm = new OSECharBuilder(templateData, formOptions, actor);
  await newForm.render(true);
}

//compile html for class source selection
function renderClassTypes(dataObj) {
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

function renderGold(html, actor, reroll = false) {
  const goldInp = html.find('#cb-gold-input')[0];
  const actorGold = actor.data.items.getName('GP')?.data?.data?.quantity?.value;
  if (actorGold == undefined && !reroll) {
    goldInp.value = 0;
    return;
  }
  if (reroll) {
    goldInp.value = oseRollGold();
    return;
  }

  goldInp.value = actorGold;
}

function oseRollGold() {
  let amt = 0;
  for (let i = 0; i < 3; i++) {
    amt += Math.floor(Math.random() * 6 + 1) * 10;
  }
  return amt;
}

function renderAbilScores(html, actor, reroll = false) {
  const heroCheck = html.find('#hero-check')[0].checked;
  const actorScores = actor.data.data.scores;
  const scoreObj = reroll == true ? oseRollStats(heroCheck) : actor.data.data.scores;
  const statInputs = html.find("input[type='number'][ class='cb-stat-inp']");
  for (let input of statInputs) {
    input.value = scoreObj[input.name].value;
  }
}

function oseRollStats(hero = false) {
  let statArr = ['str', 'int', 'wis', 'con', 'dex', 'cha'];
  const retObj = {};
  for (let stat of statArr) {
    retObj[stat] = { value: oseRollStat(hero) };
  }

  return retObj;
}

const oseRollStat = (hero = false) => {
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

function renderClassOptions(html) {
  const classListDiv = html.find('#cb-class-list')[0];
  const classType = html.find("input[type='radio'][name='classType']:checked")[0]?.value;
  const classInfoTop = html.find('#cb-info-head')[0];
  const classInfoBody = html.find('#cb-info-body')[0];
  let classListHtml = ``;
  //hacky swap between ose data object and carcass crawler object
  //const dataObj = classType == 'carcassCrawler' ? crawlerData.cc0 : oseClasses[classType];
  const dataObj = getClassOptionObj(classType).classes;
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
    });
  }
}
//retrieve the relevant class option data object from the game settings option object. requires source category name.
//eg. basic, advanced, SRD
function getClassOptionObj(classType) {
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

async function oseUpdateSheet(formObj, actor) {
  const optionObj = await game.settings.get('OSE-CharacterBuilder', 'characterClasses');
  const classType = formObj.classType;
  const className = formObj.classOption;
  const classData = getClassOptionObj(classType);
  const classObj = classData.classes[className];
  const packName = classData.pack;
  let goldItem = actor.data.items.getName('GP');

  if (className == 'default') {
    ui.notifications.warn('Please Choose A Class');
  } else {
    let updateData = {
      data: {
        details: {
          class: classObj.menu,
          title: classObj.title,
          xp: {
            next: classObj.xp
          },
          description: classObj.description,
          notes: classObj.notes + classObj.journal,
          alignment: formObj.alignment
        },
        saves: {
          death: {
            value: classObj.saves[0]
          },
          wand: {
            value: classObj.saves[1]
          },
          paralysis: {
            value: classObj.saves[2]
          },
          breath: {
            value: classObj.saves[3]
          },
          spell: {
            value: classObj.saves[4]
          }
        },
        languages: {
          value: classObj.languages
        },
        spells: {
          enabled: false
        },
        scores: {
          str: { value: formObj.str },
          int: { value: formObj.int },
          wis: { value: formObj.wis },
          dex: { value: formObj.dex },
          con: { value: formObj.con },
          cha: { value: formObj.cha }
        }
      }
    };
    // if (rollHp) {
    //roll Hp
    let hd = classObj.hd;
    let hp = Math.floor(Math.random() * hd + 1);
    updateData.data.hp = {
      hd: `1d${hd}`,
      value: hp,
      max: hp
    };
    // }

    if (classObj.spellCaster) {
      updateData.data.spells = { enabled: true };
      //  console.log('after', updateData);
      if (classObj.spellSlot) {
        updateData.data.spells[1] = { max: classObj.spellSlot };
      }
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
    await goldItem.update({ data: { quantity: { value: formObj.goldAmount } } });

    ui.notifications.warn('Adding Class Abilities: Please Be Patient');
    await OseAddClassAbilities(className, actor, packName);
    ui.notifications.info('Finished Adding Class Abilities');
    await actor.setFlag('OSE-CharacterBuilder', 'classSelected', true);
    //check for Osr item shop
    // const shopActive = game.settings.get('osr-item-shop', 'charBuilderCheck');

    if (formObj.shopCheck) {
      // old shop
      // new osrItemShopForm(actor).render(true);
      renderItemShop(actor);
    }
  }
}

async function shopCheck(html) {
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

async function OseHelperAddItem(itemName, compName, actor) {
  const compendium = await game.packs.get(compName);
  const index = await compendium.getIndex();
  const entry = await index.find((e) => e.name == itemName);
  const entity = await compendium.getDocument(entry._id);

  const newEntity = await entity.clone();
  actor.createEmbeddedDocuments('Item', [newEntity.data]);
}

//add class abilities to sheet
async function OseAddClassAbilities(className, actor, pack) {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const compendium = game.packs.get(pack);
  for (let abil of compendium.index.contents) {
    const item = await compendium.getDocument(abil._id);
    if (item.data.data.requirements == className) {
      await sleep(500);
      await actor.createEmbeddedDocuments('Item', [item.data]);
    }
  }
}

//capitalize first letter in string
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

//working: bonus experience calculator.
//needs: check for stats, object containing rules per class, logic to use class rule to compare specified stats then add appropriate bonus to the sheet.
async function oseBonusXp(actor, reqObj) {
  const scores = actor.data.data.scores;
}
