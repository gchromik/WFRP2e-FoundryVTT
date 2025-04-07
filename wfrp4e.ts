// Import Modules
import ActorSheetWFRP4e from "./modules/actor/sheet/actor-sheet.js";
import ActorSheetWFRP4eCharacter from "./modules/actor/sheet/character-sheet.js";
import ActorSheetWFRP4eNPC from "./modules/actor/sheet/npc-sheet.js";
import ActorSheetWFRP4eCreature from "./modules/actor/sheet/creature-sheet.js";
import ActorSheetWFRP4eVehicle from "./modules/actor/sheet/vehicle-sheet.js";
import ItemSheetWfrp4e from "./modules/item/item-sheet.js";
import ActorWFRP4e from "./modules/actor/actor-wfrp4e.js";
import ItemWfrp4e from "./modules/item/item-wfrp4e.js";
import registerHooks from "./modules/system/hooks.js";
import CharGenWfrp4e from "./modules/apps/chargen/char-gen.js";
import MarketWFRP4e from "./modules/apps/market-wfrp4e.js";
import NameGenWfrp from "./modules/apps/name-gen.js";
import StatBlockParser from "./modules/apps/stat-parser.js";
import BrowserWfrp4e from "./modules/apps/wfrp-browser.js";
import WFRP_Audio from "./modules/system/audio-wfrp4e.js";
import WFRP4E from "./modules/system/config-wfrp4e.js";
import ChatWFRP from "./modules/system/chat-wfrp4e.js";
import WFRP_Tables from "./modules/system/tables-wfrp4e.js";
import WFRP_Utility from "./modules/system/utility-wfrp4e.js";
import ActorSettings from "./modules/apps/actor-settings.js";
import WFRPActiveEffectConfig from "./modules/apps/effect-config.js";
import Migration from "./modules/system/migrations.js";
import HomebrewSettings from "./modules/apps/homebrew-settings.js";
import CareerSelector from "./modules/apps/career-selector.js";
import TagManager from "./modules/system/tag-manager.js";
import ItemProperties from "./modules/apps/item-properties.js";
import TestWFRP from "./modules/system/rolls/test-wfrp4e.js";
import CharacteristicTest from "./modules/system/rolls/characteristic-test.js";
import SkillTest from "./modules/system/rolls/skill-test.js";
import WeaponTest from "./modules/system/rolls/weapon-test.js";
import CastTest from "./modules/system/rolls/cast-test.js";
import WomCastTest from "./modules/system/rolls/wom-cast-test.js";
import ChannelTest from "./modules/system/rolls/channel-test.js";
import PrayerTest from "./modules/system/rolls/prayer-test.js";
import TraitTest from "./modules/system/rolls/trait-test.js";
import WFRPTableConfig from "./modules/apps/table-config.js";
import { WFRPJournalTextPageSheet } from "./modules/system/journal-sheet.js";
import { ChargenStage } from "./modules/apps/chargen/stage.js";
import { CharacterModel } from "./modules/model/actor/character.js";
import { VehicleModel } from "./modules/model/actor/vehicle.js";
import { NPCModel } from "./modules/model/actor/npc.js";
import { CreatureModel } from "./modules/model/actor/creature.js";
import { AmmunitionModel } from "./modules/model/item/ammunition.js";
import { ArmourModel } from "./modules/model/item/armour.js";
import { CareerModel } from "./modules/model/item/career.js";
import { ContainerModel } from "./modules/model/item/container.js";
import { CriticalModel } from "./modules/model/item/critical.js";
import { DiseaseModel } from "./modules/model/item/disease.js";
import { InjuryModel } from "./modules/model/item/injury.js";
import { MoneyModel } from "./modules/model/item/money.js";
import { MutationModel } from "./modules/model/item/mutation.js";
import { PrayerModel } from "./modules/model/item/prayer.js";
import { PsychologyModel } from "./modules/model/item/psychology.js";
import { TalentModel } from "./modules/model/item/talent.js";
import { TrappingModel } from "./modules/model/item/trapping.js";
import { SkillModel } from "./modules/model/item/skill.js";
import { SpellModel } from "./modules/model/item/spell.js";
import { TraitModel } from "./modules/model/item/trait.js";
import { WeaponModel } from "./modules/model/item/weapon.js";
import { ExtendedTestModel } from "./modules/model/item/extendedTest.js";
import "./modules/system/ts-example.js";

