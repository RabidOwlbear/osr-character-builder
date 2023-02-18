export function mergeClassOptions(){
  let defaultClasses = game.settings.get('osr-character-builder', 'defaultClasses');
  let osrCCBActive =  game.modules.get('osr-ccb')?.active
  const mergeClasses = game.settings.get('osr-ccb', 'displayCustomClasses');
 if(osrCCBActive && mergeClasses){
  let customClasses = game.settings.get('osr-ccb', 'customClasses');
  return defaultClasses.concat(customClasses);
 }else{
  return defaultClasses
 }
 
  
}

export async function multiLvlHp(actor, level, classObj, con, msg = false, whisper) {
  const conMod = [
    [3, -3],
    [5, -2],
    [8, -1],
    [12, 0],
    [15, 1],
    [17, 2],
    [18, 3]
  ];
  let hpMod = 0;
  for (let val of conMod) {
    hpMod = val[1];
    if (con === 3) break;
    if (con <= val[0]) {
      break;
    }
  }

  let { hd } = classObj;
  let hpTotal = 0;
  let hpBonus = 0;
  let bonus = 0;
  let hpMsg = ``;
  let hdArr = classObj.hdArr;
  let rollArr = [];

  if (level < 10) {
    hpBonus = level * hpMod;
    let formula = `${hdArr[level - 1]} + ${hpBonus}`;
    let roll = await new Roll(formula).evaluate({ async: true });
    hpMsg += `<p><b>roll</b>: ${roll.formula} = ${roll.total}</p>`;
    hpTotal += roll.total + hpMod;
    msg = true;
  } else {
    let modArr = hdArr.slice(9);
    console.log(modArr);
    hpBonus = 9 * hpMod;
    modArr.map((i) => {
      let num = parseInt(i.slice(i.indexOf('+') + 1));
      bonus += num;
    });
    let formula = `${level}d${hd}+ ${hpBonus} + ${bonus}`;
    let roll = await new Roll(formula).evaluate({ async: true });
    hpMsg += `<p><b>roll</b>: ${roll.formula} = ${roll.total}</p>`;
    hpTotal += roll.total;
    msg = true;
  }

  if (msg == true) {
    let msgData = {
      speaker: ChatMessage.getSpeaker(),
      content: `
      <details>

      <summary>
       <b>${actor.name} HP Rolls:</b>
      </summary>
      </br>
      <div>
      ${hpMsg}
      </div>
      </details>
      `
    };
    if (whisper) msgData.whisper = [...game.users.filter((u) => u.isGM), game.user];
    ChatMessage.create(msgData);
  }
  return hpTotal;
}