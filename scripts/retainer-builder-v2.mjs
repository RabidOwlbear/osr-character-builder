import { OSRCBApplication } from './osrcb-app.mjs';
import { CONST } from './const.mjs';

export class RetainerBuilderV2 extends OSRCBApplication {
  constructor(options = {}) {
    super(options);
    this.actor = options.actor;
  }
  static DEFAULT_OPTIONS = {
    id: 'retainer-builder',
    classes: ['retainer-builder', 'osrcb'],
    position: {
      width: 220,
      height: 300
    },
    tag: 'retainer-builder',
    window: {
      title: 'Retainer Builder',
      icon: 'fas fa-user-shield'
    },
    actions: {
      generate: RetainerBuilderV2.generate,
    }
  };
  static PARTS = {
    form: {
      template: `modules/${CONST.moduleName}/template/retainerBuilder.hbs`
    }
  };
  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    let helperActive = game.modules.get('osr-helper')?.active;
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
    context = foundry.utils.mergeObject(context, tData);
    return context;
  }
  _onRender(context, options) {
    const html = this.element;
    const lvlInput = html.querySelector('#level');
    const selectInput = html.querySelector('#class-select');

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
  static async generate(event) {
    event.preventDefault();
    const selectInput = this.element.querySelector('#class-select');
    let selectData = selectInput.value.split('.');
    const data = {
      level: this.element.querySelector('#level').valueAsNumber,
      spellCheck: this.element.querySelector('#spells').checked,
      itemsCheck: this.element.querySelector('#items').checked,
      randName: this.element.querySelector('#randName')?.checked || false,
      classType: selectData[0],
      classOption: selectData[1],
      source: selectData[0],
      retainer: true  
    }
    if (data.source !== 'none' && data.classOption === 'none') {
      ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.chooseClass'));
      return;
    }
    const newRetainer = await OSRCB.util.retainerGen(data);
    if (data.spellCheck && newRetainer) {
      OSRCB.util.randomSpells(data, newRetainer);
    }
    if (data.itemsCheck && newRetainer) {
      OSRCB.util.randomItems(data, newRetainer);
    }
    if (data.randName && newRetainer) {
      let classObj = OSRCB.util.getClassOptionObj(data.classType)?.classes[data.classOption];
      let name = classObj ? OSRH.util.randomName(classObj.nameType) : OSRH.util.randomName('human');
      const oldName = newRetainer.name;
      await newRetainer.update({ name: `${name} ${oldName}`, prototypeToken: { name: name, actorLink: true } });
    }
  }
}
