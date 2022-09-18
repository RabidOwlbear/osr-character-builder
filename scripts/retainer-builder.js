export async function registerRetainerBuilder() {


  OSRCB.util.renderRetainerBuilder = async function (actor) {
    
    class RetainerBuilder extends FormApplication {
      constructor(actor) {
        super();
        this.actor = actor;
      }
    
      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ['retainer-builder'],
          popOut: true,
          template: `modules/${OSRCB.moduleName}/template/retainerBuilder.html`,
          height: 220,
          width: 300,
          id: 'retainer-builder',
          title: 'Retainer Builder',
        });
      }
    
      getData() {
        
        // Send data to the template
        let tData = {
          option: [
            {name:'--Basic--', value: 'none.SRD'},
            {name:'cleric', value: 'SRD.cleric'},
            {name:'dwarf', value: 'SRD.dwarf'},
            {name:'elf', value: 'SRD.elf'},
            {name:'fighter', value: 'SRD.fighter'},
            {name:'halfling', value: 'SRD.halfling'},
            {name:'magic-user', value: 'SRD.magic-user'},
            {name:'thief', value: 'SRD.thief'},
          ],
          randName: ``
        }
        let helperActive = game.modules.get('osr-helper')?.active;
        if (helperActive){
          tData.randName = `
          <div>
            <label for="randName">Name</label>
            <input class="padh10" id="randName" type="checkbox" checked>
          </div>
          `
        }
        let ose = OSRCB.util.oseActive()
        console.log(ose)
        if(ose){
          let opt = [
            {name:'--Advanced--', value: 'none.advanced'},
            {name:'acrobat', value: 'advanced.acrobat'},
            {name:'assassin', value: 'advanced.assassin'},
            {name:'barbarian', value: 'advanced.barbarian'},
            {name:'bard', value: 'advanced.bard'},
            {name:'drow', value: 'advanced.drow'},
            {name:'druid', value: 'advanced.druid'},
            {name:'duergar', value: 'advanced.duergar'},
            {name:'gnome', value: 'advanced.gnome'},
            {name:'half-elf', value: 'advanced.half-elf'},
            {name:'half-orc', value: 'advanced.half-orc'},
            {name:'illusionist', value: 'advanced.illusionist'},
            {name:'knight', value: 'advanced.knight'},
            {name:'paladin', value: 'advanced.paladin'},
            {name:'ranger', value: 'advanced.ranger'},
            {name:'svirfneblin', value: 'advanced.svirfneblin'},
          ]
          tData.option = tData.option.concat(opt)
        }
        return tData
      
      }
    
      activateListeners(html) {
        super.activateListeners(html);
        const lvlInput = html.find('#level')[0]
        const selectInput = html.find('#class-select')[0]
        this.html = html
        
        lvlInput.addEventListener('change',async  ()=>{
          if(!selectInput.value == ''){
            
            let classInput = selectInput?.value.split('.');
            let classType = classInput[0]
            let classOption = classInput[1]
            if(classType == 'SRD'){              
              classType = OSRCB.util.oseActive() ? 'basic' : 'SRD'
            }
            
            
            const dataObj = OSRCB.util.getClassOptionObj(classType).classes;
            const classObj = dataObj[classOption];
            // const classObj = await OSRCB.util.getClassOptionObj(classType).classes[classOption];
            
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
              classType = OSRCB.util.oseActive() ? 'basic' : 'SRD'
            }
            const dataObj = OSRCB.util.getClassOptionObj(classType).classes;
            const classObj = dataObj[classOption];
            if(lvlInput.valueAsNumber > classObj.maxLvl){
              lvlInput.value = classObj.maxLvl
            }
          }  
        })
      }
      async _updateObject(event, formData) {
        
        formData.level = this.html.find('#level')[0].valueAsNumber;
        formData.spellCheck = this.html.find('#spells')[0].checked;
        formData.itemsCheck = this.html.find('#items')[0].checked;
        formData.randName = this.html.find('#randName')[0].checked;
        let selectData = formData['class-select'].split('.')
        formData.classType = selectData[0];
        formData.classOption = selectData[1]
        formData.retainer= true;
          const newRetainer = await OSRCB.util.retainerGen(formData);
          if(formData.spellCheck && newRetainer) {
            
            OSRCB.util.randomSpells(formData, newRetainer)}
          if(formData.itemsCheck && newRetainer) {
            
            OSRCB.util.randomItems(formData, newRetainer)}
          if(formData.randName && newRetainer){
            console.log('ghggggggg', formData, OSRCB.util.getClassOptionObj(formData.classType))
            let classObj  = OSRCB.util.getClassOptionObj(formData.classType).classes[formData.classOption]
            console.log(classObj, classObj.nameType)
            let name = OSRH.util.randomName(classObj.nameType)
            console.log(newRetainer, name, newRetainer.name)
            const oldName = newRetainer.name
            await newRetainer.update({name: `${name} ${oldName}`, token: {name: name}})

          }
      }
    }
    new RetainerBuilder(actor).render(true)
  };
  OSRCB.util.retainerGen= async function (data){
    
    let { level} = data
    if(data.classType == 'none'){
      ui.notifications.warn('Please select a class.')
      return null
    }
    if(data.classType == 'SRD' ){
      data.classType = OSRCB.util.oseActive() ? 'basic' : 'SRD'
    }
    let statObj = await OSRCB.util.osrRollStats(false, true);
    
    const alignment = ['lawful','neutral', 'chaotic'];
    data.alignment = alignment[Math.floor(Math.random() * alignment.length)]
    data.goldAmount = Math.floor(Math.random() * 13 + 2)
    data.retainer = true;
    mergeObject(data, statObj)
    
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
     
    await OSRCB.util.osrUpdateSheet(data, newActor);
    return newActor

  }
  OSRCB.util.randomSpells = async function (data, actor){
    
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    let {classType, classOption, level} = data
    if(classType == 'SRD'){
      classType = OSRCB.util.oseActive() ? 'basic' : 'SRD'
    }
    const typeData = await OSRCB.util.getClassOptionObj(classType)
    const classData = typeData.classes[classOption];
    //break out if not spellcaster
    if(!classData.spellCaster){
       
      return
    } 
    const magicType = classData?.spellType
    const spellList = OSRCB.spells.mergedList[magicType];
    const slotData = classData?.spellSlot[level]
    const compendium = await game.packs.get(classData.spellPackName);
    for(let key in slotData){
      if(slotData[key].max > 0){
        let picked = []
        let list = spellList[key]
        
        while(picked.length < slotData[key].max){
          let idx = Math.floor(Math.random() * list.length);
          
          if(!picked.includes(list[idx])){
            picked.push(list[idx])
          }
        }
        for(let spell of picked){
          await sleep(20)
          const compSpellList = compendium.index.filter(s=>s.name == spell)
          if(compSpellList.length > 1){
            for(let s of compSpellList){
              let spellObj = await compendium.getDocument(s._id)
              
              if(spellObj.system.class.toLowerCase() == classData.spellType.toLowerCase()){
                
                const data = spellObj.clone();
                await actor.createEmbeddedDocuments('Item', [data])
              }
            }
          }else {
            
            const itemData = await compendium.index.getName(spell);
            
            const itemObj = await compendium.getDocument(itemData._id);
            
            const data = itemObj.clone();
            await actor.createEmbeddedDocuments('Item', [data])
          }
        }
      }
    }
  }

  OSRCB.util.randomItems = async function (data , actor){
    const oseActive = OSRCB.util.oseActive();
    const {classOption} = data
    
    const compendium = await game.packs.get(`${OSRCB.moduleName}.osr-srd-items`)
    const gearList = ['Backpack', 'Crowbar', 'Garlic', 'Grappling Hook', 'Hammer (small)', 'Holy Symbol', 'Holy Water (vial)', 'Iron Spikes (12)', 'Lantern', 'Mirror (hand sized, steel)', 'Oil (1 flask)', "Pole (10' long, wooden)", 'Rations (iron, 7 days)', 'Rations (standard, 7 days)', "Rope (50')", 'Sack (large)', 'Sack (small)', 'Stakes (3) and Mallet', 'Thieves Tools', 'Tinder Box (flint and steel)', 'Torches (6)', 'Waterskin', 'Wine (2 pints)', 'Wolfsbane (1 bunch)'];
    const armorList = oseActive ?
    OSE.data.retainerGear[classOption].armor :
    OSRCB.data.retainerGear[classOption].armor;
    const weaponList = oseActive ?
    OSE.data.retainerGear[classOption].weapons :
    OSRCB.data.retainerGear[classOption].weapons;
    const weaponPick = []
    let weaponCount = Math.floor(Math.random() * 2 + 1)
    if(weaponCount > weaponList.length)weaponCount = weaponList.length;
    const itemPick = []
    let itemCount = Math.floor(Math.random() * 4 + 3)
    const armorPick = []
    if(armorList.length > 0) armorPick.push(armorList[Math.floor(Math.random() * armorList.length)]);
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
      
    }
    for(let item of armorPick){
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data =  itemObj.clone();
      data.system.equipped = true
      
      await actor.createEmbeddedDocuments('Item', [data])
      await actor.items.getName(data.name).update({data: {equipped: true}})
    }
    let weapCount = 0;
    for(let item of weaponPick){
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data =  itemObj.clone();
      
      await actor.createEmbeddedDocuments('Item', [data])
      if(weapCount == 0){
        await actor.items.getName(data.name).update({data: {equipped: true}})
      }
      weapCount++
    }
    for(let item of itemPick){
      const itemData = await compendium.index.getName(item);
      const itemObj = await compendium.getDocument(itemData._id);
      const data =  itemObj.clone();
      
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

  OSRCB.util.randomRetainers = async function (data, classType = 'SRD'){
    
    const advanced = ['acrobat','assassin','barbarian','bard','drow','druid','duergar','gnome','half-elf','half-orc','illusionist','knight','paladin','ranger','svirfneblin']
    const basic = ['cleric', 'dwarf', 'elf', 'fighter', 'halfling','magic-user', 'thief']
    let classOptions = basic
    let type = classType
    if(classType == 'advanced' && OSRCB.util.oseActive())classOptions = advanced;
    if(classType == 'mixed' && OSRCB.util.oseActive())  classOptions = advanced.concat(basic);

    let {number, randomNumber, maxLvl, minLvl, items, spells, randomName } = data;
    
    if(randomNumber){
      let newNum = Math.floor(Math.random() * number + 1)
      number = newNum
    }
    for( let i = 0; i < number; i++){
      let diff = maxLvl - minLvl;
      
    let randNum = Math.floor(Math.random() * (diff + 1)) + minLvl;
    let randLvl = randNum == 0 ? 1 : randNum;
    const data = {
      level: minLvl == maxLvl ? minLvl : randNum,
      classType: type,
      classOption: classOptions[Math.floor(Math.random() * classOptions.length)]
    }
    console.log('data', data)  
    const newRetainer = await OSRCB.util.retainerGen(data);
    data.level = newRetainer.system.details.level;
    // random name support
    if(randomName && game.modules.get("osr-helper")?.active){
      let classObj  = OSRCB.util.getClassOptionObj(data.classType).classes[data.classOption]
      console.log(classObj, classObj.nameType)
      let name = OSRH.util.randomName(classObj.nameType)
      console.log(newRetainer, name, newRetainer.name)
      const oldName = newRetainer.name
      await newRetainer.update({name: `${name} ${oldName}`, token: {name: name}})
    }
    if(spells) await OSRCB.util.randomSpells(data, newRetainer)
    if(items) await OSRCB.util.randomItems(data, newRetainer)
    }
  }
  
  OSRCB.util.oseActive = function(){
    if(game.modules.get('old-school-essentials')?.active){
      return true
    } else return false
  }
}
