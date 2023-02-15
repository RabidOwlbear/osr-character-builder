export function mergeClassOptions(){
  let defaultClasses = game.settings.get('osr-character-builder', 'defaultClasses');
  let customClasses = game.settings.get('osr-character-builder', 'customClasses');
  return defaultClasses.concat(customClasses);
}