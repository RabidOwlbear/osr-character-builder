Hooks.once('OSECB Registered', () => {


  OSECB.util.renderRetainerBuilder = async function (actor) {

    class RetainerBuilder extends FormApplication {
      constructor(actor) {
        super();
        this.actor = actor;
      }
    
      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ['retainer-builder'],
          popOut: true,
          template: `modules/OSE-CharacterBuilder/template/retainerBuilder.html`,
          height: 200,
          width: 300,
          id: 'retainer-builder',
          title: 'Retainer Builder',
        });
      }
    
      getData() {
        // Send data to the template
        return {}
      
      }
    
      activateListeners(html) {
        super.activateListeners(html);
        const lvlInput = html.find('#level')[0]
        const selectInput = html.find('#class-select')[0]
        this.html = html
        // console.log(html)
        lvlInput.addEventListener('change',async  ()=>{
          if(!selectInput.value == ''){
            // console.log(html.find("#class-select")[0].value)
            let classInput = selectInput?.value.split('.');
            let classType = classInput[0]
            let classOption = classInput[1]
            if(classType == 'SRD'){
              classType = game.modules.get('old-school-essentials').active ? 'Basic' : 'SRD'
            }
            // console.log(classType)
            const dataObj = OSECB.util.getClassOptionObj(classType).classes;
            const classObj = dataObj[classOption];
            // const classObj = await OSECB.util.getClassOptionObj(classType).classes[classOption];
            // console.log(classObj, classObj.maxLvl, this)
            if(lvlInput.valueAsNumber > classObj.maxLvl){
              lvlInput.value = classObj.maxLvl
            }

          }
        })
        selectInput.addEventListener('change', async ()=>{
          if(!selectInput.value == ''){
            let classInput = selectInput.value.split('.');
            let classType = classInput[0]
            let classOption = classInput[1]
            if(classType == 'SRD'){
              classType = game.modules.get('old-school-essentials').active ? 'Basic' : 'SRD'
            }
            // console.log(classType)
            const dataObj = OSECB.util.getClassOptionObj(classType).classes;
            const classObj = dataObj[classOption];
            if(lvlInput.valueAsNumber > classObj.maxLvl){
              lvlInput.value = classObj.maxLvl
            }
          }  
        })
      }
    
      async _updateObject(event, formData) {
        // console.log(this)
        formData.level = this.html.find('#level')[0].valueAsNumber;
        formData.spellCheck = this.html.find('#spells')[0].checked;
        formData.itemsCheck = this.html.find('#items')[0].checked;
        let selectData = formData['class-select'].split('.')
        formData.classType = selectData[0];
        formData.classOption = selectData[1]
        formData.retainer= true;

        // console.log(formData, this.actor);
        
          const newRetainer = await OSECB.util.retainerGen(formData);
          if(formData.spellCheck) {
            // console.log('spellgen')
            OSECB.util.randomSpells(formData, newRetainer)}
          if(formData.itemsCheck) {
            // console.log('itemGen')
            OSECB.util.randomItems(formData, newRetainer)}
        




      }
    }
    new RetainerBuilder(actor).render(true)

  };
  OSECB.util.retainerGen= async function (data){
    let { level} = data
    if(data.classType == 'SRD'){
      data.classType = game.modules.get('old-school-essentials').active ? 'Basic' : 'SRD'
    }
    let statObj = OSECB.util.oseRollStats(false, true);
    // console.log(statObj)
    const alignment = ['lawful','neutral', 'chaotic'];
    data.alignment = alignment[Math.floor(Math.random() * alignment.length)]
    data.goldAmount = Math.floor(Math.random() * 13 + 2)
    data.retainer = true;
    mergeObject(data, statObj)
    console.log(data)
    let folder = game.folders.getName('Retainers');
    if(!folder){
      await Folder.create([{name: 'Retainers', type: 'Actor', color: '#a02e9d'}]);
      folder = game.folders.getName('Retainers')
    }
    const newActor = await Actor.create({
      name: `#randGen`,
      type: 'character',
      folder: folder.id
    })
     console.log('pre data',data)
    await OSECB.util.oseUpdateSheet(data, newActor);
    return newActor

  }


  OSECB.util.randomSpells = async function (data, actor){
    console.log(data, actor, `<----------------------------------`)
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    let {classType, classOption, level} = data
    if(classType == 'SRD'){
      classType = game.modules.get('old-school-essentials').active ? 'Basic' : 'SRD'
    }
    
    // console.log(classType, level)
    const typeData = await OSECB.util.getClassOptionObj(classType)
    const classData = typeData.classes[classOption];
    //break out if not spellcaster
    if(!classData.spellCaster){
       console.log('no caster')
      return
    } 
    console.log('past the break')
    const magicType = classData?.spellType
    const spellList = OSECB.spells.mergedList[magicType];
    const slotData = classData?.spellSlot[level]
    const compendium = await game.packs.get(classData.spellPackName);

    console.log('pack', compendium, slotData)
    for(let key in slotData){
      if(slotData[key].max > 0){
        let picked = []
        let list = spellList[key]
        while(picked.length < slotData[key].max){
          let idx = Math.floor(Math.random() * list.length);
          // console.log(idx, list[idx], picked.includes(list[idx]))
          if(!picked.includes(list[idx])){
            picked.push(list[idx])
          }
        }
        console.log(picked, actor)
        for(let spell of picked){
          await sleep(20)
          // console.log(spell)
          const compSpellList = compendium.index.filter(s=>s.name == spell)
          // console.log(compSpellList)
          if(compSpellList.length > 1){
            for(let s of compSpellList){
              // // console.log(s)
              let spellObj = await compendium.getDocument(s._id)
              // console.log(s.name, spellObj, classOption, spellObj.data.data.class.toLowerCase())
              if(spellObj.data.data.class.toLowerCase() == classData.spellType.toLowerCase()){
                // console.log('ding')
                const data = spellObj.clone().data;
                await actor.createEmbeddedDocuments('Item', [data])
              }
            }
          }else {
            console.log(spell)
            const itemData = await compendium.index.getName(spell);
            // console.log(itemData)
            const itemObj = await compendium.getDocument(itemData._id);
            // console.log(itemData, itemObj)
            const data = itemObj.clone().data;
            await actor.createEmbeddedDocuments('Item', [data])
          }
          
          
        }
        // // console.log(key, slotData[key].max)
      }
      
    }
  }

  OSECB.util.randomItems = async function (data , actor){
    const {classOption} = data
    // console.log(classOption)
    const compendium = await game.packs.get("OSE-CharacterBuilder.OSE-SRD-items")
    const gearList = ['Backpack', 'Crowbar', 'Garlic', 'Grappling Hook', 'Hammer (small)', 'Holy Symbol', 'Holy Water (vial)', 'Iron Spikes (12)', 'Lantern', 'Mirror (hand sized, steel)', 'Oil (1 flask)', "Pole (10' long, wooden)", 'Rations (iron, 7 days)', 'Rations (standard, 7 days)', "Rope (50')", 'Sack (large)', 'Sack (small)', 'Stakes (3) and Mallet', 'Thieves Tools', 'Tinder Box (flint and steel)', 'Torches (6)', 'Waterskin', 'Wine (2 pints)', 'Wolfsbane (1 bunch)'];
    const armorList = OSECB.retainerGear[classOption].armor;
    const weaponList = OSECB.retainerGear[classOption].weapons;
    const weaponPick = []
    let weaponCount = Math.floor(Math.random() * 2 + 1)
    if(weaponCount > weaponList.length)weaponCount = weaponList.length;
    const itemPick = []
    let itemCount = Math.floor(Math.random() * 4 + 3)
    const armorPick = []
    if(armorList.length > 0) armorPick.push(armorList[Math.floor(Math.random() * armorList.length)]);
    
    // console.log(armorPick, itemPick, weaponPick.length)
    while(weaponPick.length < weaponCount){
      let pick = weaponList[Math.floor(Math.random() * weaponList.length)];
      if(!weaponPick.includes(pick)){
        weaponPick.push(pick)
      }
    }
    while(itemPick.length < itemCount){
      let pick = gearList[Math.floor(Math.random() * gearList.length)];
      if(!itemPick.includes(pick)){
        itemPick.push(pick)
      }
      // console.log(armorPick, itemPick, weaponPick.length)
    }
    console.log(itemPick,weaponPick,armorPick)
    for(let item of armorPick){
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data =  itemObj.clone().data;
      data.data.equipped = true
      console.log(`item data -------------------->`,data.equipped, data)
      await actor.createEmbeddedDocuments('Item', [data])
      await actor.data.items.getName(data.name).update({data: {equipped: true}})


    }
    let weapCount = 0;
    for(let item of weaponPick){
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data =  itemObj.clone().data;
      // console.log(itemData, itemObj, data)
      await actor.createEmbeddedDocuments('Item', [data])
      if(weapCount == 0){
        await actor.data.items.getName(data.name).update({data: {equipped: true}})
      }
      weapCount++
    }
    for(let item of itemPick){
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data =  itemObj.clone().data;
      // console.log(itemData, itemObj, data)
      await actor.createEmbeddedDocuments('Item', [data])


    }
 
  }
  /*
      {
        number: 1, number of retainers to create
        maxLvl: 1, 
        minLvl: 10, 
        items: true, add items
        spells: true, add spells
      }
  */

  OSECB.util.randomRetainers = async function (data){
    const classOptions = ['cleric', 'dwarf', 'elf', 'fighter', 'halfling','magic-user', 'thief']
    let {number, randomNumber, maxLvl, minLvl, items, spells } = data
    if(randomNumber){
      
      let newNum = Math.floor(Math.random() * number + 1)
      console.log('bef',number, 'new',newNum)
     number = newNum
     console.log('aft',number)
    }
    for( let i = 0; i < number; i++){
      
      let diff = maxLvl - minLvl;
      console.log('diff', diff)
    let randLvl = Math.floor(Math.random() * diff + 1) + minLvl
    randLvl = randLvl == 0 ? 1 : randLvl;
      const data = {
        level: randLvl,
        classType: 'SRD',
        classOption: classOptions[Math.floor(Math.random() * classOptions.length)]
      }
    const newRetainer = await OSECB.util.retainerGen(data);
    data.level = newRetainer.data.data.details.level;
    if(spells) await OSECB.util.randomSpells(data, newRetainer)
    if(items) await OSECB.util.randomItems(data, newRetainer)
    }
  }
});
