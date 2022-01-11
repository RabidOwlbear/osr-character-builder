Hooks.once('init', async () => {
  console.log('OSE-Character-Builder Loaded.<-----------------------------');
  await game.settings.register('OSE-CharacterBuilder', 'characterClasses', {
    name: 'characterClasses',
    type: Object,
    default: {},
    scope: 'world'
  });
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
          classes: SRDClassData,
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
  console.log('render char builder fired');
  const modBox = html.find(`[class="modifiers-btn"]`);
  const classSelected = actor.getFlag('OSE-CharacterBuilder', 'classSelected');
  console.log(actor, classSelected);
  if (actor.data?.data?.scores?.str?.value == 0) {
    // if (!classSelected) {
    modBox.append(
      `<a class="ose-icon ose-choose-class" title="Character Builder"><i class="fas fa-user-shield"></i></a>`
    );
    modBox.on('click', '.ose-choose-class', (event) => {
      const dataObj = game.settings.get('OSE-CharacterBuilder', 'characterClasses');
      console.log(dataObj);
      console.log('actor before launch', actor);
      renderCharacterBuilder(actor, dataObj);

      // oseClassDialog(actor.object);
    });
    // }
    //console.log('render sheet hook', actor, modBox);
  }
});

Hooks.on('renderOSECharBuilder', async (app, html) => {
  console.log('cb hook caught');

  //const crawlerSelect = html.find('#crawlerSelect')[0];
  //const crawlerPack = game.packs.get('OSE-Carcass-Crawler.carcass crawler 0 item');

  console.log(app.actor, app.actor.actor);
  console.log('launched');
  renderClassOptions(html);
  renderAbilScores(html, app.actor);
  renderGold(html, app.actor);
  shopCheck(html);
});
