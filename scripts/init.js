Hooks.once('init', async () => {
  console.log('OSE-Character-Builder Loaded.<-----------------------------');
  await game.settings.register('OSE-CharacterBuilder', 'characterClasses', {
    name: 'characterClasses',
    type: Object,
    default: {},
    scope: 'world'
  });
  await game.settings.register('OSE-CharacterBuilder', 'spellList', {
    name: 'spellList',
    type: Object,
    default: {},
    scope: 'world'
  });
  await game.settings.register('OSE-CharacterBuilder', 'statRollMessage', {
    name: 'Send Character Builder Stat Rolls To Chat',
    hint: 'Sends stat roll results from the character builder to chat.',
    scope: 'world',
    type: Boolean,
    default: false,
    config: true
  });
  await game.settings.register('OSE-CharacterBuilder', 'whisperStatRollMessage', {
    name: 'Whisper Character Builder Stat Rolls To GM',
    hint: 'Whispers stat roll result message to GM istead of sending to chat.',
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });
  
  //register namespace
  window.OSECB = window.OSECB || {};
  OSECB.util = OSECB.util || {};
  OSECB.data = OSECB.data || {};
  OSECB.spells = OSECB.spells || { mergedList: {}, }
  OSECB.spells.mergedList = {};
  Hooks.call('OSECB Registered');
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
      pack: 'OSE-CharacterBuilder.OSE-SRD-class-options',
      options: [
        {
          name: 'SRD',
          classes: OSECB.data.SRDClassData,
          pack: 'OSE-CharacterBuilder.OSE-SRD-class-options'
        }
      ]
    };
  }
  
  if (game.user.role >= 4) {
    // await game.settings.set('OSE-CharacterBuilder', 'spellList', {})
    await game.settings.set('OSE-CharacterBuilder', 'characterClasses', srdObj);
    Hooks.callAll('OseCharacterClassAdded');
  }
});

//on actor sheet load, add helper buttons to sheet
Hooks.on('renderOseActorSheet', (actorObj, html) => {
  const actor = actorObj.actor;
  const modBox = html.find(`[class="modifiers-btn"]`);
  const defCharBtn = html.find(`.profile .blinking`)[0]
  if(defCharBtn) defCharBtn.style.display = 'none'
  const classSelected = actor.getFlag('OSE-CharacterBuilder', 'classSelected');

  if (actor.data?.data?.scores?.str?.value == 0) {
    // if (!classSelected) {
    modBox.append(
      `<a class="ose-icon ose-choose-class" title="Character Builder"><i class="fas fa-user-shield"></i></a>`
    );
    modBox.on('click', '.ose-choose-class', async (event) => {
      const dataObj = await game.settings.get('OSE-CharacterBuilder', 'characterClasses');
      console.log(dataObj)
      OSECB.util.renderCharacterBuilder(actor, dataObj);
    });
    // }
  }
});

Hooks.on('renderOSECharBuilder', async (app, html) => {
  OSECB.util.renderClassOptions(html);
  OSECB.util.renderAbilScores(html, app.actor);
  OSECB.util.renderGold(html, app.actor);
  OSECB.util.shopCheck(html);
});
