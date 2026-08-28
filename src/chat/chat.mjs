export class ChatLogTwitch extends foundry.applications.sidebar.tabs.ChatLog {
    static DEFAULT_OPTIONS = {
        actions: {
            Reroll: _Reroll
        }
    }

    _getEntryContextOptions() {
        const options = super._getEntryContextOptions();
        options.push({
            name: "Rerrolar",
            icon: foundry.applications.fields.createFontAwesomeIcon("dice").outerHTML,
            condition: (li) => {
                const message = game.messages.get(li.getAttribute('data-message-id'));
                const rerrols = game.settings.get('Tormenta-Reroll', 'ResourcesReroll');

                return (
                    // Is the GM or is the message author
                    (game.user.isGM || message.isAuthor) && rerrols > 0
                )
            },
            callback: (li) => _Reroll(li)
        }), options;

        return options
    }
}

async function _Reroll(roll) {
    const rerrols = game.settings.get('Tormenta-Reroll', 'ResourcesReroll');
    game.settings.set('Tormenta-Reroll', 'ResourcesReroll', rerrols - 1);
    const messageId = roll.getAttribute('data-message-id')
    const message = game.messages.get(messageId);
    if (message.isRoll) {
        const originalRoll = message.rolls.map(roll => roll)[0];
        let parsedRoll = Roll.fromData({
            class: originalRoll.class,
            options: originalRoll.options,
            dice: [],
            formula: originalRoll.formula,
            terms: [...originalRoll.terms],
            total: originalRoll.total,
            evaluated: false
        });
        const term = parsedRoll.terms[0];
        await term.reroll(`/r1=${term.total}`);
        const result = await parsedRoll.evaluate();
        if (game.modules.get('dice-so-nice')?.active) {
            const diceSoNiceRoll = {
                _evaluated: true,
                dice: [
                    new foundry.dice.terms.Die({
                        ...term,
                        faces: term._faces,
                        results: term.results.filter(x => !x.rerolled)
                    })
                ],
                options: { appearance: {} }
            };

            await game.dice3d.showForRoll(diceSoNiceRoll, game.user, true);
        }
        let content = message.content.toString();
        content = content.replace(`<h4 class="dice-total">${originalRoll.total}</h4>`, `<h4 class="dice-total">${result.total}</h4>`); 6
        content = content.replace(roll.querySelector(".d20").outerHTML, `<li class="roll die d20">${term.total}</li>`)
        content = content.replace(roll.querySelector(".part-total").outerHTML, `<span class="part-total">${term.total}</span>`)
        await message.update({
            'flags.tormenta20.rollTotal': result._total,
            'rolls': [parsedRoll],
            'content': content
        });
    }
}