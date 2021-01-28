'use strict';
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');

function setup() {
    var questions = [
    {
        type: 'input',
        name: 'url',
        message: "What is the URL of your preview?",
        validate: function (value) {
            var pass = value.match(
                /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
            );
            if (pass) {
                return true;
            }

            return 'Please enter a valid url';
        }},
        {
            type: 'confirm',
            name: 'addBorder',
            message: 'Do you want to add a border?',
            default: true,
        },
        {
            type: 'input',
            name: 'pathUrl',
            message: 'Where do you want to store the backup images?',
            default: './',
        },
        {
            type: 'input',
            name: 'exitElement',
            message: 'Which element performs your exit click?',
            default: '.mainExit',
        },

    ]

    inquirer.prompt(questions).then((answers) => {
        run(answers);
    });
}

setup();

async function run(obj) {
    let browser = await puppeteer.launch({defaultViewport:null, headless:true, defaultViewport:{
            width: 1920,
            height: 1080
        } ,args:[
            '--start-maximized'
        ]});

    let page = await browser.newPage();
    await page.goto(obj.url);

    //fix to get rid of scrollbars of iframes of the preview page
    await page.$eval('iframe', e => e.setAttribute("scrolling", "no"))

    //fix to get rid of rounded corners of the preview page
    await page.addStyleTag({content: '.mdl-card{border-radius: 0px!important}'})

    if(obj.addBorder) {
        await page.addStyleTag({content: 'iframe{box-sizing: border-box; border: 1px solid black}'})
    }


    //first do a click on each banner to go to the endframe
    let i = 0;
    for (const frame of page.mainFrame().childFrames()){

        let curPage = await page.$$("iframe");
        let curFrame = await curPage[i].contentFrame();
        let t = await curPage[i];

        await curFrame.click(obj.exitElement, {});

        await page.bringToFront();

        let frameUrl = await frame.url().split("/");
        let box = await curPage[i].boxModel()

        //if there is a hover state we want to not show this in the screenshot so therefore we move the mouse away of the banner frame
        await page.mouse.move(box.width + 1000,box.height + 1000)

        obj.pathUrl = (obj.pathUrl.charAt(obj.pathUrl.length-1).match(/\\/) != null) ? obj.pathUrl : obj.pathUrl + '\\';


        await page.screenshot({
            quality: 100,
            path: obj.pathUrl + frameUrl[frameUrl.length - 2] + '.jpg',
            type: 'jpeg',
            clip: {x: obj.addBorder ? box.content[0].x-1 : box.content[0].x , y: obj.addBorder ? box.content[0].y-1 : box.content[0].y, width: box.width, height: box.height}
        });

        i++;
    }

    await page.close();
    await browser.close();
}
