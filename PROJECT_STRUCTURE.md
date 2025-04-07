# WFRP FoundryVTT Project Structure

This document provides a detailed technical overview of the Warhammer Fantasy Roleplay (WFRP) FoundryVTT system's codebase structure. It's designed to help new developers understand how the system is organized and functions.

## Overview

This is a FoundryVTT system implementation for the Warhammer Fantasy Roleplay tabletop game. The system provides character sheets, NPC sheets, item management, combat mechanics, skill tests, and other game-specific functionality within the Foundry Virtual Tabletop platform.

### Foundry VTT Concepts

For those new to Foundry VTT development, here are some key concepts used throughout this document:

- **System**: A game system implementation for Foundry VTT that provides rules, sheets, and mechanics for a specific game (in this case, WFRP).
- **Actor**: Represents characters, NPCs, creatures, or other entities in the game with stats and abilities.
- **Item**: Represents equipment, abilities, spells, or other objects that can be owned by actors.
- **Sheet**: The user interface for viewing and editing actors and items.
- **Compendium**: A collection of pre-defined content (actors, items, etc.) that can be imported into a game.
- **Hook**: Event triggers that allow code to run when specific actions occur in Foundry.
- **Active Effect**: A mechanism for applying temporary or permanent modifiers to actors or items.

## Directory Structure

### Root Directory

- **[wfrp4e.js](./wfrp4e.js)**: Main entry point for the system. Registers sheets, loads modules, and configures the system.
- **[system.json](./system.json)**: System manifest file that contains metadata about the system, version information, dependencies, and file paths. This file is used by Foundry VTT to identify and load the system.
- **[template.json](./template.json)**: Defines the data structure for the various Actor and Item types in the system.
- **[rollup.config.mjs](./rollup.config.mjs)**: Configuration file for the Rollup.js bundler, used to build the project.
- **[package.json](./package.json)**: NPM package configuration file, includes dependencies and build scripts.
- **[foundry-path.mjs](./foundry-path.mjs)**: Helper script for development to locate the Foundry VTT installation path.
- **[scriptPacker.js](./scriptPacker.js)**: Utility that processes the scripts in the `/scripts` directory and packs them into a loadable format.

### `/modules` vs `/src` Directories

The codebase uses two main directories for source code, which serve different purposes:

#### `/modules` Directory

Contains the core system logic organized into logical modules. This appears to be the older/established codebase with feature-complete implementations.

- **[/modules/system](./modules/system)**: Core system functionality including configs, utilities, and hooks.
  - Contains configuration objects, utility functions, and event handlers that form the foundation of the system.
  - Includes implementations for rolls, tests, and other game mechanics.
- **[/modules/model](./modules/model)**: Data models for actors, items, and other entities.
  - Defines the data structure and behavior for different types of game objects.
- **[/modules/item](./modules/item)**: Item-related functionality and logic.
  - Handles the behavior of different item types in the game.
- **[/modules/hooks](./modules/hooks)**: Foundry VTT hook handlers.
  - Contains event handlers that respond to Foundry VTT events.
- **[/modules/apps](./modules/apps)**: Application interfaces and UI components.
  - Implements dialog boxes, pop-ups, and other UI elements.
- **[/modules/actor](./modules/actor)**: Actor-related functionality and logic.
  - Manages the behavior of different actor types in the game.

#### `/src` Directory

Contains newer implementations or components under active development. The presence of V2 sheet implementations suggests this directory is for ongoing updates or rewrites of the system.

- **[/src/apps](./src/apps)**: UI components and application logic, including character sheets.
  - **[/src/apps/sheets](./src/apps/sheets)**: Sheet implementations for actors and items.
    - Contains V2 versions of the sheets, indicating a UI update or redesign in progress.

This dual-directory approach suggests a transition or refactoring effort, with established code in `/modules` and newer code in `/src`.

### `/style` Directory

CSS and styling for the system:

