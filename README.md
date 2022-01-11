# OSE-Character-Builder

WARNING: As of now this module will not work correctly if you are hosting your game using The Forge. I will trey and fix this issue, if at all possible, until such time, this module is unuseable on The Forge.

A module that adds a basic character builder to the Old School Essentials system character sheet in Foundry Vtt.

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FRabidOwlbear%2FOSE-CharacterBuilder%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange)

## Installation

In the setup screen, use the URL https://raw.githubusercontent.com/RabidOwlbear/OSE-CharacterBuilder/main/module.json to install the module.

## How To Use
![icon](./assets/img/charBuilderIcon.jpg)

When a new character sheet is created the character creator can be accessed via the flashing green icon in the bar that appears when the mouse cursor hovers over the character portrait.

When clicked the Character Builder window will appear.


![charBuilder](./assets/img/charBuilder.jpg)

- Character Attributes: The ability scores as rolled will appear here.
- Reroll Stats: Clicking the dice icon will roll 3d6 for each of the ability scores.
- 4d6 drop lowest: Pretty straight forward, when the box is checked the ability rolls will use the 4d6 drop lowest formula.
- Class Type: selecting an option in this list will display available class choices in the panel to the right. The module includes the OSE SRD classes.
- Select A Class: selecting a class in this list will display the information about that class in the class information panel on the right.
- Alignment: select alignment here.
- Gold: enter a gold amount or randomly roll starting gold by clicking on the dice button.

When finished selecting options/rolling scores clicking the Choose button at the bottom of the form will add the selected class options, stats gold etc. to the character sheet.

Clicking the close button will exit out of the form without adding anything to the sheet.
