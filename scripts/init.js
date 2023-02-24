//import { registerCharacterBuilder } from './char-builder.js';
import { registerSrdData } from './srd-class-data.js';
import { registerRetainerBuilder } from './retainer-builder.js';
import { initializeUtils } from './util.mjs';
import { osrCharacterBuilder } from './character-builder/character-builder.mjs';
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
  Hooks.call('OSRCB Registered');

  // import modules
  //registerCharacterBuilder();
  registerSrdData();
  registerRetainerBuilder();
  initializeUtils()

    console.log('OSR-Character-Builder Loaded.<-----------------------------');
    await game.settings.register(`${OSRCB.moduleName}`, 'characterClasses', {
      name: 'characterClasses',
      type: Object,
      default: {},
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
      name: 'Rolls To Chat',
      hint: 'Sends stat roll results from the character builder to chat.',
      scope: 'world',
      type: Boolean,
      default: false,
      config: true
    });
    await game.settings.register(`${OSRCB.moduleName}`, 'whisperStatRollMessage', {
      name: 'Whisper Rolls To GM',
      hint: 'Whispers stat roll result message to GM istead of sending to chat.',
      scope: 'world',
      type: Boolean,
      default: true,
      config: true
    });
    await game.settings.register(`${OSRCB.moduleName}`, 'heroStat', {
      name: 'Roll Heroic Stats',
      hint: 'Roll 4d6 drop lowest for ability scores on the character creator.',
      scope: 'world',
      type: Boolean,
      default: false,
      config: true
    });
});

Hooks.once('ready', async () => {
  const oseModName = 'old-school-essentials';
  const srdObj = {};
  if (game.user.role >= 4) {
    
    
    let oseActive = await game.modules.get(oseModName)?.active;
    
    if (oseActive) {
      game.settings.set('osr-character-builder', 'defaultClasses', [{
        name: 'OSE-basic',
        menu: 'OSE Basic',
        default: true,
        classes:OSE.data.classes.basic
      },
      {
        name: 'OSE-advanced',
        menu: 'OSE Advanced',
        default: false,
        classes: OSE.data.classes.advanced
      }]);
     
    } else{
      game.settings.set('osr-character-builder', 'defaultClasses', [{
        name: 'SRD',
        menu: 'SRD',
        default: true,
        classes: OSRCB.data.SRDClassData
      }]);
    }

    // await game.settings.set(`${OSRCB.moduleName}`, 'spellList', {})
    // let customClasses = await game.settings.get(`${OSRCB.moduleName}`, 'customClasses');
    // const data = mergeObject(srdObj, customClasses);
    // await game.settings.set(`${OSRCB.moduleName}`, 'characterClasses', data);
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
