import { registerRetainerBuilder } from './retainer-builder.js';
import { initializeUtils } from './util.mjs';
import { osrCharacterBuilder } from './character-builder/character-builder.mjs';
import { registerSrdDataEn } from './data/srd-data-en.mjs';
import { registerSrdDataCn } from './data/srd-data-cn.mjs';
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

  // mirror legacy externalClasses setting writes (e.g. from stock
  // ose-advancedfantasytome) into the in-memory list on every client
  OSRCB.util.syncLegacyExternalClasses = () => {
    const legacy = game.settings.get(OSRCB.moduleName, 'externalClasses') ?? [];
    // drop previously-ingested legacy groups, then re-add current contents
    OSRCB.data.externalClasses = OSRCB.data.externalClasses.filter((g) => !g._legacySetting);
    for (const group of legacy) {
      if (!OSRCB.data.externalClasses.find((g) => g.name === group.name)) {
        OSRCB.data.externalClasses.push({ ...group, _legacySetting: true });
      }
    }
  };
  const onLegacySettingChange = (setting) => {
    if (setting.key === `${OSRCB.moduleName}.externalClasses`) OSRCB.util.syncLegacyExternalClasses();
  };
  Hooks.on('createSetting', onLegacySettingChange); // the first-ever write creates the Setting document
  Hooks.on('updateSetting', onLegacySettingChange); // subsequent writes update it

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
    case 'cn':
      registerSrdDataCn();
      break;
    default:
      registerSrdDataEn();
  }
  // set hook to hide display of foreign language packs
  // await intializePackFolders();
  // hideForeignPacks();

  // class lists are built in memory on EVERY client (OSRCB.data), never stored in settings
  OSRCB.data.externalClasses = [];
  // legacy compat: stock ose-advancedfantasytome pushes onto this setting's
  // existing array — reset each session or it grows by two groups per load
  if (game.user.isGM) await game.settings.set(OSRCB.moduleName, 'externalClasses', []);
  const oseModName = 'old-school-essentials';
  const oseAFName = 'ose-advancedfantasytome';
  // NOTE: these awaits are load-bearing. OSE's classData.js populates
  // OSE.data.classes inside an async ready hook that suspends before the
  // assignment; awaiting here yields to the microtask queue so that hook
  // finishes before we read OSE.data.classes below.
  const oseModActive = await game.modules.get(oseModName)?.active;
  const oseAFActive = await game.modules.get(oseAFName)?.active;

  if (oseAFActive) {
    await Hooks.call('OSE Initialized');
    await OSRCB.util.sleep(1000);
  }
  if (oseModActive) {
    OSRCB.data.defaultClasses = [
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
    ];
  } else {
    OSRCB.data.defaultClasses = [
      {
        name: 'SRD',
        menu: 'SRD',
        default: true,
        classes: OSRCB.data.SRDClassData
      }
    ];
  }
  Hooks.callAll('OseCharacterClassAdded');
  Hooks.callAll('OSRCB Registered');
  // late-join coverage: ingest whatever is already in the legacy setting
  // (clients that connect after AF wrote it missed the hook broadcast)
  OSRCB.util.syncLegacyExternalClasses();
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
