import { OSRCBApplication } from '../osrcb-app.mjs';
import { CONST } from '../const.mjs';
import { randomName } from '../random-name.mjs';
export class OSRCharacterBuilderV2 extends OSRCBApplication {
  constructor(options = {}) {
    super(options);
    this.actor = options.actor;
    this.dataObj = options.dataObj;
  }
  static DEFAULT_OPTIONS = {
    id: 'osr-character-builder',
    classes: ['osrcb', 'osrcb-app'],
    position: {
      width: 500,
      height: 500
    },
    tag: 'div',
    window: {
      title: 'OSR Character Builder',
      icon: 'fas fa-book-open',
      resizable: false
    },
    tabs: [
      {
        navSelector: '.tabs',
        contentSelector: '.tab-content',
        initial: 'basic'
      }
    ],
    actions:{
      rollSingleStat: OSRCharacterBuilderV2.rollSingleStat,
      rollAbilScores: OSRCharacterBuilderV2.rollAbilScores,
      rollGold: OSRCharacterBuilderV2.rollGold,
      selectClass: OSRCharacterBuilderV2.selectClass,
      rollName: OSRCharacterBuilderV2.rollName,
      close: OSRCharacterBuilderV2.close
    }
  };
  static PARTS = {
    form: {
      template: `modules/${CONST.moduleName}/template/character-builder/character-builder.hbs`,
    },
  };

  async _prepareContext(options) {
    const itemShop = game.modules?.get('osr-item-shop')?.active;
    let context = await super._prepareContext(options);
    context = foundry.utils.mergeObject(context, {
      actor: this.actor,
      classData: this.dataObj,
      addShopCheck: itemShop,
      gp: this.actor.items.getName(game.i18n.localize('osr-character-builder.gp'))?.system.quantity.value || 0,
    });

    return context;
  }
  _onRender(context, options) {
    const html = this.element;
    const nameInp = html.querySelector('#name-inp');
    const levelInp = html.querySelector('#level-inp');
    const sourceSelect = html.querySelector('#source-select');
    const classSelect = html.querySelector('#class-select');
    const statInps = html.querySelectorAll('.stat-inp');
    const shopCheck = html.querySelector('#shop-check-inp');
    const gpInput = html.querySelector('#gold-inp');
    const selectedClass = this.actor.flags[`${OSRCB.moduleName}`]?.classInfo;

    nameInp.addEventListener('change', (e) => {
      e.preventDefault();
      if (!nameInp.value.length) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.invalidNameB'));
        nameInp.value = game.i18n.localize('osr-character-builder.characterName');
      }
    });

