export async function registerSettings(){
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
    name: game.i18n.localize('osr-character-builder.setting.chatRoll'),
    hint: game.i18n.localize('osr-character-builder.setting.chatRollHint'),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'whisperStatRollMessage', {
    name: game.i18n.localize('osr-character-builder.setting.gmRoll'),
    hint: game.i18n.localize('osr-character-builder.setting.gmRollHint'),
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'heroStat', {
    name: game.i18n.localize('osr-character-builder.setting.heroStats'),
    hint: game.i18n.localize('osr-character-builder.setting.heroStatsHint'),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true
  });
  // await game.settings.register(`${OSRCB.moduleName}`, 'hideForeignPacks', {
  //   name: 'osr-character-builder.settings.hideForeignPackName',
  //   hint: 'osr-character-builder.settings.hideForeignPackHint',
  //   scope: 'client',
  //   type: Boolean,
  //   default: true,
  //   config: true
  // });
  await game.settings.register(`${OSRCB.moduleName}`, 'allowUserCharacterMacro', {
    name: "osr-character-builder.allowCharacterMacro",
    hint: "osr-character-builder.allowCharacterMacroDesc",
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'makePackFolder', {
    name: 'osr-character-builder.settings.makePackFolder',
    hint: 'osr-character-builder.settings.makePackFolderHint',
    scope: 'client',
    type: Boolean,
    default: true,
    config: true
  });
  await game.settings.register(`${OSRCB.moduleName}`, 'packFolderName', {
    name: 'osr-character-builder.settings.packFolderName',
    hint: 'osr-character-builder.settings.packFolderNameHint',
    scope: 'world',
    type: String,
    default: 'OSRCB Compendiums',
    config: true
  });
}