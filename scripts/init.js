Hooks.once('init', async () => {
  console.log('OSE-Character-Builder Loaded.<-----------------------------');
  await game.settings.register('OSE-CharacterBuilder', 'characterClasses', {
    name: 'characterClasses',
    type: Object,
    default: {},
    scope: 'world'
  });
  //register namespace
  window.OSECB = window.OSECB || {};
  OSECB.util = OSECB.util || {};
  Hooks.call('OSECB Registered');
});

Hooks.once('ready', async () => {
  const oseModName = 'old-school-essentials';
  const srdObj = {};
  if (!game.modules.get(oseModName)?.active) {
    srdObj.SRD = {
      name: 'SRD',
      header: false,
      pack: 'OSE-CharacterBuilder.OSE-SRD-class-options',
      options: [
        {
          name: 'SRD',
          classes: OSECB.SRDClassData,
          pack: 'OSE-CharacterBuilder.OSE-SRD-class-options'
        }
      ]
    };
  }

  if (game.user.role >= 4) {
    await game.settings.set('OSE-CharacterBuilder', 'characterClasses', srdObj);
    Hooks.callAll('OseCharacterClassAdded');
  }
});

//on actor sheet load, add helper buttons to sheet
Hooks.on('renderOseActorSheet', (actorObj, html) => {
  const actor = actorObj.actor;
  const modBox = html.find(`[class="modifiers-btn"]`);
  const classSelected = actor.getFlag('OSE-CharacterBuilder', 'classSelected');
  if (actor.data?.data?.scores?.str?.value == 0) {
    // if (!classSelected) {
    modBox.append(
      `<a class="ose-icon ose-choose-class" title="Character Builder"><i class="fas fa-user-shield"></i></a>`
    );
    modBox.on('click', '.ose-choose-class', (event) => {
      const dataObj = game.settings.get('OSE-CharacterBuilder', 'characterClasses');
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
