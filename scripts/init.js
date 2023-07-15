import { registerRetainerBuilder } from './retainer-builder.js';
import { initializeUtils } from './util.mjs';
import { osrCharacterBuilder } from './character-builder/character-builder.mjs';
import { registerSrdDataEn } from './data/srd-data-en.mjs';
import { registerSrdDataEs } from './data/srd-data-es.mjs';
import { hideForeignPacks, intializePackFolders} from './util.mjs';
window.OSRCB = window.OSRCB || {
  moduleName: `osr-character-builder`
};
Hooks.once('init', async () => {
  //register namespace
  window.OSRCB = window.OSRCB || {};
  OSRCB.util = OSRCB.util || {};
  OSRCB.data = OSRCB.data || {};
  OSRCB.spells = OSRCB.spells || { mergedList: {} };
  OSRCB.spells.mergedList = {};
  OSRCB.characterBuilder = osrCharacterBuilder;

  // import modules
  //registerCharacterBuilder();

  registerRetainerBuilder();
  initializeUtils();

  console.log('OSR-Character-Builder Loaded.');
  await game.settings.register(`${OSRCB.moduleName}`, 'externalClasses', {
    name: 'externalClasses',
    type: Array,
    default: [],
    scope: 'world'
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'defaultClasses', {
    name: 'defaultClasses',
    type: Array,
    default: [],
    scope: 'world'
  });

  await game.settings.register(`${OSRCB.moduleName}`, 'spellList', {
    name: 'spellList',
    type: Object,
    default: {},
    scope: 'world'
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'statRollMessage', {
    name: game.i18n.localize("osr-character-builder.setting.chatRoll"),
    hint: game.i18n.localize("osr-character-builder.setting.chatRollHint"),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'whisperStatRollMessage', {
    name: game.i18n.localize("osr-character-builder.setting.gmRoll"),
    hint: game.i18n.localize("osr-character-builder.setting.gmRollHint"),
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'heroStat', {
    name: game.i18n.localize("osr-character-builder.setting.heroStats"),
    hint: game.i18n.localize("osr-character-builder.setting.heroStatsHint"),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'hideForeignPacks', {
    name: "osr-character-builder.settings.hideForeignPackName",
    hint: "osr-character-builder.settings.hideForeignPackHint",
    scope: 'client',
    type: Boolean,
    default: true,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'makePackFolder', {
    name: "osr-character-builder.settings.makePackFolder",
    hint: "osr-character-builder.settings.makePackFolderHint",
    scope: 'client',
    type: Boolean,
    default: true,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'packFolderName', {
    name: "osr-character-builder.settings.packFolderName",
    hint: "osr-character-builder.settings.packFolderNameHint",
    scope: 'world',
    type: String,
    default: 'OSRCB Compendiums',
    config: true
  });
});

Hooks.once('ready', async () => {
  switch (game.i18n.lang) {
    case 'en':
      registerSrdDataEn();     
      console.log('en')
      break;
    case 'es':
      registerSrdDataEs();
      console.log('es')
      break
  }
  // set hook to hide display of foreign language packs
  await intializePackFolders()
  hideForeignPacks()

  //reset external classes
  await game.settings.set(`${OSRCB.moduleName}`, 'externalClasses', []);
  Hooks.callAll('OSRCB Registered');
  const oseModName = 'old-school-essentials';
  const srdObj = {};
  if (game.user.role >= 4) {
    let oseActive = await game.modules.get(oseModName)?.active;
    if (oseActive) {
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
    // if (!classSelected) {
    modBox.append(
      `<a class="osr-icon osr-choose-class" title="Character Builder"><i class="fas fa-user-shield"></i></a>`
    );
    modBox.on('click', '.osr-choose-class', async (event) => {
      const dataObj = OSRCB.util.mergeClassOptions();

      OSRCB.util.renderCharacterBuilder(actor, dataObj);
      // new OSRCB.characterBuilder(actor, dataObj).render(true);
    });
    // }
  }
});

Hooks.on('renderOSRCharBuilder', async (app, html) => {
  OSRCB.util.renderClassOptions(html);
  OSRCB.util.renderAbilScores(html, app.actor);
  OSRCB.util.renderGold(html, app.actor);
  OSRCB.util.shopCheck(html);
});
