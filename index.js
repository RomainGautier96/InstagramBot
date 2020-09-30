const Bot = require('./Bot');

const run = async () => {
    
    const bot = new Bot();

    await bot.initPuppeteer().then(()=>console.log('Puppeteer est executé'));

    await bot.visitInsta().then(()=>console.log("Connexion sur Insta réussie"));

    await bot.searchPublication().then(()=>console.log("Vous avez parcouru tout les tags"));

    await bot.closeBrowser().then(()=>console.log('Navigateur fermé'));

}

run().catch(e=>console.log(e.message));