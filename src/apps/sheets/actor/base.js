import MarketWFRP4e from "../../../../modules/apps/market-wfrp4e";
import ActiveEffectWFRP4e from "../../../../modules/system/effect-wfrp4e";

export default class BaseWFRP4eActorSheet extends WarhammerActorSheetV2
{

  static DEFAULT_OPTIONS = {
    classes: ["wfrp4e"],
    actions : {
      rollTest : this._onRollTest,
      toggleSummary : this._toggleSummary,
      toggleSummaryAlt : {buttons: [2], handler : this._toggleSummary}, // TODO secondary actions
      openContextMenu : this._onContextMenu,
      toggleExtendedTests : this._toggleExtendedTests,
      removeAttacker : this._onRemoveAttacker,
      itemPropertyDropdown : this._onItemPropertyDropdown,
      combatDropdown : this._onCombatDropdown,
      clickCondition : {buttons : [0, 2], handler : this._onClickCondition}
    },
    defaultTab : "main"
  }

  _prepareTabs(options) {
    let tabs = super._prepareTabs(options);

    if (!this.actor.hasSpells) {
      delete tabs.magic;
    }

    if (!this.actor.hasPrayers) {
      delete tabs.religion;
    }

    return tabs;
  }

  _setupContextMenus()
  {
      return  [ContextMenu.create(this, this.element, ".list-row:not(.nocontext)", this._getListContextOptions()), ContextMenu.create(this, this.element, ".context-menu", this._getListContextOptions(), {eventName : "click"})]
  }

  _getListContextOptions()
  { 
    return [
      {
        name: "Edit",
        icon: '<i class="fas fa-edit"></i>',
        condition: li => !!li.data("uuid") || li.hasClass("context-menu"),
        callback: async li => {
          const document = await fromUuid(li.data("uuid"));
          document.sheet.render(true);
        }
      },
      {
        name: "Remove",
        icon: '<i class="fas fa-times"></i>',
        condition: li => !!li.data("uuid") || li.hasClass("context-menu"),
        callback: li => fromUuid(li.data("uuid")).then(doc => doc.delete())
      },
    ];
  }


  // From Income results - drag money value over to add
  _onDropIncome(data)
  {
    this.document.updateEmbeddedDocuments("Item", MarketWFRP4e.addMoneyTo(this.document, data.amount));
  }

  //#region Effects

  _prepareEffectsContext(context) {
    super._prepareEffectsContext(context);
    
    context.effects.passive = this._consolidateEffects(context.effects.passive)
    context.effects.temporary = this._consolidateEffects(context.effects.temporary)
    context.effects.disabled = this._consolidateEffects(context.effects.disabled)
    context.effects.system = game.wfrp4e.utility.getSystemEffects(this.actor.type == "vehicle");

  }


  _getConditionData(context) {
    try {
      let conditions = foundry.utils.duplicate(game.wfrp4e.config.statusEffects).map(e => new ActiveEffectWFRP4e(e));
      let currentConditions = this.actor.effects.filter(e => e.isCondition);
      delete conditions.splice(conditions.length - 1, 1)

      for (let condition of conditions) {
        let owned = currentConditions.find(e => e.conditionId == condition.conditionId)
        if (owned) {
          condition.existing = true
          condition.system.condition.value = owned.conditionValue;
        }
        else if (condition.isNumberedCondition) {
          condition.system.condition.value = 0
        }
      }
      return conditions;
    }
    catch (e)
    {
      ui.notifications.error("Error Adding Condition Data: " + e);
    }
  }

  _consolidateEffects(effects) {
    let consolidated = []
    for (let effect of effects) {
      let existing = consolidated.find(e => e.name == effect.name)
      if (!existing)
        consolidated.push(effect)
    }
    for (let effect of consolidated) {
      let count = effects.filter(e => e.name == effect.name).length
      effect.count = count
    }
    return consolidated
  }

  //#endregion

  _addEventListeners()
  {
    super._addEventListeners();
      this.element.querySelector(".system-effects")?.addEventListener("change", (ev) => {
        let key = ev.target.value;
        this.actor.addSystemEffect(key)
      })
  }


