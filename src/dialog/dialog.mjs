export class Reroll extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

    constructor(options = {}) {
        super(options);
    }

    static DEFAULT_OPTIONS = {
        id: 'resources',
        classes: ['rerrola-dialog'],
        tag: 'div',
        window: {
            frame: true,
            title: 'Re-rolas',
            positioned: true,
            resizable: true,
            minimizable: true
        },
        actions: {
            setReroll: this.setReroll
        },
        position: {
            width: 200,
            height: 110
        }
    };

    static PARTS = {
        resources: {
            root: true,
            template: 'modules/tormenta20-reroll/templates/dialog/dialog.hbs'
        }
    };

    get currentRerolls() {
        return game.settings.get('Tormenta-Reroll', 'ResourcesReroll');
    }

    async _prepareContext(_options) {
        const current = this.currentRerolls, isGM = game.user.isGM;

        return { current, isGM };
    }

    static async setReroll(event, target) {
        if (!game.user.isGM) return;
        const rerollCount = target.dataset.reroll;
        await this.updateReroll(rerollCount == "minus" ? this.currentRerolls - 1 : this.currentRerolls + 1)
    }

    async updateReroll(value) {
        return game.settings.set('Tormenta-Reroll', 'ResourcesReroll', value);
    }

}