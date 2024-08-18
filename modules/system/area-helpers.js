export default class AreaHelpers
{
    /**
     * Determines if a coordinate is within a Template's strokes
     *
     * @param {Object} {x, y} object being tested
     * @param {Template} template Template object being tested
     * @returns
     */
    static isInTemplate(point, template)
    {
        if (template.document.t == "rect")
        {
            return this._isInRect(point, template);
        }
        else if (["ray", "cone"].includes(template.document.t))
        {
            return this._isInPolygon(point, template);
        }
        else if (template.document.t == "circle")
        {
            return this._isInEllipse(point, template);
        }
    }


    /**
     * Get all Tokens inside template
     *
     * @returns
     */
    static tokensInTemplate(template)
    {
        let scene = template.scene;
        let tokens = scene.tokens.contents;
        return tokens.filter(t => this.isInTemplate(t.object.center, template));
    }

    // Perhaps this is expensive to run on every token update
    // but works for now
    static async checkAreas(scene)
    {
        scene = scene || canvas.scene;
        if (!scene)
        {
            return;
        }
        let tokens = scene.tokens;
        let templates = scene.templates.contents.map(t => t.object).concat(await this.aurasInScene(scene));

        for(let token of tokens)
        {
            for(let template of templates)
            {
                // An area could be a template, but could be an effect (aura)
                let areaUuid = (template.document.id ? template.document?.uuid : template.document.flags.wfrp4e.effectUuid);

                let existingEffect = token.actor?.currentAreaEffects.find(effect => effect.getFlag("wfrp4e", "fromArea") == areaUuid && !effect.system.transferData.area.keep);
                let inTemplate = this.isInTemplate(token.object.center, template)
                if (inTemplate && !existingEffect)
                {
                    let effect = await template.document.areaEffect() || template.auraEffect
                    if (effect && template.auraEffect?.actor != token.actor) // Specifically don't apply auras to self
                    {
                        // if template was placed from a test
                        let messageId = template.document?.getFlag("wfrp4e", "messageId")
                        let effectData = effect.convertToApplied(game.messages.get(messageId)?.system.test);
                        foundry.utils.setProperty(effectData, "flags.wfrp4e.fromArea",  areaUuid);
                        // Can't just send UUID because we need to include fromArea flags
                        token.actor?.applyEffect({effectData : [effectData], messageId});
                    }
                }
                else if (!inTemplate && existingEffect && !template.document.getFlag("wfrp4e", "instantaneous")) // If not in template, remove all effects originating from that template
                {
                    existingEffect.delete();
                }
            }

            // Remove effects that are from templates that don't exist anymore
            for(let effect of token.actor?.effects.filter(e => e.getFlag("wfrp4e", "fromArea") && !e.system.transferData.area.keep) || [])
            {
                let fromId = effect.getFlag("wfrp4e", "fromArea")
                let foundTemplate = templates.find(t => {
                    let areaUuid = (t.document.id ? t.document?.uuid : t.document.flags.wfrp4e.effectUuid);
                    return fromId == areaUuid
                })
                
                if (!foundTemplate)
                {
                    effect.delete();
                }
            }
        }
    }


    // Create temporary MeasuredTemplates so that auras can
    // be processed the same way as normal Area effects
    static aurasInScene(scene)
    {
        let templates = []
        for (let token of scene.tokens)
        {
            if (!token.actor)
                continue;

            let auraEffects = token.actor.auras;
            for (let effect of auraEffects)
            {
                templates.push(this.effectToTemplate(effect));
            }
        }

        return Promise.all(templates);
    }

    static effectToTemplate(effect)
    {
        let token = effect.actor.getActiveTokens()[0];
        let template = new MeasuredTemplate(new CONFIG.MeasuredTemplate.documentClass(foundry.utils.mergeObject({
            t: "circle",
            _id : effect.id,
            user: game.user.id,
            distance: effect.radius,
            direction: 0,
            x: token.center.x, // Using the token x/y will double the template's coordinates, as it's already a child of the token
            y: token.center.y, // However, this is necessary to get tho correct grid highlighting. The template's position is corrected when it's rendered (see renderAura)
            fillColor: game.user.color,
            flags: {
                wfrp4e: {
                    effectUuid: effect.uuid
                }
            }
            }, effect.flags.wfrp4e?.system.transferData.area?.templateData || {}), {parent : canvas.scene}));

        // For some reason, these temporary templates have 0,0 as their coordinates
        // instead of the ones provided by the document, so set them manually
        template.x = template.document.x;
        template.y = template.document.y;
        template.auraEffect = effect;
        return template
    }
}