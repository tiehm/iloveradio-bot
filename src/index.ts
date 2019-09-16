import * as Charlog from 'charlog';
import * as path    from 'path';
import * as fs      from 'fs';
import { request }  from './request';

// suppress warning for TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const logger = new Charlog({
    tag: 'MAIN',
    setTagLength: 5,
    setFileLength: 12,
    loggers: {
        info: {
            color: 'blue',
            tag: 'info'
        }
    }
});

// Unique ID of the song
const songID: string = process.argv[2];
// plus for upvote, minus for down vote
const voteType: 'minus'|'plus' = process.argv[3] as 'minus'|'plus';

if (!songID) {
    logger.error('Please give a valid Song ID.');
    process.exit(1);
}
if (!voteType || (voteType !== 'minus' && voteType !== 'plus')) {
    logger.error('Please give a valid Vote, is can either be %a or %a.', 'plus', 'minus');
    process.exit(1);
}

fs.readFile(path.join(__dirname, '../', 'proxies.txt'), {encoding: 'utf-8'}, async (err, data) => {

    if (err) throw err;
    const proxies: string[] = data.split('\n');
    logger.info('Reading proxies, total proxies: %a', proxies.length);

    for (let proxy of proxies) {
        if (proxy === '') continue;
        console.log(proxy);
        await request(proxy, songID, voteType);
    }

});
