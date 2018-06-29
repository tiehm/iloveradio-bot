import * as Charlog from 'charlog';
import * as path    from 'path';
import * as fs      from 'fs';
import { request }  from './request';

// suppress warning for TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Logger = new Charlog({
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
const SongID: string = process.argv[2];
// plus for upvote, minus for down vote
const Vote: string = process.argv[3];

if (!SongID) {
    Logger.error('Please give a valid Song ID.');
    process.exit(1);
}
if (!Vote || (Vote !== 'minus' && Vote !== 'plus')) {
    Logger.error('Please give a valid Vote, is can either be %a or %a.', 'plus', 'minus');
    process.exit(1);
}

fs.readFile(path.join(__dirname, '../', 'proxies.txt'), {encoding: 'utf-8'}, async (err, data) => {

    if (err) throw err;
    const proxies: string[] = data.split('\n');
    Logger.info('Reading proxies, total proxies: %a', proxies.length);

    for (let proxy of proxies) {
        if (proxy === '') continue;
        await request(proxy, SongID, Vote);
    }

});