- **[/style/wfrp4e.scss](./style/wfrp4e.scss)**: Main SCSS entry point.
- **[/style/sheets](./style/sheets)**: CSS for the various character and item sheets.
- **[/style/mixins](./style/mixins)**: SCSS mixins for consistent styling.
- **[/style/foundry](./style/foundry)**: Styles that override or enhance Foundry VTT's default styles.

### `/scripts` Directory

Collection of effect scripts used by the system for game mechanics and automation. Each script is stored as a separate file with a UUID filename (e.g., `zadppy7FEbXvgUON.js`). These scripts:

- Implement game effects for conditions, talents, spells, and other game elements
- Manipulate actor and item data through the system API
- Handle automation for damage, tests, and other game mechanics
- Are packed into a loadable format by the [scriptPacker.js](./scriptPacker.js) utility
- Get merged into `game.wfrp4e.config.effectScripts` during system initialization
- Can be triggered by actors, items, and active effects through various hooks like `preRollTest`, `applyCondition`, etc.

This directory is a critical component of the system's automation features, allowing for complex game rules to be implemented as small, modular scripts.

See [/scripts](./scripts) for examples of individual effect scripts.

### `/packs` Directory

Compendium packs containing pre-defined game content:

- **[/packs/basic](./packs/basic)**: Contains basic items, abilities, and other game data.

Compendium packs in Foundry VTT are collections of pre-defined content that can be imported into a game. They are typically stored as JSON files and can contain actors, items, scenes, journal entries, or other game data.

### `/static` Directory

Static assets such as images, icons, and other resources used by the system. This includes:

- UI elements and icons
- Character sheet backgrounds and decorations
- Game-specific imagery
- **[/static/templates](./static/templates)**: Templates for rendering HTML content

The static directory is accessed by the system at runtime to load these resources.

### `/docs` Directory

Documentation files for the system.

## Key Components

### Actor Types

The system defines four main actor types (as seen in [template.json](./template.json)):

1. **Character**: Player characters with full character sheets.
2. **NPC**: Non-player characters with simplified sheets.
3. **Creature**: Monsters and other creatures.
4. **Vehicle**: Transportation and vehicles.

Each actor type has its own data structure defined in `template.json` and its own model class (e.g., [CharacterModel](./modules/model/actor/character.js), [NPCModel](./modules/model/actor/npc.js)) that implements type-specific behavior.

### Item Types

The system includes numerous item types for game mechanics, including:

- **Ammunition**: For ranged weapons.
- **Armour**: Protective gear.
- **Career**: Character careers/professions.
- **Container**: Storage items.
- **Critical**: Critical hit effects.
- **Disease**: Disease effects.
- **Injury**: Character injuries.
- **Money**: Currency items.
- **Mutation**: Character mutations.
- **Prayer**: Religious abilities.
- **Psychology**: Mental traits.
- **Skill**: Character skills.
- **Spell**: Magic spells.
- **Talent**: Special abilities.
- **Trait**: Innate characteristics.
- **Trapping**: General equipment.
- **Weapon**: Combat weapons.
- **Template**: Template items for data structures.

And additional specialized types like:
- **VehicleMod**: Modifications for vehicles.
- **VehicleTest**: Tests for vehicles.
- **VehicleRole**: Roles on vehicles.
- **ExtendedTest**: Complex, multi-step tests.
- **Cargo**: Items for vehicle cargo.

Each item type has its own data model (in [/modules/model/item](./modules/model/item)) and sheet implementation (in [/src/apps/sheets/item](./src/apps/sheets/item)).

### Sheet System

Each actor and item type has a dedicated sheet implementation:

- Actor sheets (in [/modules/actor/sheet](./modules/actor/sheet) and [/src/apps/sheets/actor](./src/apps/sheets/actor))
- Item sheets (in [/src/apps/sheets/item](./src/apps/sheets/item))

The system also includes a V2 version of sheets, suggesting an ongoing UI update. This approach of having type-specific sheets allows for customized interfaces that expose only the relevant data and functionality for each type of game entity.

