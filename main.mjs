import { getItOn } from "./src/app.mjs";
import { ChatLogTwitch } from "./src/chat/chat.mjs";
import { Reroll } from "./src/dialog/dialog.mjs";

Hooks.once('init', () => {
    CONFIG.ui.chat = ChatLogTwitch;
    CONFIG.ui.resources = Reroll;
    getItOn();

    game.settings.register('Tormenta-Reroll', 'ResourcesReroll', {
        name: 'Re-Rolas',
        scope: 'world',
        config: false,
        type: Number,
        default: 0,
        onChange: () => {
            ui.resources.render();
        }
    });
});

Hooks.on("getSceneControlButtons", (controls) => {
    const teste = {
        "name": "tormenta20-reroll",
        "order": Object.keys(controls).length+1,
        "title": "Reroll",
        "layer": "TokenLayer",
        "icon": "fas fa-dice",
        "visible": true,
        "tools": {
            "reroll": {
                "name": "reroll",
                "order": 1,
                "title": "Re-Rola",
                "icon": "fas fa-dice",
                onClick: () => { ui.resources.render({force: true});},
                "button": true
            }
        }
    }
    controls["tormenta20-reroll"] = teste;

});

Hooks.once('ready', function () {
    ui.resources.render({ force: true });
})