// Import scripts that should be loaded before game initialized
import loadScripts from "./loadScripts.js";

// Import scripts under active development
import { ItemSheetWfrp4eV2 } from "./src/apps/sheets/item/item-sheet.js";
import { CharacterSheetWfrp4eV2 } from "./src/apps/sheets/actor/character-sheet.js";
import { NPCSheetWfrp4eV2 } from "./src/apps/sheets/actor/npc-sheet.js";
import { CreatureSheetWfrp4eV2 } from "./src/apps/sheets/actor/creature-sheet.js";
import { VehicleSheetWfrp4eV2 } from "./src/apps/sheets/actor/vehicle-sheet.js";
import { SkillItemSheetWfrp4eV2 } from "./src/apps/sheets/item/skill-sheet.js";
import WFRP4eActiveEffectModel from "./modules/model/effect/effect.js";
import { WfrpJournalEntry } from "./modules/journal/wfrp-journal.js";

// Easier debug access
globalThis.WFRP4E = WFRP4E;

// Additional imports from type-specific sheets
import { TraitItemSheetWfrp4eV2 } from "./src/apps/sheets/item/trait-sheet.js";
import { TalentItemSheetWfrp4eV2 } from "./src/apps/sheets/item/talent-sheet.js";
import { PsychologyItemSheetWfrp4eV2 } from "./src/apps/sheets/item/psychology-sheet.js";
import { WeaponItemSheetWfrp4eV2 } from "./src/apps/sheets/item/weapon-sheet.js";
import { ArmourItemSheetWfrp4eV2 } from "./src/apps/sheets/item/armour-sheet.js";
import { AmmunitionItemSheetWfrp4eV2 } from "./src/apps/sheets/item/ammunition-sheet.js";
import { CareerItemSheetWfrp4eV2 } from "./src/apps/sheets/item/career-sheet.js";
import { ContainerItemSheetWfrp4eV2 } from "./src/apps/sheets/item/container-sheet.js";
import { CriticalItemSheetWfrp4eV2 } from "./src/apps/sheets/item/critical-sheet.js";
import { DiseaseItemSheetWfrp4eV2 } from "./src/apps/sheets/item/disease-sheet.js";
import { MoneyItemSheetWfrp4eV2 } from "./src/apps/sheets/item/money-sheet.js";
import { MutationItemSheetWfrp4eV2 } from "./src/apps/sheets/item/mutation-sheet.js";
import { PrayerItemSheetWfrp4eV2 } from "./src/apps/sheets/item/prayer-sheet.js";
import { SpellItemSheetWfrp4eV2 } from "./src/apps/sheets/item/spell-sheet.js";
import { TrappingItemSheetWfrp4eV2 } from "./src/apps/sheets/item/trapping-sheet.js";
import { ExtendedTestItemSheetWfrp4eV2 } from "./src/apps/sheets/item/extendedtest-sheet.js";
import { InjuryItemSheetWfrp4eV2 } from "./src/apps/sheets/item/injury-sheet.js";
import { TemplateItemSheetWfrp4eV2 } from "./src/apps/sheets/item/template-sheet.js";
import { VehicleRoleSheetWfrp4eV2 } from "./src/apps/sheets/item/vehicle-role-sheet.js";
import { VehicleTestSheetWfrp4eV2 } from "./src/apps/sheets/item/vehicle-test-sheet.js";
import { VehicleModSheetWfrp4eV2 } from "./src/apps/sheets/item/vehicle-mod-sheet.js";
import { CargoSheetWfrp4eV2 } from "./src/apps/sheets/item/cargo-sheet.js";

