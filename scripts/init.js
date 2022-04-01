import { registerCharacterBuilder } from './char-builder.js'
import { registerSrdData } from './srd-class-data.js'
import { registerRetainerBuilder } from './retainer-builder.js'
window.OSRCB = window.OSRCB || {
  moduleName: `osr-character-builder`
};
Hooks.once('init', async () => {
  console.log('OSR-Character-Builder Loaded.<-----------------------------');
  await game.settings.register(`${OSRCB.moduleName}`, 'characterClasses', {
    name: 'characterClasses',
    type: Object,
    default: {},
    scope: 'world'
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'spellList', {
    name: 'spellList',
    type: Object,
    default: {},
    scope: 'world'
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'statRollMessage', {
    name: 'Send Character Builder Stat Rolls To Chat',
    hint: 'Sends stat roll results from the character builder to chat.',
    scope: 'world',
    type: Boolean,
    default: false,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'whisperStatRollMessage', {
    name: 'Whisper Character Builder Stat Rolls To GM',
    hint: 'Whispers stat roll result message to GM istead of sending to chat.',
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });
  
  //register namespace
  window.OSRCB = window.OSRCB || {};
  OSRCB.util = OSRCB.util || {};
  OSRCB.data = OSRCB.data || {};
  OSRCB.spells = OSRCB.spells || { mergedList: {}, }
  OSRCB.spells.mergedList = {};
  Hooks.call('OSRCB Registered');

  // import modules
  registerCharacterBuilder()
  registerSrdData()
  registerRetainerBuilder()

});

Hooks.once('ready', async () => {
  const oseModName = 'old-school-essentials';
  const srdObj = {};
  
  let oseActive = await game.modules.get(oseModName)?.active
  console.log(oseActive)
  if (!oseActive) {
    srdObj.SRD = {
      name: 'SRD',
      header: false,
      pack: `${OSRCB.moduleName}.osr-srd-class-options`,
      options: [
        {
          name: 'SRD',
          classes: OSRCB.data.SRDClassData,
          pack: `${OSRCB.moduleName}.osr-srd-class-options`
        }
      ]
    };
  }
  
  if (game.user.role >= 4) {
    // await game.settings.set(`${OSRCB.moduleName}`, 'spellList', {})
    await game.settings.set(`${OSRCB.moduleName}`, 'characterClasses', srdObj);
    Hooks.callAll('OseCharacterClassAdded');
  }
});

//on actor sheet load, add helper buttons to sheet
Hooks.on('renderOseActorSheet', (actorObj, html) => {
  const actor = actorObj.actor;
  const modBox = html.find(`[class="modifiers-btn"]`);
  const defCharBtn = html.find(`.profile .blinking`)[0]
  if(defCharBtn) defCharBtn.style.display = 'none'
  const classSelected = actor.getFlag(`${OSRCB.moduleName}`, 'classSelected');

  if (actor.data?.data?.scores?.str?.value == 0) {
    // if (!classSelected) {
    modBox.append(
      `<a class="osr-icon osr-choose-class" title="Character Builder"><i class="fas fa-user-shield"></i></a>`
    );
    modBox.on('click', '.osr-choose-class', async (event) => {
      const dataObj = await game.settings.get(`${OSRCB.moduleName}`, 'characterClasses');
      console.log(dataObj)
      OSRCB.util.renderCharacterBuilder(actor, dataObj);
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
