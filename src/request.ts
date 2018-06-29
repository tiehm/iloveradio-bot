import * as unirest from 'unirest';
import * as Charlog from 'charlog';

const Logger = new Charlog({
    tag: 'VOTE',
    setTagLength: 5,
    setFileLength: 12,
    loggers: {
        info: {
            color: 'blue',
            tag: 'info'
        }
    }
});

function genUID (n, d) : string {
    n = '' + n;
    while (n.length < d) {
        n = '0' + n;
    }
    return n;
}

function getUID() : string {
    return genUID(Math.round(Math.random() * 100000), 6) + genUID(Math.round(Math.random() * 100000), 6);
}

function genURL(id, type) : string {
    return `https://www.iloveradio.de//typo3conf/ext/ep_channel/Scripts/voting.php?r=${Math.ceil(Math.random() * 100000)}&tx_epvoting_voting_vote[vote]=${id}&tx_epvoting_voting_vote[math]=${type}&tx_epvoting_voting_vote[uniqueid]=${getUID()}`
}

export function request (proxy: string, song: string, vote: string) : Promise<boolean> {
    return new Promise<boolean>(resolve => {

        try {
            let r = unirest.get(genURL(song, vote));
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
                    Logger.error('Request failed with proxy %a | Error %a', proxy, response.error);
                    return resolve(false);
                }
                if (response && response.status === 200) {
                    Logger.success('Request success with proxy %a | Code %a', proxy, response.status);
                    return resolve(true);
                } else if (response && response.status) {
                    Logger.error('Request failed with proxy %a | Code %a', proxy, response.status);
                    return resolve(false);
                } else {
                    Logger.error('Request failed with proxy %a | Code %a', proxy, 'NO RETURN');
                    return resolve(false);
                }
            })

        } catch (e) {
            Logger.error('Unknown Error');
            console.error(e);
        }

    });
}
