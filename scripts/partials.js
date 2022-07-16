export async function registerPartials() {
  
  Handlebars.registerPartial('modName', `${OSRCB.moduleName}`);
  
  let saveLevel = await renderTemplate(`/modules/${OSRCB.moduleName}/template/partials/save-level.html`, {sLvl: 1})
  Handlebars.registerPartial( 'savesRow', saveLevel)
  let spellSlotTemplate = `<section id="spell-slots">` + (await genSlotHtml(14)) + `</section>`;
  Handlebars.registerPartial('spellSlot', spellSlotTemplate)
  async function genSlotHtml(max) {
    let retHtml = ``;
    for (let i = 1; i <= max; i++) {
      let html = await renderTemplate(`/modules/${OSRCB.moduleName}/template/partials/spell-level-row.html`, {
        lvl: i
      });
      retHtml += html;
    }
    return retHtml;
  }
  // Handlebars.registerPartial('spellSlot', spellSlotTemplate);
  let infoTab = await renderTemplate(`/modules/${OSRCB.moduleName}/template/partials/info-tab.html`, {});
  Handlebars.registerPartial('infoTab', infoTab);
  let spellCaster = await renderTemplate(`/modules/${OSRCB.moduleName}/template/partials/spell-caster-tab.html`, {});
  Handlebars.registerPartial('spellCaster', spellCaster);
  





}
