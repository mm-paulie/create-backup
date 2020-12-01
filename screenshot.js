'use strict';
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');

async function run() {
    var questions = [
        {
            type: 'confirm',
            name: 'toBeDelivered',
            message: 'Is this for delivery?',
            default: false,
        },
        {
            type: 'input',
            name: 'phone',
            message: "What's your phone number?",
            validate: function (value) {
                var pass = value.match(
                    /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
                );
                if (pass) {
                    return true;
                }

                return 'Please enter a valid phone number';
            },
        },
        {
            type: 'list',
            name: 'size',
            message: 'What size do you need?',
            choices: ['Large', 'Medium', 'Small'],
            filter: function (val) {
                return val.toLowerCase();
            },
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you need?',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number,
        },
        {
            type: 'expand',
            name: 'toppings',
            message: 'What about the toppings?',
            choices: [
                {
                    key: 'p',
                    name: 'Pepperoni and cheese',
                    value: 'PepperoniCheese',
                },
                {
                    key: 'a',
                    name: 'All dressed',
                    value: 'alldressed',
                },
                {
                    key: 'w',
                    name: 'Hawaiian',
                    value: 'hawaiian',
                },
            ],
        },
        {
            type: 'rawlist',
            name: 'beverage',
            message: 'You also get a free 2L beverage',
            choices: ['Pepsi', '7up', 'Coke'],
        },
        {
            type: 'input',
            name: 'comments',
            message: 'Any comments on your purchase experience?',
            default: 'Nope, all good!',
        },
        {
            type: 'list',
            name: 'prize',
            message: 'For leaving a comment, you get a freebie',
            choices: ['cake', 'fries'],
            when: function (answers) {
                return answers.comments !== 'Nope, all good!';
            },
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        console.log('\nOrder receipt:');
        console.log(JSON.stringify(answers, null, '  '));
    });

















    //
    // let browser = await puppeteer.launch({defaultViewport:null, headless:true, defaultViewport:{
    //         width: 1920,
    //         height: 1080
    //     } ,args:[
    //         '--start-maximized'
    //     ]});
    //
    // let page = await browser.newPage();
    // await page.goto('https://paypal-holiday-2020.ap.dev.monkapps.com/v5_ja_jp/');
    //
    //
    // //first do a click on each banner to go to the endframe
    // let i = 0;
    // for (const frame of page.mainFrame().childFrames()){
    //
    //     let curPage = await page.$$("iframe");
    //     let curFrame = await curPage[i].contentFrame();
    //     let t = await curPage[i];
    //     await curFrame.click('.mainExit');
    //     // await page.click('.page-content')
    //     // await page.waitFor(2000);
    //     await page.bringToFront();
    //     // blockingWait(1);
    //
    //     let frameUrl = await frame.url().split("/");
    //
    //     let box = await curPage[i].boxModel()
    //
    //     await page.screenshot({
    //         quality: 100,
    //         path: './' + frameUrl[frameUrl.length - 2] + '.jpg',
    //         type: 'jpeg',
    //         clip: {x: box.content[0].x, y: box.content[0].y, width: box.width, height: box.height}
    //     });
    //
    //     i++;
    // }
    //
    // await page.close();
    // await browser.close();
}

run();