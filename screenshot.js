'use strict';
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');

async function run() {

    let browser = await puppeteer.launch({defaultViewport:null, headless:true, defaultViewport:{
            width: 1920,
            height: 1080
        } ,args:[
            '--start-maximized'
        ]});

    let page = await browser.newPage();
    await page.goto('https://sanofi-france-physiomer.eu.dev.monkapps.com/v6/');


    //first do a click on each banner to go to the endframe
    let i = 0;
    for (const frame of page.mainFrame().childFrames()){

        let curPage = await page.$$("iframe");
        let curFrame = await curPage[i].contentFrame();
        let t = await curPage[i];
        await curFrame.click('.mainExit');
        // await page.click('.page-content')
        // await page.waitFor(2000);
        await page.bringToFront();
        // blockingWait(1);

        let frameUrl = await frame.url().split("/");

        let box = await curPage[i].boxModel()

        await page.screenshot({
            quality: 100,
            path: './' + frameUrl[frameUrl.length - 2] + '.jpg',
            type: 'jpeg',
            clip: {x: box.content[0].x, y: box.content[0].y, width: box.width, height: box.height}
        });

        i++;
    }

    await page.close();
    await browser.close();
}

run();