// Type declaration for global Handlebars functions
declare global {
	function loadTemplates(
		templatePaths: Record<string, string>
	): Promise<unknown>;

	interface Game {
		wfrp4e: {
			utility: typeof WFRP_Utility;
			tables: typeof WFRP_Tables;
			config: typeof WFRP4E;
			chat: typeof ChatWFRP;
			audio: typeof WFRP_Audio;
			backend: any;
			migration: typeof Migration;
			tagManager: typeof TagManager;
			effectScripts: Record<string, any>;
		};
	}
}

// Initialize system
Hooks.once("init", async function () {
	console.log(
		"Warhammer Fantasy Roleplay 4th Ed: Initializing WFRP4e System"
	);

	// Register your sheet application classes
	registerSystemSettings();
	registerSheets();
	registerDocumentClasses();
	loadScripts();
	loadHandleBarHelpers();

	// Setup all hooks for the system
	registerHooks();

	// Localize CONFIG objects
	WFRP_Utility.prepareJournalEntries();
	TagManager.prepareStatusEffects();

	// Setup socket handlers for the system
	game.wfrp4e = {} as Game["wfrp4e"];
	game.wfrp4e.utility = WFRP_Utility;
	game.wfrp4e.tables = WFRP_Tables;
	game.wfrp4e.config = WFRP4E;
	game.wfrp4e.chat = ChatWFRP;
	game.wfrp4e.audio = WFRP_Audio;
	game.wfrp4e.backend = new game.wfrp4e.utility.BackendApi();
	game.wfrp4e.migration = new Migration();
	game.wfrp4e.tagManager = TagManager;
	game.wfrp4e.effectScripts = {};
});

/**
 * Register document classes for the system
 */
function registerDocumentClasses(): void {
	CONFIG.Actor.documentClass = ActorWFRP4e;
	CONFIG.Item.documentClass = ItemWfrp4e;
	CONFIG.ActiveEffect.documentClass = WFRP4eActiveEffectModel;

	// Character
	CONFIG.Actor.dataModels.character = CharacterModel;
	CONFIG.Actor.dataModels.npc = NPCModel;
	CONFIG.Actor.dataModels.creature = CreatureModel;
	CONFIG.Actor.dataModels.vehicle = VehicleModel;

	// Item
	CONFIG.Item.dataModels.ammunition = AmmunitionModel;
	CONFIG.Item.dataModels.armour = ArmourModel;
	CONFIG.Item.dataModels.career = CareerModel;
	CONFIG.Item.dataModels.container = ContainerModel;
	CONFIG.Item.dataModels.critical = CriticalModel;
	CONFIG.Item.dataModels.disease = DiseaseModel;
	CONFIG.Item.dataModels.injury = InjuryModel;
	CONFIG.Item.dataModels.money = MoneyModel;
	CONFIG.Item.dataModels.mutation = MutationModel;
	CONFIG.Item.dataModels.prayer = PrayerModel;
	CONFIG.Item.dataModels.psychology = PsychologyModel;
	CONFIG.Item.dataModels.skill = SkillModel;
	CONFIG.Item.dataModels.spell = SpellModel;
	CONFIG.Item.dataModels.talent = TalentModel;
	CONFIG.Item.dataModels.trait = TraitModel;
	CONFIG.Item.dataModels.trapping = TrappingModel;
	CONFIG.Item.dataModels.weapon = WeaponModel;
	CONFIG.Item.dataModels.extendedTest = ExtendedTestModel;

	// Journal
	CONFIG.JournalEntryPage.sheetClasses.text.wfrp4e = {
		id: "wfrp4e",
		label: "WFRP4e",
		cls: WFRPJournalTextPageSheet,
		default: false,
	};

	CONFIG.TinyMCE.content_css.push("systems/wfrp4e/css/wfrp4e.css");
}

/**
 * Register sheet applications for the system
 */
