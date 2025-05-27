import { nameData } from './data/name-data.mjs';

export const randomName = async function ({ type = null, gender = null, creator = false } = {}) {
  if (!type) {
    let options = ``;
    for (let key of Object.keys(nameData)) {
      options += `
      <option value="${key}">${key}</option>
      `;
    }

    let diagTemplate = `
  <h1> ${game.i18n.localize('osr-character-builder.util.dialog.pickNameType')}</h1>
  <div style="display:flex; margin-bottom: 5px;">
    <div  style="flex:1">
      <select id="nameType">
        <option value="none">-${game.i18n.localize('osr-character-builder.util.dialog.type')}-</option>
        ${options}
      </select>
    </div>
    <div  style="flex:1">
      <select id="gender">
        <option value="all">-${game.i18n.localize('osr-character-builder.util.dialog.gender')}-</option>
        <option value="male">${game.i18n.localize('osr-character-builder.util.dialog.male')}</option>
        <option value="female">${game.i18n.localize('osr-character-builder.util.dialog.female')}</option>
        <option value="all">${game.i18n.localize('osr-character-builder.util.dialog.all')}</option>
      </select>
    </div>
    <div>
      <label for="whisperCheck">${game.i18n.localize('osr-character-builder.util.dialog.whisper')}</label>
      <input type ="checkbox" id="whisperCheck" checked />
    </div>
  </div>
  `;
    let prefix = [
      game.i18n.localize('osr-character-builder.util.prefix.a'),
      game.i18n.localize('osr-character-builder.util.prefix.b'),
      game.i18n.localize('osr-character-builder.util.prefix.c'),
      game.i18n.localize('osr-character-builder.util.prefix.d'),
      game.i18n.localize('osr-character-builder.util.prefix.e'),
      game.i18n.localize('osr-character-builder.util.prefix.f'),
      game.i18n.localize('osr-character-builder.util.prefix.g'),
      game.i18n.localize('osr-character-builder.util.prefix.h'),
      game.i18n.localize('osr-character-builder.util.prefix.i')
    ];


    let picker = await new foundry.applications.api.DialogV2({
      window: {
        title: game.i18n.localize('osr-character-builder.util.dialog.randomName')
      },
      classes: ['osrcb'],
      id: 'osrcb-random-name',
      content: diagTemplate,
      buttons: [
        {
          action: 'pick',
          label: game.i18n.localize('osr-character-builder.util.dialog.pick'),

          // default: true,
          callback: async function (event, button, dialog) {
            const html = dialog.element;
            const nameType = html.querySelector('#nameType').value;
            const gender = html.querySelector('#gender').value;
            const whisper = html.querySelector('#whisperCheck').checked;
            let openSheets = document.querySelectorAll('.ose.sheet.actor.character');
            let focusedSheet = openSheets ? openSheets[0] : null;
            for (let sheet of openSheets) {
              if (parseInt(focusedSheet.style.zIndex) < parseInt(sheet.style.zIndex)) {
                focusedSheet = sheet;
              }
            }
            const tokens = canvas.tokens.controlled;
            if (nameType == 'none' || gender == 'none') {
              ui.notifications.warn(game.i18n.localize('osr-character-builder.notification.selectOption'));
              picker.render();
              return;
            }
            // rename single token/actor
            if (tokens.length && tokens.length == 1 && !creator) {
              let token = canvas.tokens.controlled[0];
              let actor = token.actor;
              let fullName = getName(nameType, gender);
              // chat message
              let cData = {
                type: 1,
                user: game.user.id,
                content: `${getRandomItem(prefix)} ${fullName}`
              };
              if (whisper) {
                cData.whisper = [game.user.id];
              }
              ChatMessage.create(cData);
              await actor.update({
                name: fullName,
                prototypeToken: {
                  name: fullName
                }
              });
              await token.document.update({ name: fullName });
              ui.notifications.info(game.i18n.localize('osr-character-builder.notification.tokenActorNameUpdated'));
              return;
            }
            // rename multiple tokens/actors
            if (tokens.length > 1 && !creator) {
              tokens.forEach(async (t) => {
                let token = t;
                let actor = t.actor;
                let newName = await getName(nameType, gender);

                if (actor.type == 'character') {
                  await actor.update({
                    name: newName,
                    prototypeToken: {
                      name: newName
                    }
                  });
                }

                await token.document.update({ name: newName });
                let cData = {
                  type: 1,
                  user: game.user.id,
                  content: `${getRandomItem(prefix)} ${newName}`
                };
                if (whisper) {
                  cData.whisper = [game.user.id];
                }
                ChatMessage.create(cData);
                await actor.update({
                  name: newName,
                  prototypeToken: {
                    name: newName
                  }
                });
                await token.document.update({ name: newName });
                ui.notifications.info(game.i18n.localize('osr-character-builder.notification.tokenActorNameUpdated'));
              });
              return;
            }
            // rename actor/token and open sheet input
            if (!canvas.tokens.controlled.length && focusedSheet && !creator) {
              const charSheet = focusedSheet; //document.querySelector('.ose.sheet.actor.character');
              const name = charSheet ? charSheet.querySelector('.ose.sheet.actor .window-title').innerText : 'none';
              const actor = game.actors.getName(name);
              let fullName = getName(nameType, gender);
              await actor.update({
                name: fullName,
                token: {
                  name: fullName
                }
              });
              return;
            }
            if (creator) {
              let fullName = getName(nameType, gender);
              const nameEl = document.querySelector('#osr-character-builder #name-inp');
              nameEl.value = fullName;
              return;
            }
            // generate chat message (default state)
            let fullName = getName(nameType, gender);
            let cData = {
              type: 1,
              user: game.user.id,
              content: `${getRandomItem(prefix)} ${fullName}`
            };
            if (whisper) {
              cData.whisper = [game.user.id];
            }
            ChatMessage.create(cData);
          }
        }
      ],
      form: {
        closeOnSubmit: false
      }
    }).render({ force: true });
  }
  if (type) {
    let gdr = gender ? gender : 'all';
    let name = getName(type, gdr);
    return name;
  }
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function getName(type, gender = 'all') {
  const firstObj = nameData[type] || nameData.human;
  const typeObj =
    gender == 'all'
      ? firstObj.first[Math.floor(Math.random() * firstObj.first.length)]
      : firstObj.first.find((a) => a.type == gender);
  let firstName = getRandomItem(typeObj.list);
  let lastName = firstObj.last.length > 0 ? getRandomItem(firstObj.last) : false;
  let fullName = !lastName ? firstName : `${firstName} ${lastName}`;
  return fullName;
}
