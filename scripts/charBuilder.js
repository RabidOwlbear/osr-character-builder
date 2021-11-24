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
      // return mergeObject(super.defaultOptions, {
      //   classes: ['form', 'osr-cb'],
      //   popOut: true,
      //   template: `modules/OSE-CharacterBuilder/template/test-form.html`,
      //   id: 'osrCharacterBuilder',
      //   title: 'Character Builder',
      //   width: 550,
      //   height: 730
      // });
    }
    getData(options = {}) {
      return super.getData().object; // the object from the constructor is where we are storing the data
    }
    activateListeners(html) {
      console.log('html', html);
      super.activateListeners(html);
      const closeBtn = html.find('#cb-close-btn')[0];
      const goldRerollBtn = html.find('#cb-reroll-gold')[0];
      const statRerollBtn = html.find('#stat-reroll-btn')[0];
      const heroSelect = html.find('#hero-check')[0];
      closeBtn.addEventListener('click', () => {
        this.close();
      });
      goldRerollBtn.addEventListener('click', () => {
        console.log('newGold');
        renderGold(html, this.actor, true);
      });
      statRerollBtn.addEventListener('click', () => {
        console.log('heroCheck', heroSelect.checked, 'newStats');
        renderAbilScores(html, this.actor, true);
      });
      let classTypes = html.find("input[type='radio'][name='classType']");
      for (let type of classTypes) {
        //console.log(type);
        type.addEventListener('input', () => {
          renderClassOptions(html);
        });
      }
      this.html = html;
    }

    async _updateObject(event, formData) {
      this.render();
      console.log(formData);
      oseUpdateSheet(formData, this.actor);
    }
  }
  //console.log(listContent);
  const newForm = new OSECharBuilder(templateData, formOptions, actor);
  await newForm.render(true);
  //console.log('newform', newForm);
  //renderClassOptions(newForm.html);
  // renderClassTypes;
}

