class InstaBot{

    constructor(){
        this.firebase = require('./firebase_db');
        this.config = require('./config/puppeteer.json')
    }

    async initPuppeteer(){
        const puppeteer = require('puppeteer');
        this.browser = await puppeteer.launch({
            headless: this.config.settings.headless
        });
        this.page = await this.browser.newPage();
        await this.page.setViewport({width:1500, height:764});
    }

    async visitInsta(){
        await this.page.goto(this.config.base_url);
        await this.page.waitForTimeout(2500);
        // On accede a et on rempli l'input Username
        await this.page.click(this.config.selectors.username_field);
        await this.page.keyboard.type(this.config.username);
        // On accede a et on rempli l'input Password
        await this.page.click(this.config.selectors.password_field);
        await this.page.keyboard.type(this.config.password);
        //On click sur le bouton login (input type submit)
        await this.page.click(this.config.selectors.login_button);
        await this.page.waitForTimeout(5000);
        //On click sur le bouton "Plus tard"
        await this.page.click(this.config.selectors.memory_button);
        await this.page.waitForTimeout(2500);
        //On click sur le bouton "Plus tard"
        await this.page.click(this.config.selectors.notif_button);
    }

    async searchPublication(){
        let utilisateurs = new Map();

        let numTags = this.config.searchTags.length;

        for(let tag=0; tag < numTags; tag++){
            const tagToSearch = this.config.searchTags[tag];
            const searchUrl = `https://instagram.com/explore/tags/${tagToSearch}`;

            await this.page.waitForTimeout(2000);
            await this.page.goto(searchUrl);
            await this.page.waitForTimeout(2000);
            console.log(`Acces à la page de ${tagToSearch} reussi`);

            for(let i = 1; i<4;i++){
                for(let j=1; j<4; j++){
                    let publicationSelector = this.config.selectors.list_publication.replace('INDEX1',i).replace('INDEX2',j);
                    await this.page.click(publicationSelector);
                    await this.page.waitForTimeout(2000);

                    const text_follow = await this.page.evaluate((x) => {
                        return document.querySelector(x).innerHTML;
                    }, this.config.selectors.follow_button);
                    console.log(text_follow);
                    if(text_follow !== "Abonné(e)"){
                        await this.page.click(this.config.selectors.follow_button);

                        let utilisateur = await this.page.evaluate((v)=>{
                            return document.querySelector(v).innerHTML;
                        },this.config.selectors.user_name);

                        utilisateurs['name'] = utilisateur;

                        this.firebase.writeUserData(utilisateurs);
                    }

                    const color_like = await this.page.evaluate((x) => {
                        return document.querySelector(x).getAttribute('fill');
                    }, this.config.selectors.like_button);
                    console.log(color_like);
                    if(color_like !== '#ed4956'){
                        await this.page.click(this.config.selectors.like_button);
                    }

                    await this.page.click(this.config.selectors.cross_publication);
                    await this.page.waitForTimeout(2000);
                }
            }
        }
    }

    async closeBrowser(){
        await this.browser.close();
    }
}


module.exports = InstaBot;