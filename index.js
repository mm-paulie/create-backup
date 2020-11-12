const puppeteer = require('puppeteer');

async function run() {
    let browser = await puppeteer.launch({defaultViewport:null, headless:true, defaultViewport:{
            width: 1920,
            height: 1080
        } ,args:[
            '--start-maximized'
        ]});

    let page = await browser.newPage();
    await page.goto('http://richmedia-previews-s3bucket-khpmpnjb2dya.s3.amazonaws.com/4d06fe14-676d-4d44-a3a4-442e7e1d8c76/test_paulie/index.html');


    //first do a click on each banner to go to the endframe
    let i = 0;
    for (const frame of page.mainFrame().childFrames()){

        let curPage = await page.$$("iframe");
        let curFrame = await curPage[i].contentFrame();
        let t = await curPage[i];
        await curFrame.click('.mainExit');



        i++;
    }
    await page.click('.page-content')
    // await page.waitFor(2000);
    // await page.bringToFront();

    //take a screenshot of each endframe
    let j = 0;
    for (const frame of page.mainFrame().childFrames()) {
        let frameUrl = await frame.url().split("/");
        let curPage = await page.$$("iframe");
        let curFrame = await curPage[j].contentFrame();

        let box = await curPage[j].boxModel()
        await page.screenshot({
            quality: 100,
            path: './' + frameUrl[frameUrl.length - 2] + '.jpg',
            type: 'jpeg',
            clip: {x: box.content[0].x, y: box.content[0].y, width: box.width, height: box.height}
        });
        j++;
    }
    await page.close();
    await browser.close();
}

run();