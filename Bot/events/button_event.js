module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        switch(interaction.customId){
            case 'claim_temp':
                break;
            case 'lock_temp':
                break;
            case 'hide_temp':
                break;
        }
    }
}
