Hooks.once("ready", () => {
    const MODULE_FLAG = "skywall-tower-shield-fix";

    // Tag cover effects that specifically originate from a raised tower shield
    Hooks.on("preCreateItem", (item, data, options, userId) => {
        if (item.type !== "effect") return;
        if (item.slug !== "effect-cover") return;

        const isTowerShieldCover = item.system?.traits?.otherTags?.includes("tower-shield");
        if (!isTowerShieldCover) return;

        item.updateSource({
            flags: {
                [MODULE_FLAG]: { tagged: true }
            }
        });
    });

    // Clean up tagged cover the moment Raise a Shield is removed (i.e. shield lowered)
    Hooks.on("deleteItem", (item) => {
        if (item.slug !== "effect-raise-a-shield") return;

        const actor = item.actor;
        if (!actor) return;

        const taggedCover = actor.itemTypes.effect.filter(
            (e) => e.flags?.[MODULE_FLAG]?.tagged === true
        );

        if (taggedCover.length > 0) {
            actor.deleteEmbeddedDocuments("Item", taggedCover.map((e) => e.id));
            ui.notifications.info(`Removed ${taggedCover.length} tower-shield cover effect(s) since the shield was lowered.`);
        }
    });
});
