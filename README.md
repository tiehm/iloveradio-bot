# ILoveRadio-Bot &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)
> IMPORTANT: For educational purposes only.

Program to bot the voting from [ILoveRadio](https://iloveradio.de/).

## Installing / Getting started

To run the Bot add a ``proxies.txt`` in the root directory and paste your proxies in there. Each proxy on a new line.

Install all packages and compile the files.

```shell
npm i
tsc
```

To start the Bot up run 

````
node dist/index [songID] [vote]
````

## Configuration

``vote`` is either minus, for downvote, or plus for an upvote

``songID`` is the unique ID for the song you try to bot, you can find this by Inspect Element looking for the `data-id` attribute

## Licensing

MIT