//compile html for class source selection
function renderClassTypes(dataObj) {
  //output html content
  let retHTML = ``;
  //loop through the data object
  for (const source in dataObj) {
    current = dataObj[source];
    console.log(source);
    //if header = true create header before list entry
    if (current.header) {
      retHTML += `<div class="cb-list-cat">${current.name}</div>`;
    }
    //add all class categories
    for (let option of current.options) {
      //if option is 'srd' add checked property, else add empty space
      let checked = option.name == 'SRD' ? 'checked' : '';
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
  console.log(actor);
  const goldInp = html.find('#cb-gold-input')[0];
  const actorGold = actor.data.items.getName('GP')?.data?.data?.quantity?.value;
  console.log('input', goldInp, 'aCTORgOLD', actorGold);
  if (actorGold == undefined && !reroll) {
    goldInp.value = 0;
    return;
  }
  if (reroll) {
    console.log('reroll');
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
  console.log(actorScores);
  const statInputs = html.find("input[type='number'][ class='cb-stat-inp']");
  for (let input of statInputs) {
    input.value = scoreObj[input.name].value;
  }
  //console.log('statInpurts', statInputs, actorScores);
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
      //console.log(prev, cur);
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
  const classType = html.find("input[type='radio'][name='classType']:checked")[0].value;
  const classInfoTop = html.find('#cb-info-head')[0];
  const classInfoBody = html.find('#cb-info-body')[0];
  let classListHtml = ``;
  //hacky swap between ose data object and carcass crawler object
  //const dataObj = classType == 'carcassCrawler' ? crawlerData.cc0 : oseClasses[classType];
  const dataObj = getClassOptionObj(classType).classes;
  console.log('dataObj', dataObj);
  let length = Object.keys(dataObj).length;
  let pick = Math.floor(Math.random() * length + 1);
  let count = 1;
  //console.log(pick, count, length);
  for (let entry in dataObj) {
    //console.log('count', count, 'pick', pick);
    let checked = pick == count ? 'checked' : '';

    //console.log(entry);
    const obj = dataObj[entry];
    classListHtml += `<div class="fx-sb cb-list">
    <label for"${obj.name}">${obj.menu}</label>
    <input type="radio" name="classOption" id="${obj.name} - ${obj.req}" value="${obj.name}" + ${checked}>
    </div>`;
    if (checked === 'checked') {
      console.log(classInfoTop);
      classInfoTop.innerHTML = obj.description;
      classInfoBody.innerHTML = obj.notes;
    }
    count++;
  }
  //console.log(classListDiv, classListHtml, classType);
  classListDiv.innerHTML = classListHtml;

  const classRad = html.find("input[type='radio'][name='classOption']");
  // console.log(classRad);
  for (let input of classRad) {
    //console.log(input);
    input.addEventListener('input', () => {
      const classObj = dataObj[input.value];
      // console.log(classInfoTop);
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
    console.log(key);
    let options = optionObj[key].options;
    for (let i = 0; i < options.length; i++) {
      let obj = options[i];
      if (obj.name == classType) {
        console.log('found', obj);
        return obj;
      }
    }
  }
}

async function oseUpdateSheet(formObj, actor) {
  console.log('form obj', formObj);
  const optionObj = game.settings.get('OSE-CharacterBuilder', 'characterClasses');
  const classType = formObj.classType;
  console.log(classType, optionObj);
  const className = formObj.classOption;
  const classData = getClassOptionObj(classType);
  console.log('classdata', classData);
  const classObj = classData.classes[className];
  const packName = classData.pack;
  console.log('packobj', packName, classData);
  let goldItem = actor.data.items.getName('GP');
  // console.log('select data', className, type, classObj);

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
    console.log('<----------------', className, hd);
    let hp = Math.floor(Math.random() * hd + 1);
    updateData.data.hp = {
      hd: `1d${hd}`,
      value: hp,
      max: hp
    };
    // }

    if (classObj.spellCaster) {
      console.log('spell caster');
      updateData.data.spells = { enabled: true };
      //  console.log('after', updateData);
      if (classObj.spellSlot) {
        updateData.data.spells[1] = { max: classObj.spellSlot };
      }
    }
    console.log('updata', updateData);
    await actor.update(updateData);
    //if no gold item exists create one then update, else update gold amount
    if (goldItem == undefined) {
      let pack = game.packs.get('OSE-CharacterBuilder.OSE-SRD-items');
      let gpId = pack.index.contents.find((a) => a.name == 'GP')._id;
      console.log('pack', pack, 'blankGold', gpId);
      const blankGp = await pack.getDocument(gpId);
      await actor.createEmbeddedDocuments('Item', [blankGp.data]);
      goldItem = actor.data.items.getName('GP');
      console.log('goldItem created', goldItem);
    }
    await goldItem.update({ data: { quantity: { value: formObj.goldAmount } } });

    ui.notifications.warn('Adding Class Abilities: Please Be Patient');
    await OseAddClassAbilities(className, actor, packName);
    ui.notifications.info('Finished Adding Class Abilities');
    await actor.setFlag('OSE-CharacterBuilder', 'classSelected', true);
    //check for Osr item shop
    // const shopActive = game.settings.get('osr-item-shop', 'charBuilderCheck');

    if (formObj.shopCheck) {
      new osrItemShopForm(actor).render(true);
    }
  }
}

async function shopCheck(html) {
  const addShopCheck = await game.settings.get('osr-item-shop', 'charBuilderCheck');
  //check for shop
  console.log('shop check status', addShopCheck);
  if (addShopCheck) {
    console.log('shop check enabled');
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
  console.log('entry', entry, entry._id, entry.id);
  const entity = await compendium.getDocument(entry._id);

  const newEntity = await entity.clone();
  console.log('entity', entity, newEntity);
  actor.createEmbeddedDocuments('Item', [newEntity.data]);
}

//add class abilities to sheet
async function OseAddClassAbilities(className, actor, pack) {
  console.log('name', className, 'pack', pack);
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const compendium = game.packs.get(pack);

  console.log('comp', compendium);
  for (let abil of compendium.index.contents) {
    const item = await compendium.getDocument(abil._id);
    // console.log('item', item);
    if (item.data.data.requirements == className) {
      console.log('ability', item.data.name);
      await sleep(500);
      //console.log('entity', entity, newEntity);
      await actor.createEmbeddedDocuments('Item', [item.data]);
    }
  }
}