  async _handleEnrichment() {
    let enrichment = {}
    enrichment["system.details.biography.value"] = await TextEditor.enrichHTML(this.actor.system.details.biography.value, { async: true, secrets: this.actor.isOwner, relativeTo: this.actor })
    enrichment["system.details.gmnotes.value"] = await TextEditor.enrichHTML(this.actor.system.details.gmnotes.value, { async: true, secrets: this.actor.isOwner, relativeTo: this.actor })

    return expandObject(enrichment)
  }

  static async _onCreateEffect(ev)
    {
        let type = ev.currentTarget.dataset.category;
        let effectData = { name: localize("WH.NewEffect"), img: "icons/svg/aura.svg" };
        if (type == "temporary")
        {
            effectData["duration.rounds"] = 1;
        }
        else if (type == "disabled")
        {
            effectData.disabled = true;
        }

        // If Item effect, use item name for effect name
        if (this.object.documentName == "Item")
        {
            effectData.name = this.object.name;
            effectData.img = this.object.img;
        }
        this.object.createEmbeddedDocuments("ActiveEffect", [effectData]).then(effects => effects[0].sheet.render(true));
    }

    static async _onRollTest(ev)
    {
      let test;
      let document = await this._getDocumentAsync(ev);
      let options = {fields : {}};
      if (ev.target.dataset.modifier)
      {
        options.fields.modifier = Number(ev.target.dataset.modifier) || 0;
      }
      switch (ev.target.dataset.type)
      {
        case "characteristic": 
          test = await this.document.setupCharacteristic(ev.target.dataset.characteristic, options)
          break;
        case "skill":
          test = await this.document.setupSkill(document.name, options)
          break;
        case "extendedTest":
          test = await this.document.setupExtendedTest(document, options);
          break;
        case "trait":
          test = await this.document.setupTrait(document, options);
          break;
        case "weapon":
          test = await this.document.setupWeapon(document, options);
          break;
      }

      test?.roll();
    }

    static async _onContextMenu(ev)
    {
    }

    static async _toggleExtendedTests(ev)
    {
      let parent = this._getParent(ev.target, ".tab")
      Array.from(parent.querySelectorAll(".extended-tests, .skill-lists, .extended-toggle")).forEach(el => el.classList.toggle("hidden"))
    }

    static _onRemoveAttacker(ev) {
      this.actor.update({ "flags.-=oppose": null })
    }

    static _onClickCondition(ev) {
      let conditionKey = this._getParent(ev.target, ".condition")?.dataset.key
      let existing = this.actor.hasCondition(conditionKey)
      
      if (!existing?.isNumberedCondition && ev.button == 0)
      {
        this.actor.removeCondition(conditionKey);
      }
      
      ev.button == 0 ? this.actor.addCondition(conditionKey) : this.actor.removeCondition(conditionKey) 
    }


    static async _toggleSummary(ev)
    {
      let item = await this._getDocumentAsync(ev);
      if (item)
      {
        let expandData = await item.system.expandData({secrets: this.actor.isOwner});
        this._toggleDropdown(ev, expandData.description.value);
      }
    }

    async _toggleDropdown(ev, content)
    {
      let dropdownElement = this._getParent(ev.target, ".list-row").querySelector(".dropdown-content");
      if (dropdownElement.classList.contains("collapsed"))
      {
        dropdownElement.innerHTML = content;
        dropdownElement.style.height = `${dropdownElement.scrollHeight}px`;
        dropdownElement.classList.replace("collapsed", "expanded");
        // Fit content can't be animated, but we would like it be flexible height, so wait until animation finishes then add fit-content
        // sleep(500).then(() => dropdownElement.style.height = `fit-content`);
        
      }
      else if (dropdownElement.classList.contains("expanded"))
      {
        // dropdownElement.style.height = `${dropdownElement.scrollHeight}px`;
        dropdownElement.style.height = `0px`;
        dropdownElement.classList.replace("expanded", "collapsed");
      }
    }

