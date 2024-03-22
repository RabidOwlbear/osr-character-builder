export const socket = {
  registerSocket: function () {
    game.socket.on('module.osr-character-builder', OSRCB.socket.handleSocket);
  },
  handleSocket: async (socketData, id) => {
    const data = socketData.data;
    const type = socketData.type;
    let singleGM = game.users.filter((u) => u.isGM && u.active)[0];
    if (singleGM) {
      switch (type) {
        case 'newPlayerCharacter':
          socket.newPlayerCharacterGM(data);
          break;
        case 'renderCharBuilder':
          socket.renderNewCharBuilder(data);
          break;
        default:
          console.log('no case found');
      }
    }
  },
  newPlayerCharacterGM: async (data) => {
    /* expected data:
    {
      user: user id string,
    }
    */
    if (OSRCB.singleGM()) {
      const user = await game.users.get(data.user);
      const actorData = {
        name: `${user.name}${game.i18n.localize('osr-character-builder.newCharName')}`,
        type: 'character',
        permission: {},
        // folder: folderId,
        system: { encumbrance: { max: 1600 } },
        ownership: { default: 0 }
      };
      actorData.ownership[data.user] = 3;
      const actor = await Actor.create(actorData);
      const options = OSRCB.util.mergeClassOptions();

      game.socket.emit('module.osr-character-builder', {
        type: 'renderCharBuilder',
        data: {
          user: data.user,
          actor: actor.uuid,
          options: options
        }
      });
    }
  },
  renderNewCharBuilder: async (data) => {
    if (game.user.id === data.user) {
      const actor = await fromUuid(data.actor);
      await actor.sheet.render(true);
      OSRCB.util.renderCharacterBuilder(actor, data.options);
    }
  }
};