    levelInp.addEventListener('change', (e) => {
      e.preventDefault();
      if (!parseInt(levelInp.value)) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.invalidLvl'));
        levelInp.value = 1;
        return;
      }
      if (classSelect.value != 'none') {
        const source = OSRCB.util.getClassOptionObj(sourceSelect.value);
        const classObj = source.classes[classSelect.value];
        if (parseInt(levelInp.value) > parseInt(classObj.maxLvl)) {
          levelInp.value = classObj.maxLvl;
        }
      }
    });
    gpInput.addEventListener('change', (e) => {
      e.preventDefault;
      let value = parseInt(gpInput.value);
      if (!value) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.invalidGp'));
        gpInput.value = 0;
      }
    });
    sourceSelect.addEventListener('change', (e) => {
      e.preventDefault();
      this._renderClassOptions(classSelect, sourceSelect.value);
      this._renderInitialClassInfo(html);
    });
    classSelect.addEventListener('change', (e) => {
      e.preventDefault();

      this._renderClassInfo(html, sourceSelect.value, e.target.value);

      levelInp.dispatchEvent(new Event('change'));
    });
    for (let input of statInps) {
      input.addEventListener('change', (e) => {
        e.preventDefault();
        let warning = `${game.i18n.localize(
          'osr-character-builder.notification.invalid'
        )} ${input.dataset.stat.toUpperCase()} ${game.i18n.localize(
          'osr-character-builder.notification.invalidStatEntry'
        )}`;
        let val = parseInt(input.value);
        if (!val && val !== 0) {
          ui.notifications.warn(warning);
          input.value = 0;  
        }
        if (val > 18) {
          ui.notifications.warn(warning);
          input.value = 18;
        }
      });
    }

    //render selected class
    if (selectedClass) {
      const ose = game.modules.get('old-school-essentials')?.active;
      if (ose && selectedClass.source == 'SRD') selectedClass.source = 'OSE-basic';
      this._renderClassOptions(classSelect, selectedClass.source);
      this._renderClassInfo(html, selectedClass.source, selectedClass.class);
      sourceSelect.value = selectedClass.source;
      classSelect.value = selectedClass.class;
    } else {
      this._renderClassOptions(classSelect, sourceSelect.value);
      this._renderInitialClassInfo(html);
    }
    
  }

  _renderClassOptions(selectEl, sourceName) {
    selectEl.innerHTML = '';
    let classInfo = this.actor.flags['osr-character-builder']?.classInfo;
    if (sourceName !== 'none') {
      const classList = this.dataObj.find((s) => s.name === sourceName)?.classes;
      if (!classList) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.classOptsNotFound'));
        return;
      }
      for (let option in classList) {
        const classOpt = classList[option];
        let optionEl = document.createElement(`option`);
        optionEl.value = classOpt.name;
        optionEl.innerText = classOpt.menu;

        selectEl.appendChild(optionEl);
      }
    }
  }
  async _renderClassInfo(html, sourceName, className) {
    const bioEl = html.querySelector(`#bio`);
    const descripEl = html.querySelector(`#description`);
    if (sourceName === 'none') {
      bioEl.innerHTML = '';
      descripEl.innerHTML = '';
    } else {
      const classData = this.dataObj.find((s) => s.name === sourceName)?.classes?.[className];
      const abilities = await OSRCB.util.getClassAbilities(classData.menu, classData.pack);
      if (!classData) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.classDataNotFound'));
        return;
      }
      bioEl.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this._generateBio(classData));
      this._generateBioAbilities(bioEl, abilities);
      descripEl.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(classData.description, abilities);
    }
  }
  _renderInitialClassInfo(html) {
    const sourceSelect = html.querySelector('#source-select');
    const classSelect = html.querySelector('#class-select');
    const source = sourceSelect.value;
    let className = 'none';
    let flagData = this.actor.flags['osr-character-builder']?.classInfo;
    if (flagData) {
    }
    if (source !== 'none') {
      const classObj = this.dataObj.find((i) => i.name === sourceSelect.value)?.classes;
      let classes = Object.keys(classObj);
      className = classes[Math.floor(Math.random() * classes.length)];
      classSelect.value = className;
    }
    this._renderClassInfo(html, sourceSelect.value, className);
  }
  async _rollSingleScore(input, hero = false) {
    const roll = await OSRCB.util.rollSingleStat(hero, true);
    input.value = roll;
    const statsToMsg = await game.settings.get(`${CONST.moduleName}`, 'statRollMessage');

    if (statsToMsg) {
      OSRCB.util.statsToMsg(
        {
          stat: input.name,
          actor: this.actor,
          result: roll,
          type: hero
            ? game.i18n.localize('osr-character-builder.4d6DL')
            : game.i18n.localize('osr-character-builder.3d6S')
        },
        true
      );
    }
  }
  async _rollAbilScores(html, actor) {
    const heroCheck = game.settings.get(`${OSRCB.moduleName}`, 'heroStat');
    // const heroCheck = html.find('#hero-roll-inp')[0].checked;
    const scoreObj = await OSRCB.util.rollStats(heroCheck);
    const statInputs = html.querySelectorAll("input[type='number'][ class='stat-inp']");
    for (let input of statInputs) {
      input.value = scoreObj[input.name].value;
    }
    const statsToMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage');
    if (statsToMsg) {
      OSRCB.util.statsToMsg({
        stats: scoreObj,
        actor: actor,
        type: heroCheck
          ? game.i18n.localize('osr-character-builder.4d6DL')
          : game.i18n.localize('osr-character-builder.3d6S')
      });
    }
  }
  
  _rollGold = async function (gpInput) {
    let amt = 0;
    const roll = await new Roll('3d6').evaluate();
    game?.dice3d?.showForRoll(roll);
    amt = roll.total * 10;
    // for (let i = 0; i < 3; i++) {
    //   amt += Math.floor(Math.random() * 6 + 1) * 10;
    // }
    const content = `<details><summary>${game.user.name} ${game.i18n.localize('osr-character-builder.rolledGold')} ${
      this.actor.name
    }</summary><br><br><div><b>${game.i18n.localize('osr-character-builder.result')}:</b> ${roll.total} x 10 = ${
      parseInt(roll.total) * 10
    }</details>`;
    gpInput.value = amt;
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: content,
      whisper: game.users.filter((u) => u.isGM)
    });
  };
  _generateBio = function (classObj) {
    let languages = ``;
    classObj.languages.map((i) => (languages += `${i}, `));
    const biography = `
    <div class = bio-data>
    <b>${game.i18n.localize('osr-character-builder.requirements')}</b>: ${classObj.req} <br>
    <b>${game.i18n.localize('osr-character-builder.primeRequisite')}</b>: ${classObj.primeReq} <br>
    <b>${game.i18n.localize('osr-character-builder.hitDice')}</b>: ${classObj.hd} <br>
    <b>${game.i18n.localize('osr-character-builder.maxLevel')}</b>:${classObj.maxLvl} <br>
    <b>${game.i18n.localize('osr-character-builder.armour')}</b>: ${classObj.armorTypes} <br>
    <b>${game.i18n.localize('osr-character-builder.weapons')}</b>: ${classObj.weaponTypes} <br>
    <b>${game.i18n.localize('osr-character-builder.languages')}</b>: ${languages} <br>
    <b>${game.i18n.localize('osr-character-builder.classFeatures')}</b>:<br>
    </div>
    <div class="bio-abilities"></div>
    `;
    return biography;
  };
  _generateBioAbilities(element, items) {
    if (!items) return;
    const container = element.querySelector('.bio-abilities');
    for (let item of items) {
      const el = document.createElement('a');
      const img = document.createElement('img');
      img.src = item.img;
      el.appendChild(img);
      el.classList.add('ability-btn');
      el.title = item.name;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        item.sheet.render(true);
      });
      container.appendChild(el);
    }
  }
  _validateFormInputs(ev) {
    const html = this.element;
    const nameInp = html.querySelector('#name-inp');
    const levelInp = html.querySelector('#name-inp');
    const sourceSelect = html.querySelector('#source-select');
    const classSelect = html.querySelector('#class-select');
    const source = sourceSelect.value;
    const selectedClass = classSelect.value;
    const gpInput = html.querySelector('#gold-inp');
    const statInps = html.querySelectorAll('.stat-inp');
    const shopCheck = html.querySelector('#shop-check-inp')?.checked;
    const classData = this.dataObj.find((i) => i.name === source).classes[selectedClass];
    for (let input of statInps) {
      let value = parseInt(input.value);
      if (!value || value < 3 || value > 18) {
        ui.notifications.warn(
          `${game.i18n.localize('osr-character-builder.notification.invalid')} ${
            input.dataset.stat
          } ${game.i18n.localize('osr-character-builder.notification.invalidStatEntry')}`
        );
        return;
      }
    }
    if (!nameInp.value.length) {
      ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.invalidNameB'));
      return;
    }
    if (parseInt(levelInp.value) > classData.maxLvl) {
      levelInp.value = classData.maxLvl;
    }
    if (shopCheck && parseInt(gpInput.value) === 0) {
      ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.rollGold'));
      return;
    }
    const form = this.element.querySelector('#char-builder-form');
    const formData = new FormData(form);
    if(formData)

    return formData;
  }


  async _updateObject(event, formData) {
    event.preventDefault();

    await OSRCB.util.osrUpdateSheet(formData, this.actor);
    if (formData.spellCheck) {
      await OSRCB.util.randomSpells(formData, this.actor);
    }
  }
  static async close(ev) {
    ev.preventDefault();
    this.close();
  }

  static async rollSingleStat(ev){
    ev.preventDefault();
    const heroCheck = game.settings.get(`${OSRCB.moduleName}`, 'heroStat');
    let container = ev.target.closest('.stat-input-col');
    let input = container.querySelector('.stat-inp');
    this._rollSingleScore(input, heroCheck);
  }
  static async rollAbilScores(ev){
    ev.preventDefault();
    this._rollAbilScores(this.element, this.actor);
  }
  static async rollGold(ev){
    const gpInput = this.element.querySelector('#gold-inp');
    ev.preventDefault();
    this._rollGold(gpInput);
  }
  static async selectClass(ev){
    ev.preventDefault();
    const formData = this._validateFormInputs(this.element);
    const dataObj = {};
    formData.forEach((value, key) => (dataObj[key] = value));
    dataObj.spellCheck = dataObj.spellCheck === 'on';
    await OSRCB.util.osrUpdateSheet(dataObj, this.actor);
    if (dataObj.spellCheck) {
      await OSRCB.util.randomSpells(dataObj, this.actor);
    }
    this.close();
  }
  static async rollName(ev){
    ev.preventDefault();
    if (foundry.applications.instances.get("osrcb-random-name"))return
    randomName({creator: true});
  }
}