function registerSheets(): void {
	// Legacy actor sheets
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("wfrp4e", ActorSheetWFRP4eCharacter, {
		types: ["character"],
		makeDefault: true,
	});
	Actors.registerSheet("wfrp4e", ActorSheetWFRP4eNPC, {
		types: ["npc"],
		makeDefault: true,
	});
	Actors.registerSheet("wfrp4e", ActorSheetWFRP4eCreature, {
		types: ["creature"],
		makeDefault: true,
	});
	Actors.registerSheet("wfrp4e", ActorSheetWFRP4eVehicle, {
		types: ["vehicle"],
		makeDefault: true,
	});

	// New V2 actor sheets
	Actors.registerSheet("wfrp4e", CharacterSheetWfrp4eV2, {
		types: ["character"],
		makeDefault: false,
	});
	Actors.registerSheet("wfrp4e", NPCSheetWfrp4eV2, {
		types: ["npc"],
		makeDefault: false,
	});
	Actors.registerSheet("wfrp4e", CreatureSheetWfrp4eV2, {
		types: ["creature"],
		makeDefault: false,
	});
	Actors.registerSheet("wfrp4e", VehicleSheetWfrp4eV2, {
		types: ["vehicle"],
		makeDefault: false,
	});

	// Legacy item sheets
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("wfrp4e", ItemSheetWfrp4e, {
		types: [],
		makeDefault: true,
	});

	// New V2 item sheets with separate sheet per item type
	Items.registerSheet("wfrp4e", ItemSheetWfrp4eV2, {
		types: [],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", SkillItemSheetWfrp4eV2, {
		types: ["skill"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", TraitItemSheetWfrp4eV2, {
		types: ["trait"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", TalentItemSheetWfrp4eV2, {
		types: ["talent"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", PsychologyItemSheetWfrp4eV2, {
		types: ["psychology"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", WeaponItemSheetWfrp4eV2, {
		types: ["weapon"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", ArmourItemSheetWfrp4eV2, {
		types: ["armour"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", AmmunitionItemSheetWfrp4eV2, {
		types: ["ammunition"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", CareerItemSheetWfrp4eV2, {
		types: ["career"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", ContainerItemSheetWfrp4eV2, {
		types: ["container"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", CriticalItemSheetWfrp4eV2, {
		types: ["critical"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", DiseaseItemSheetWfrp4eV2, {
		types: ["disease"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", MoneyItemSheetWfrp4eV2, {
		types: ["money"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", MutationItemSheetWfrp4eV2, {
		types: ["mutation"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", PrayerItemSheetWfrp4eV2, {
		types: ["prayer"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", SpellItemSheetWfrp4eV2, {
		types: ["spell"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", TrappingItemSheetWfrp4eV2, {
		types: ["trapping"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", ExtendedTestItemSheetWfrp4eV2, {
		types: ["extendedTest"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", InjuryItemSheetWfrp4eV2, {
		types: ["injury"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", TemplateItemSheetWfrp4eV2, {
		types: ["template"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", VehicleRoleSheetWfrp4eV2, {
		types: ["vehicleRole"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", VehicleTestSheetWfrp4eV2, {
		types: ["vehicleTest"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", VehicleModSheetWfrp4eV2, {
		types: ["vehicleMod"],
		makeDefault: false,
	});
	Items.registerSheet("wfrp4e", CargoSheetWfrp4eV2, {
		types: ["cargo"],
		makeDefault: false,
	});
}

/**
 * Register system settings
 */
function registerSystemSettings(): void {
	game.settings.register("wfrp4e", "useWomChannelling", {
		name: "SETTINGS.UseWomChannellingN",
		hint: "SETTINGS.UseWomChannellingL",
		scope: "world",
		type: Boolean,
		default: false,
		config: true,
	});
}

/**
 * Load Handlebars helper functions
 */
function loadHandleBarHelpers(): void {
	// This function appears to be referenced but not defined in the original code
	// It should contain the implementation for loading Handlebars helpers
	console.log("Loading Handlebars helpers");
}
