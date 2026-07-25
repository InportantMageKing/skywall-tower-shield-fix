# Tower Shield Cover Fix

A small Foundry VTT module for the PF2e system that fixes a native bug in how
"Take Cover" interacts with raised tower shields.

## The bug

When a character has a raised tower shield and uses the inline **Take Cover**
button, PF2e applies a "Greater Cover" effect (+4 circumstance bonus to AC).
When the shield is later lowered, that cover effect is never removed by the
system — it just sits on the actor indefinitely, silently inflating their AC.

## The fix

This module hooks into item creation and deletion instead of touching any
system compendium files (which would be overwritten on every PF2e update):

1. When a cover effect (`effect-cover`) is created, the module checks whether
   it carries `system.traits.otherTags: ["tower-shield"]` — the tag PF2e
   itself applies when cover comes specifically from a raised tower shield
   (as opposed to walls, other creatures, etc.). If so, it's flagged with a
   module-specific flag.
2. When the shield is lowered, PF2e deletes the `effect-raise-a-shield`
   effect item. The module listens for that deletion and removes any
   flagged cover effects from the same actor.

Both hooks were verified live against a real actor in Foundry's dev console
before being packaged into this module.

## Installation

### Manifest URL (recommended, works with FoundryServer)

In Foundry's **Add-on Modules** tab, use **Install Module** and paste:

```
https://github.com/InportantMageKing/skywall-tower-shield-fix/releases/latest/download/module.json
```

### Manual

1. Download `skywall-tower-shield-fix.zip` from the
   [latest release](https://github.com/InportantMageKing/skywall-tower-shield-fix/releases/latest).
2. Extract it into your Foundry `Data/modules/` directory so the result is
   `Data/modules/skywall-tower-shield-fix/module.json`.
3. Enable the module in your world's module settings.

## Requirements

- Foundry VTT v13+ (verified on v14)
- PF2e system v6+

## Known limitations

- Only tower shields are handled. Fortress Shield has a similar "raise and
  take cover" interaction per the rules, but it hasn't been confirmed whether
  its cover effect carries the same `"tower-shield"` tag or a different one.
  If it turns out to need separate handling, the `otherTags.includes(...)`
  check in `scripts/main.js` will need to be extended.

## License

MIT, see [LICENSE](LICENSE).