    static async _onItemPropertyDropdown(ev) {
      let item = await this._getDocumentAsync(ev);
      let type = ev.target.dataset.type;
      let properties = Object.values(item.system.properties[type])
      if (type == "qualities")
      {
        properties = properties.concat(Object.values(item.system.properties.unusedQualities), Object.values(item.system.properties.inactiveQualities));
      }
      let propData = properties.find(p => p.display == ev.target.text);
      let key = propData.key;
      let value = propData.value;
      let propertyDescriptions = foundry.utils.mergeObject(foundry.utils.deepClone(game.wfrp4e.config.qualityDescriptions), game.wfrp4e.config.flawDescriptions);
      if (key)
      {
        let description = propertyDescriptions[key]?.replace("(Rating)", value) || `Description for ${ev.target.text} was not found`;
        
        this._toggleDropdown(ev, description)
      }
    }

    static async _onCombatDropdown(ev) {
      let property = ev.target.dataset.property;
      let item = await this._getDocumentAsync(ev);
      let description = "";

      switch(property)
      {
        case "group":
          description = game.wfrp4e.config.weaponGroupDescriptions[item.system.weaponGroup.value];
          break;
        case "reach":
          description = game.wfrp4e.config.reachDescription[item.system.reach.value];
          break;
        case "special":
          description = item.system.properties.special;
          break;
        case "specialAmmmo":
          description = item.system.properties.specialAmmo;
          break;
        case "range":
            if (!game.settings.get("wfrp4e", "mooRangeBands"))
            {

              description =
              `<a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].range[1]} ${game.i18n.localize("yds")}: ${game.wfrp4e.config.difficultyLabels[game.wfrp4e.config.rangeModifiers["Point Blank"]]}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Short Range")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Short Range")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Short Range")}`].range[1]} ${game.i18n.localize("yds")}: ${game.wfrp4e.config.difficultyLabels[game.wfrp4e.config.rangeModifiers["Short Range"]]}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Normal")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Normal")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Normal")}`].range[1]} ${game.i18n.localize("yds")}: ${game.wfrp4e.config.difficultyLabels[game.wfrp4e.config.rangeModifiers["Normal"]]}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Long Range")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Long Range")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Long Range")}`].range[1]} ${game.i18n.localize("yds")}: ${game.wfrp4e.config.difficultyLabels[game.wfrp4e.config.rangeModifiers["Long Range"]]}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Extreme")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Extreme")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Extreme")}`].range[1]} ${game.i18n.localize("yds")}: ${game.wfrp4e.config.difficultyLabels[game.wfrp4e.config.rangeModifiers["Extreme"]]}</a><br>
                `
                
            }
            //@HOUSE
            else {
              game.wfrp4e.utility.logHomebrew("mooRangeBands")
              description =
              `<a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].range[1]} ${game.i18n.localize("yds")}: ${item.system.range.bands[`${game.i18n.localize("Point Blank")}`].modifier}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Short Range")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Short Range")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Short Range")}`].range[1]} ${game.i18n.localize("yds")}: ${item.system.range.bands[`${game.i18n.localize("Short Range")}`].modifier}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Normal")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Normal")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Normal")}`].range[1]} ${game.i18n.localize("yds")}: ${item.system.range.bands[`${game.i18n.localize("Normal")}`].modifier}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Long Range")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Long Range")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Long Range")}`].range[1]} ${game.i18n.localize("yds")}: ${item.system.range.bands[`${game.i18n.localize("Long Range")}`].modifier}</a><br>
                <a data-action="rollTest" data-type="weapon" data-modifier="${item.system.range.bands[`${game.i18n.localize("Extreme")}`].modifier}">${item.system.range.bands[`${game.i18n.localize("Extreme")}`].range[0]} ${game.i18n.localize("yds")} - ${item.system.range.bands[`${game.i18n.localize("Extreme")}`].range[1]} ${game.i18n.localize("yds")}: ${item.system.range.bands[`${game.i18n.localize("Extreme")}`].modifier}</a><br>
                `
            }
          break;
      }
        
      this._toggleDropdown(ev, description)
    }

}
