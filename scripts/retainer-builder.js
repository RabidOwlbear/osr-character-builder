import { RetainerBuilderV2 } from './retainer-builder-v2.mjs';
export async function registerRetainerBuilder() {
  OSRCB.util.renderRetainerBuilder = async function (actor) {
    new RetainerBuilderV2({ actor }).render(true);
  };
  OSRCB.util.retainerGen = async function (data) {
    let { level } = data;
    // if (data.classType == 'none') {
    //   ui.notifications.warn(game.i18n.localize("osr-character-builder.notification.selectClass"));
    //   return null;
    // }
    if (data.classType == 'SRD') {
      data.classType = OSRCB.util.oseActive() ? '' : 'SRD';
    }
    let statObj = await OSRCB.util.rollStats(false, true);

    const alignment = ['lawful', 'neutral', 'chaotic'];
    data.alignment = alignment[Math.floor(Math.random() * alignment.length)];
    data.goldAmount = Math.floor(Math.random() * 13 + 2);
    data.retainer = true;
    foundry.utils.mergeObject(data, statObj);

    let folder = game.folders.getName('Retainers');
    if (!folder) {
      await Folder.create([{ name: 'Retainers', type: 'Actor', color: '#a02e9d' }]);
      folder = game.folders.getName('Retainers');
    }

    const newActor = await Actor.create({
      name: `#randGen`,
      type: 'character',
      folder: folder.id
    });

    await OSRCB.util.osrUpdateSheet(data, newActor);
    return newActor;
  };

  /*
      {
        number: 1, number of retainers to create
        maxLvl: 1, 
        minLvl: 10, 
        items: true, add items
        spells: true, add spells
      }
  */

  OSRCB.util.randomRetainers = async function (options, classSource = 'SRD') {
    const ose = OSRCB.util.oseActive();
    const oseAf = OSRCB.util.oseAfActive();
    let displayAdvanced = false;
    let { number, randomNumber, maxLvl, minLvl, items, spells, randomName } = options;
    // let isZero = maxLvl === 0 && minLvl === 0
    if (ose || oseAf) displayAdvanced = true;
    const advanced = [
      'acrobat',
      'assassin',
      'barbarian',
      'bard',
      'drow',
      'druid',
      'duergar',
      'gnome',
      'half-elf',
      'half-orc',
      'illusionist',
      'knight',
      'paladin',
      'ranger',
      'svirfneblin'
    ];
    const basic = ['cleric', 'dwarf', 'elf', 'fighter', 'halfling', 'magic-user', 'thief'];
    let classOptions = basic;
    let source = classSource;

    if ((classSource == 'advanced' && displayAdvanced) || (classSource == 'advanced-fantasy' && displayAdvanced))
      classOptions = advanced;
    if (classSource == 'mixed' && displayAdvanced) classOptions = advanced.concat(basic);
    // if(isZero){
    //   source = 'none';
    //   classOptions = ['none']
    // }

    if (randomNumber) {
      let newNum = Math.floor(Math.random() * number + 1);
      number = newNum;
    }

    for (let i = 0; i < number; i++) {
      let diff = maxLvl - minLvl;

      let randNum = Math.floor(Math.random() * (diff + 1)) + minLvl;
      let randLvl = randNum == 0 ? 1 : randNum;

      const data = {
        level: minLvl == maxLvl ? minLvl : randNum,
        source: source,
        classOption: classOptions[Math.floor(Math.random() * classOptions.length)]
      };
      const isZero = data.level === 0;
      if (isZero) {
        data.source = 'none';
        data.classOption = ['none'];
      }
      const newRetainer = await OSRCB.util.retainerGen(data);
      data.level = newRetainer.system.details.level;
      // random name support
      if (randomName && game.modules.get('osr-helper')?.active) {
        let classObj = isZero ? null : OSRCB.util.getClassOptionObj(data.source).classes[data.classOption];
        let nameType = isZero ? 'human' : classObj.nameType;
        let name = OSRH.util.randomName(nameType);

        const oldName = newRetainer.name;
        await newRetainer.update({ name: `${name} ${oldName}`, prototypeToken: { name: name, actorLink: true } });
      }
      if (!isZero && spells) await OSRCB.util.randomSpells(data, newRetainer);
      if (items) await OSRCB.util.randomItems(data, newRetainer);
    }
  };

  class RetainerBuilder extends FormApplication {
    constructor(actor) {
      super();
      this.actor = actor;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ['retainer-builder'],
        popOut: true,
        template: `modules/${OSRCB.moduleName}/template/retainerBuilder.hbs`,
        height: 220,
        width: 300,
        id: 'retainer-builder',
        title: game.i18n.localize('osr-character-builder.retainerBuilder')
      });
    }

    getData() {
      // Send data to the template
      let tData = {
        option: [
          { name: `${game.i18n.localize('osr-character-builder.none')}`, value: 'none.none' },
          { name: `--${game.i18n.localize('osr-character-builder.basic')}--`, value: 'SRD.none' },
          { name: `${game.i18n.localize('osr-character-builder.cleric')}`, value: 'SRD.cleric' },
          { name: `${game.i18n.localize('osr-character-builder.dwarf')}`, value: 'SRD.dwarf' },
          { name: `${game.i18n.localize('osr-character-builder.elf')}`, value: 'SRD.elf' },
          { name: `${game.i18n.localize('osr-character-builder.fighter')}`, value: 'SRD.fighter' },
          { name: `${game.i18n.localize('osr-character-builder.halfling')}`, value: 'SRD.halfling' },
          { name: `${game.i18n.localize('osr-character-builder.magic')}-user`, value: 'SRD.magic-user' },
          { name: `${game.i18n.localize('osr-character-builder.thief')}`, value: 'SRD.thief' }
        ],
        randName: ``
      };
      let helperActive = game.modules.get('osr-helper')?.active;
      if (helperActive) {
        tData.randName = `
        <div>
          <label for="randName">${game.i18n.localize('osr-character-builder.name')}</label>
          <input class="padh10" id="randName" type="checkbox" checked>
        </div>
        `;
      }

      let oseAf = OSRCB.util.oseAfActive();
      let ose = OSRCB.util.oseActive();
      if (ose || oseAf) {
        let source = !ose && oseAf ? 'advanced-fantasy' : 'advanced';

        let opt = [
          { name: `${game.i18n.localize('osr-character-builder.none')}`, value: 'none.none' },
          { name: `--${game.i18n.localize('osr-character-builder.Advanced')}--`, value: `${source}.none` },
          { name: `${game.i18n.localize('osr-character-builder.acrobat')}`, value: `${source}.acrobat` },
          { name: `${game.i18n.localize('osr-character-builder.assassin')}`, value: `${source}.assassin` },
          { name: `${game.i18n.localize('osr-character-builder.barbarian')}`, value: `${source}.barbarian` },
          { name: `${game.i18n.localize('osr-character-builder.bard')}`, value: `${source}.bard` },
          { name: `${game.i18n.localize('osr-character-builder.drow')}`, value: `${source}.drow` },
          { name: `${game.i18n.localize('osr-character-builder.druid')}`, value: `${source}.druid` },
          { name: `${game.i18n.localize('osr-character-builder.duergar')}`, value: `${source}.duergar` },
          { name: `${game.i18n.localize('osr-character-builder.gnome')}`, value: `${source}.gnome` },
          { name: `${game.i18n.localize('osr-character-builder.halfElf')}`, value: `${source}.half-elf` },
          { name: `${game.i18n.localize('osr-character-builder.halfOrc')}`, value: `${source}.half-orc` },
          { name: `${game.i18n.localize('osr-character-builder.illusionist')}`, value: `${source}.illusionist` },
          { name: `${game.i18n.localize('osr-character-builder.knight')}`, value: `${source}.knight` },
          { name: `${game.i18n.localize('osr-character-builder.paladin')}`, value: `${source}.paladin` },
          { name: `${game.i18n.localize('osr-character-builder.ranger')}`, value: `${source}.ranger` },
          { name: `${game.i18n.localize('osr-character-builder.svirfneblin')}`, value: `${source}.svirfneblin` }
        ];
        tData.option = tData.option.concat(opt);
      }
      return tData;
    }

    activateListeners(html) {
      super.activateListeners(html);
      const lvlInput = html.find('#level')[0];
      const selectInput = html.find('#class-select')[0];
      this.html = html;

      lvlInput.addEventListener('change', async () => {
        if (!selectInput.value == '') {
          let classInput = selectInput?.value.split('.');
          let classType = classInput[0];
          let classOption = classInput[1];
          if (classType == 'SRD') {
            classType = OSRCB.util.oseActive() ? 'basic' : 'SRD';
          }

          const dataObj = OSRCB.util.getClassOptionObj(classType).classes;
          const classObj = dataObj[classOption];
          if (lvlInput.valueAsNumber > classObj.maxLvl) {
            lvlInput.value = classObj.maxLvl;
          }
        }
      });
      selectInput.addEventListener('change', async () => {
        if (!selectInput.value == '') {
          let classInput = selectInput.value.split('.');
          let classType = classInput[0];
          let classOption = classInput[1];
          if (classType == 'SRD') {
            classType = OSRCB.util.oseActive() ? 'basic' : 'SRD';
          }
          const dataObj = OSRCB.util.getClassOptionObj(classType)?.classes;
          const classObj = dataObj[classOption];
          if (lvlInput.valueAsNumber > classObj?.maxLvl) {
            lvlInput.value = classObj.maxLvl;
          }
        }
      });
    }
    async _updateObject(event, formData) {
      event.preventDefault();
      formData.level = this.html.find('#level')[0].valueAsNumber;
      formData.spellCheck = this.html.find('#spells')[0].checked;
      formData.itemsCheck = this.html.find('#items')[0].checked;
      formData.randName = this.html.find('#randName')[0]?.checked;
      let selectData = formData['class-select'].split('.');
      formData.classType = selectData[0];
      formData.classOption = selectData[1];
      formData.source = selectData[0];
      formData.retainer = true;

      if (formData.source !== 'none' && formData.classOption === 'none') {
        ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.chooseClass'));
        return;
      }

      const newRetainer = await OSRCB.util.retainerGen(formData);
      if (formData.spellCheck && newRetainer) {
        OSRCB.util.randomSpells(formData, newRetainer);
      }
      if (formData.itemsCheck && newRetainer) {
        OSRCB.util.randomItems(formData, newRetainer);
      }
      if (formData.randName && newRetainer) {
        let classObj = OSRCB.util.getClassOptionObj(formData.classType)?.classes[formData.classOption];

        let name = classObj ? OSRH.util.randomName(classObj.nameType) : OSRH.util.randomName('human');
        const oldName = newRetainer.name;
        await newRetainer.update({ name: `${name} ${oldName}`, prototypeToken: { name: name, actorLink: true } });
      }
    }
  }
}
