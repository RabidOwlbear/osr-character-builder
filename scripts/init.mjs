import { registerRetainerBuilder } from './retainer-builder.js';
import { initializeUtils } from './util.mjs';
import { osrCharacterBuilder } from './character-builder/character-builder.mjs';
import { registerSrdDataEn } from './data/srd-data-en.mjs';
import { registerSrdDataEs } from './data/srd-data-es.mjs';
import { hideForeignPacks, intializePackFolders } from './util.mjs';
import { registerSettings } from './settings.mjs';
import { socket } from './cb-socket.mjs';
import { OSRCharacterBuilderV2 } from './character-builder/character-buillder-v2.mjs';
import { randomName } from './random-name.mjs';
Hooks.once('init', async () => {
  //register namespace
  window.OSRCB = window.OSRCB || {};
  OSRCB.moduleName = `osr-character-builder`;
  OSRCB.util = OSRCB.util || {};
  OSRCB.data = OSRCB.data || {
    externalClasses: []
  };
  OSRCB.spells = OSRCB.spells || { mergedList: {} };
  OSRCB.spells.mergedList = {};
  OSRCB.characterBuilder = osrCharacterBuilder;
  OSRCB.lang = ['en', 'es'];
  OSRCB.socket = socket;
  OSRCB.characterBuilderV2 = OSRCharacterBuilderV2;
  socket.registerSocket();
  OSRCB.randomName = randomName;

  // import modules
  //registerCharacterBuilder();

  registerRetainerBuilder();
  initializeUtils();
  registerSettings();
  Hooks.callAll('OSRCB initialized');
});
Hooks.once('ready', async () => {
  switch (game.i18n.lang) {
    case 'en':
      registerSrdDataEn();
      break;
    case 'es':
      registerSrdDataEs();
      break;
    default:
      registerSrdDataEn();
  }
  // set hook to hide display of foreign language packs
  // await intializePackFolders();
  // hideForeignPacks();

  //reset external classes
  if (game.user.isGM) await game.settings.set(`${OSRCB.moduleName}`, 'externalClasses', []);
  const oseModName = 'old-school-essentials';
  const oseAFName = 'ose-advancedfantasytome';
  const oseModActive = await game.modules.get(oseModName)?.active;
  const oseAFActive = await game.modules.get(oseAFName)?.active;

  const srdObj = {};
  if (OSRCB.singleGM()) {
    if (oseAFActive) {
      await Hooks.call('OSE Initialized');
      OSRCB.util.sleep(1000)
      
      const classData = [
        {
          name: 'classic',
          menu: 'Classic',
          classes: OSE.data.classes.classic
        },
        {
          name: 'advanced',
          menu: 'Advanced',
          classes: OSE.data.classes.advanced
        }
      ];
      OSRCB.util.addExternalClasses(classData, 'Advanced Fantasy', true);
    }
    // await game.settings.set('osr-character-builder', 'externalClasses', OSRCB.data.externalClasses);
    //temp shim
    if (oseModActive) {
      await game.settings.set('osr-character-builder', 'defaultClasses', [
        {
          name: 'basic',
          menu: 'OSE Basic',
          default: true,
          classes: OSE.data.classes.basic
        },
        {
          name: 'advanced',
          menu: 'OSE Advanced',
          default: false,
          classes: OSE.data.classes.advanced
        }
      ]);
    } else {
      await game.settings.set('osr-character-builder', 'defaultClasses', [
        {
          name: 'SRD',
          menu: 'SRD',
          default: true,
          classes: OSRCB.data.SRDClassData
        }
      ]);
    }
    Hooks.callAll('OseCharacterClassAdded');
    Hooks.callAll('OSRCB Registered');
  }
});

//on actor sheet load, add helper buttons to sheet
Hooks.on('renderActorSheet', (actorObj, html) => {
  const actor = actorObj.actor;
  const modBox = html.find(`[class="modifiers-btn"]`);
  const defCharBtn = html.find(`.profile .blinking`)[0];
  if (defCharBtn) defCharBtn.style.display = 'none';
  const classSelected = actor.getFlag(`${OSRCB.moduleName}`, 'classSelected');

  if (actor.system?.scores?.str?.value == 0) {
    modBox.append(
      `<a class="osr-icon osr-choose-class" title="Character Builder"><i class="fas fa-user-shield"></i></a>`
    );
    modBox.on('click', '.osr-choose-class', async (event) => {
      const dataObj = OSRCB.util.mergeClassOptions();
      OSRCB.util.renderCharacterBuilder(actor, dataObj);
    });
  }
});