### Data Models

The system uses data models to enforce data structure and provide behavior for game entities. This is based on Foundry VTT's document model system:

- **Document Models**: These define the structure and validation for data.
  - **Actor Models**: Define the data structure for characters, NPCs, etc.
    - [CharacterModel](./modules/model/actor/character.js): Implements player character-specific behavior and data validation.
    - [NPCModel](./modules/model/actor/npc.js): Simplified model for non-player characters.
    - [CreatureModel](./modules/model/actor/creature.js): Model for monsters and other creatures.
    - [VehicleModel](./modules/model/actor/vehicle.js): Model for transportation and vehicles.
  - **Item Models**: Define the data structure for items, abilities, etc.
    - Models like [WeaponModel](./modules/model/item/weapon.js), [SpellModel](./modules/model/item/spell.js), etc. provide specialized functionality for each item type.
  - **Effect Models**: Manage temporary or permanent modifiers to actors or items.
    - [WFRP4eActiveEffectModel](./modules/model/effect/effect.js): Implements the system's approach to effects.

Data models serve several purposes:
1. **Data Validation**: Ensuring that data conforms to the expected structure.
2. **Derived Values**: Calculating values based on other data (e.g., computing a character's combat values from their attributes).
3. **Behavior Implementation**: Providing methods that implement game mechanics related to that data.
4. **Document Initialization**: Setting up default values and configurations.

The data schemas for these models are defined in [template.json](./template.json), which serves as the blueprint for all data in the system.

### Test System

The system implements a comprehensive test resolution system with specialized classes for different test types. In WFRP, characters perform tests against their attributes or skills to determine success or failure in various activities.

The test system includes:

- **[TestWFRP](./modules/system/rolls/test-wfrp4e.js)**: Base class for all tests, handling core test mechanics like success determination and difficulty modifiers.
- **[CharacteristicTest](./modules/system/rolls/characteristic-test.js)**: Tests against character characteristics (attributes like Strength, Agility, etc.).
- **[SkillTest](./modules/system/rolls/skill-test.js)**: Skill-based tests for activities like Climbing, Stealth, etc.
- **[WeaponTest](./modules/system/rolls/weapon-test.js)**: Combat attacks with melee or ranged weapons.
- **[CastTest](./modules/system/rolls/cast-test.js)**: Spell casting attempts.
- **[WomCastTest](./modules/system/rolls/wom-cast-test.js)**: Special spell casting using Winds of Magic.
- **[ChannelTest](./modules/system/rolls/channel-test.js)**: Tests for channeling magical energy.
- **[PrayerTest](./modules/system/rolls/prayer-test.js)**: Tests for invoking divine prayers.
- **[TraitTest](./modules/system/rolls/trait-test.js)**: Tests using special traits or abilities.

Each test type implements specific rules for:
- Determining the target number (what you need to roll under to succeed)
- Calculating success levels (how well you succeeded)
- Applying appropriate modifiers based on circumstances
- Triggering special effects based on the outcome (like critical hits or fumbles)
- Sending appropriate chat messages to display results

The test system integrates with effect scripts (from the `/scripts` directory) to implement game-specific rules and automation.

## Build System

The project uses:

- **Rollup.js**: For bundling JavaScript modules.
- **SCSS**: For styling, compiled into CSS.
- **NPM scripts**: For build automation.

Build commands (defined in [package.json](./package.json)):
- `npm run build`: For development build (includes running scriptPacker.js).
- `npm run release`: For production release.
- `npm run pack`: For packing compendium content.

## System Configuration

The [system.json](./system.json) file is crucial for Foundry VTT as it defines how the system is loaded and configured. Key elements include:

- **System Identification**:
  - `id`: The unique identifier for the system ("wfrp4e").
  - `title`: The display name for the system.
  - `description`: A brief description of what the system offers.
  - `version`: The current version number.
  - `authors`: List of authors and contributors.

- **File Loading**:
  - `esmodules`: JavaScript modules to load.
  - `scripts`: Traditional JavaScript files to load.
  - `styles`: CSS files to load.
  - `packs`: Compendium packs included with the system.
  - `languages`: Localization files for different languages.

- **Foundry Compatibility**:
  - `compatibility`: Defines which Foundry VTT versions are compatible.
  - `minimumCoreVersion`: Minimum Foundry version required.
  - `compatibleCoreVersion`: Latest Foundry version tested.

- **System-Specific Configuration**:
  - `initiative`: Formula used for determining initiative in combat.
  - `primaryTokenAttribute`: The main attribute displayed on tokens (wounds/health).
  - `secondaryTokenAttribute`: Secondary attribute displayed on tokens (advantage).
  - `gridSettings`: Configuration for the game grid.

- **Media**:
  - `background`: Background image for the system.
  - `media`: Additional media resources.

- **Dependencies**:
  - `relationships`: Required modules or systems.

These configurations control how Foundry loads and initializes the system, and how the system integrates with Foundry's core features.

## Required Dependencies

The system requires the Warhammer Library module:

```
"warhammer-lib": A companion module providing additional functionality.
```

This dependency is defined in the `relationships` section of [system.json](./system.json). The Warhammer Library module provides:

- Shared functionality used across multiple Warhammer-related systems
- Common components and utilities
- Reference data and constants

The system expects version 1.7.1 or compatible of this module to be present for proper functioning.

## Naming Conventions

The codebase follows several naming conventions that are important to understand:

### Class Naming

- Classes typically follow PascalCase (e.g., `ActorWFRP4e`, `ItemWfrp4e`).
- Sheet classes often include the type in the name (e.g., `ActorSheetWFRP4eCharacter`).
- Test classes are named after the type of test they handle (e.g., `SkillTest`, `WeaponTest`).

### File Naming

- JavaScript files typically use kebab-case (e.g., `actor-sheet.js`).
- Directory names are lowercase (e.g., `actor`, `item`, `system`).
- Component files often specify their type (e.g., `character-sheet.js`, `weapon-sheet.js`).

### Data Properties

- Data properties in templates and models typically use camelCase.
- Configuration objects and constants often use SNAKE_CASE for keys.

Understanding these conventions is important for navigating the codebase and contributing to it effectively.

## Development Workflow

1. Code modifications are made in the `/modules` and `/src` directories.
2. The build process bundles these files into the format expected by Foundry VTT.
3. Data structures follow the templates defined in [template.json](./template.json).
4. The system hooks into Foundry VTT via the hooks registered in [wfrp4e.js](./wfrp4e.js).
5. Custom effect scripts can be added to the `/scripts` directory and will be automatically included in the build.

### Common Development Tasks

Here are some typical tasks and where to find the relevant code:

- **Adding a new item type**: 
  1. Define its data structure in [template.json](./template.json)
  2. Create a model class in [/modules/model/item/](./modules/model/item/)
  3. Create a sheet class in [/src/apps/sheets/item/](./src/apps/sheets/item/)
  4. Register the sheet in [wfrp4e.js](./wfrp4e.js)

- **Modifying an actor sheet**:
  1. Locate the sheet class in [/modules/actor/sheet/](./modules/actor/sheet/) or [/src/apps/sheets/actor/](./src/apps/sheets/actor/)
  2. Update the HTML template in [/static/templates/](./static/templates/)
  3. Update any CSS in [/style/sheets/](./style/sheets/)

- **Adding game automation**:
  1. Create a script in the [/scripts](./scripts) directory
  2. Reference it from items or effects that should trigger it

- **Adding a new test type**:
  1. Create a new test class extending from `TestWFRP` in [/modules/system/rolls/](./modules/system/rolls/)
  2. Implement the specific rules and logic
  3. Register or reference it from the appropriate components

---

This document provides an overview of the technical structure. For user-focused documentation, refer to the [README.md](./README.md) or official documentation. 