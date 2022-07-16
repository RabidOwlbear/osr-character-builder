export async function registerClassEntryForm() {
  OSRCB.forms.classEntryForm = class classEntryForm extends FormApplication {
    constructor() {
      super();

      this.saveRows = [1];
      this.thac0Rows = [1]
      this.maxLvl = 14;
      this.xp = [];
      this.xpMod = [];
      this.hdMod= [];

      this.HideInactive = async function (html, active) {
        let tabContent = html.find('.tab-content');
        tabContent.map((i) => {
          if (tabContent[i].dataset.tab !== active) {
            tabContent[i].style.display = 'none';
          } else {
            tabContent[i].style.display = '';
          }
      });

      this.SvDelBtn = function (html, id) {
          console.log('fffff', html);
          let btns = html.querySelectorAll(`.sv-del`);
          for (let btn of btns) {
            console.log(btn)
            btn.addEventListener('click', async (ev) => {
              ev.preventDefault();
              let lvl = btn.id.split('-')[2];
              console.log(`${id}${lvl}`)
              let el = await html.querySelector(`${id}${lvl}`);
              el.remove();
            });
          }
        };
      };
      this.coerceNum = function (inp){
        let val = parseInt(inp);
        if(val){
          return val
        }
        else {
          return 0
        }
      }
      this.xpRow = function (type, html){
        let maxLvl = parseInt(html.find('#maxLvl')[0]?.value);
        const xpCont = html.find('#xp-display')[0];
        const xpInp = html.find('#xp-inp')[0];
        if(type == 'add'){
          if(!maxLvl){
            ui.notifications.warn('Max Level requires a valid whole number.');
            return
          }
          if(this.xp.length + 1 >= maxLvl){
            ui.notifications.warn('Cannot exceed maximum level.');
            return
          }
          let xpAmt = parseInt(xpInp.value)
          if(!xpAmt){
            ui.notifications.warn(`Please Enter A Valid Number.`);
            return
          }
          this.xp.push(xpAmt);
          console.log('xp', this.xp)
          let el = `
          <div class="fx" id="xp-lvl-${this.xp.length + 1}">
            <div class="lvl-pref mr-5">${this.xp.length + 1}: </div>
            <div class="lvl-xp">${xpAmt}</div>
          </div>
          `
          xpCont.innerHTML += el;
          xpInp.value = 0;

        }
        if(type == 'del'){
          let el = html.find(`#xp-lvl-${this.xp.length + 1}`)[0]
          if(this.xp.length)el.remove();
          console.log('xp before',this.xp)
          this.xp.pop()
          console.log('xp after',this.xp)
        }
        
      }
      
    }
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ['form', `custom-class-form`],
        title: 'Custom Class Entry Form',
        popOut: true,
        height: 700,
        width: 500,
        tabs: [
          {
            navSelector: '.tabs',
            contentSelector: '.tab-content',
            initial: '[data-tab=main]'
          }
        ],
        template: `modules/${OSRCB.moduleName}/template/custom-class-form.html`
      });
    }

    getData() {}

    async activateListeners(html) {
      // number check for number inputs
      const numInputs = html.find('.num-check');
      for(let inp of numInputs){
        inp.addEventListener('blur', (ev)=>{
          ev.preventDefault()
          let val = this.coerceNum(inp.value);
          inp.value = val;
        })
      }

      // hide inactive tabs
      this.HideInactive(html, 'main');
      let navLinks = html.find('.nav-link');
      // tab listeners
      navLinks.map((l) => {
        navLinks[l].addEventListener('click', (ev) => {
          ev.preventDefault();
          this.HideInactive(html, navLinks[l].dataset.tab);
        });
      });

      // add saves row
      const saveRowBtnPlus = html.find('#add-saves-row')[0];
      saveRowBtnPlus.addEventListener('click', async (ev) => {
        ev.preventDefault();
        let lvl = parseInt(html.find('#sav-row-lvl')[0].value);
        let container = html.find('#sav-row-cont')[0];
        if (!lvl || lvl > this.maxLvl || this.saveRows.includes(lvl)) {
          ui.notifications.warn('Please enter a valid number.');
        } else {
          this.saveRows.push(lvl);
          let newRow = await renderTemplate(`/modules/${OSRCB.moduleName}/template/partials/save-level.html`, {
            sLvl: lvl
          });
          container.innerHTML += newRow;
        }
        this.SvDelBtn(container, `#save-lvl-`);

      });

      // add thac0/saves row
      const thac0BtnPlus = html.find('#add-thac0-row')[0];
      thac0BtnPlus.addEventListener('click',async  (ev)=>{
        ev.preventDefault()
        let lvl = parseInt(await html.find('#thac0-row-lvl')[0].value);
        let container = html.find('#thac0-row-cont')[0];
        if(!lvl || lvl > this.maxLvl || this.thac0Rows.includes(lvl)) {
          ui.notifications.warn('Please enter a valid number.');
        } else { 
          this.thac0Rows.push(lvl)
          let newRow = await renderTemplate(`/modules/${OSRCB.moduleName}/template/partials/thac0-row.html`, {
            tLvl: lvl
          });
          container.innerHTML += newRow;
          this.SvDelBtn(container, `#thac0-row-`);
        }
      });

      //xp buttons
      let xpLevelPlus = html.find('#xp-plus-btn')[0]
      let xpInp = html.find('#xp-inp')[0];
      xpInp.addEventListener('keydown', (e)=>{
        
        console.log('key', e.key)
        if(e.key == 'Enter'){
          e.preventDefault()
          console.log('fuck you asshole')
          this.xpRow('add', html);
        }
      })
      xpLevelPlus.addEventListener('click', (ev)=>{
        ev.preventDefault();
        this.xpRow('add', html);
      })
      let xpLevelMinus = html.find('#xp-minus-btn')[0]
      xpLevelMinus.addEventListener('click', (ev)=>{
        ev.preventDefault();
        this.xpRow('del', html);
      })


      const casterCheck = html.find('#caster-check')[0];
      casterCheck.addEventListener('change', (ev)=>{
        const slotCont = html.find('#spell-slot-cont')[0];
        if(ev.target.checked){
          slotCont.style.display = '';
        }else{
            slotCont.style.display = 'none';
        }
      })
    }
    async _updateObject(event, formData) {}
  };
}
