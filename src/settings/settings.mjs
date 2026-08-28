export class DHAppearanceSettings extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

    static DEFAULT_OPTIONS = {
        tag: 'form',
        id: 'appearance-settings',
        classes: ['twitch-module', 'dialog', 'setting', 'appearance-settings'],
        position: { width: '600', height: 'auto' },
        window: {
            title: 'Settings',
            icon: 'fa-solid fa-gears'
        },
        actions: {
            reset: DHAppearanceSettings.#onReset,
        },
        form: {
            closeOnSubmit: true,
            handler: DHAppearanceSettings.#onSubmit
        }
    };

    static async #onSubmit(_event, _form, formData) {
        const data = this.setting.schema.clean(foundry.utils.expandObject(formData.object));

        await game.settings.set(CONFIG.TM.id, CONFIG.TM.SETTINGS.gameSettings.appearance, data);
    }

    static async #onReset() {
        this.setting = new this.setting.constructor();
        this.render({ force: false });
    }
}