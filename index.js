const fs = require('fs');
const path = require('path');
const unirest = require('unirest');
const chalk = require('chalk');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let idA = process.argv[2];
let typeA = process.argv[3];


if (!idA || !typeA) {
    console.log('Not a valid type or id');
    process.exit();
}

fs.readFile(path.join(__dirname, 'proxies.txt'), 'utf8', async (err, data) => {
    if (err) throw err;

    data = data.split('\n');

    for (let i of data) {
        if (i !== '') {
            await sendHTTP(i);
        }
    }

});

function genUID(n, d) {
    n = '' + n;
    while (n.length < d) {
        n = '0' + n;
    }
    return n;
}

function getUID() {
    return genUID(Math.round(Math.random() * 100000), 6) + genUID(Math.round(Math.random() * 100000), 6);
}

function genURL(id, type) {
    return `https://www.iloveradio.de//typo3conf/ext/ep_channel/Scripts/voting.php?r=${Math.ceil(Math.random() * 100000)}&tx_epvoting_voting_vote[vote]=${id}&tx_epvoting_voting_vote[math]=${type}&tx_epvoting_voting_vote[uniqueid]=${getUID()}`
}

function sendHTTP(proxy) {
    return new Promise(resolve => {
        try {

            let r = unirest.get(genURL(idA, typeA));
            r.headers({
                'Host': 'www.iloveradio.de',
                'Referer': 'https://www.iloveradio.de/voting/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            });
            r.proxy('http://' + proxy);
            r.timeout(1000 * 20);

            r.end(response => {
                if (response.error) {
                    console.log(`${chalk.red('[REQUEST]')} Failed with proxy ${proxy} | Error: ${response.error}`);
                    return resolve(false);

                }
                if (response && response.status === 200) {
                    console.log(`${chalk.green('[REQUEST]')} Success with proxy ${proxy} | Code: ${response.status}`);
                    return resolve(true);
                } else if (response && response.status) {
                    console.log(`${chalk.red('[REQUEST]')} Failed with proxy ${proxy} | Code: ${response.status}`);
                    return resolve(false);
                } else {
                    console.log(`${chalk.red('[REQUEST]')} Failed with proxy ${proxy} | Code: NO RETURN`);
                    return resolve(false);
                }
            })

        } catch (e) {
            console.log(e)
        }
    });
}

