export class osrCharacterBuilder extends FormApplication {
  constructor(actor, dataObj) {
    super();
    this.actor = actor;
    this.dataObj = dataObj;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'character-builder',
      classes: ['osrcb'],
      popOut: true,
      template: `modules/${OSRCB.moduleName}/template/character-builder/character-builder.hbs`,
      id: 'osr-character-builder',
      title: game.i18n.localize('osr-character-builder.cb'),
      width: 500,
      height: 500
    });
  }
  getData() {
    const itemShop = game.modules?.get('osr-item-shop')?.active;
    const context = super.getData();
    context.addShopCheck = itemShop; //? game.modules?.get('osr-item-shop', 'charBuilderCheck') : false;
    context.actor = this.actor;
    context.classData = this.dataObj;
    context.gp = this.actor.items.getName(game.i18n.localize('osr-character-builder.gp'))?.system.quantity.value || 0;
    return context;
  }
  activateListeners(html) {
    super.activateListeners(html);
    const selectedClass = this.actor.flags[`${OSRCB.moduleName}`]?.classInfo;
    const form = html[0];
    const nameInp = html.find('#name-inp')[0];
    const levelInp = html.find('#level-inp')[0];
    const singleStatRollBtns = html.find('.single-stat-roll-btn');
    const statInps = html.find('.stat-inp');
    const rollStatInp = html.find('.roll-stats-btn')[0];
    const sourceSelect = html.find('#source-select')[0];
    const classSelect = html.find('#class-select')[0];
    const gpInput = html.find('#gold-inp')[0];
    const rollGpBtn = html.find('.roll-gp-btn')[0];
    const heroCheck = game.settings.get(`${OSRCB.moduleName}`, 'heroStat');
    // const heroCheck = html.find('#hero-roll-inp')[0];
    const chooseBtn = html.find('#choose-btn')[0];
    const closeBtn = html.find('#close-btn')[0];

    nameInp.addEventListener('change', (e) => {
      e.preventDefault();
      if (!nameInp.value.length) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.invalidName'));
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

    for (let button of singleStatRollBtns) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        let container = e.target.closest('.stat-input-col');
        let input = container.querySelector('.stat-inp');
        this._rollSingleScore(input, heroCheck);
        // this._rollSingleScore(input, heroCheck.checked);
      });
    }
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
    rollStatInp.addEventListener('click', (e) => {
      e.preventDefault();
      this._rollAbilScores(html, this.actor);
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
    rollGpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this._rollGold(gpInput);
    });
    gpInput.addEventListener('change', (e) => {
      e.preventDefault;
      let value = parseInt(gpInput.value);
      if (!value) {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.invalidGp'));
        gpInput.value = 0;
      }
    });
    chooseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let formData = new FormData(form);
      let formObj = {};
      for (const [key, value] of formData) {
        formObj[key] = value;
      }
      this._validateFormInputs(html);
    });
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.close();
    });

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
  async _updateObject(event, formData) {
    event.preventDefault();

    await OSRCB.util.osrUpdateSheet(formData, this.actor);
    if (formData.spellCheck) {
      await OSRCB.util.randomSpells(formData, this.actor);
    }
  }
  _validateFormInputs(html) {
    const nameInp = html.find('#name-inp')[0];
    const levelInp = html.find('#name-inp')[0];
    const sourceSelect = html.find('#source-select')[0];
    const classSelect = html.find('#class-select')[0];
    const source = sourceSelect.value;
    const selectedClass = classSelect.value;
    const gpInput = html.find('#gold-inp')[0];
    const statInps = html.find('.stat-inp');
    const shopCheck = html.find('#shop-check-inp')[0]?.checked;
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
    this.submit();
  }
  _renderInitialClassInfo(html) {
    const sourceSelect = html.find('#source-select')[0];
    const classSelect = html.find('#class-select')[0];
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
    const statsToMsg = await game.settings.get(`${OSRCB.moduleName}`, 'statRollMessage');

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
    const statInputs = html.find("input[type='number'][ class='stat-inp']");
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
    const bioEl = html.find(`#bio`)[0];
    const descripEl = html.find(`#description`)[0];
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
      bioEl.innerHTML = await TextEditor.enrichHTML(this._generateBio(classData));
      this._generateBioAbilities(bioEl, abilities);
      descripEl.innerHTML = await TextEditor.enrichHTML(classData.description, abilities);
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
}
