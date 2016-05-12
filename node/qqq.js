/**
 * Created by ThinkPad on 2016/4/18.
 */
"use strict";
function * getRadioSongs(languages, classes, artists, totalOfSongs, energyRange, tempoRange, playedSongIds) {
    if (!classes || classes.length === 0 ) {
        let searchCondition = {
            random: {$gte: Math.random()},
            tempo: {$gte: tempoRange.min, $lt: tempoRange.max},
            _id: {$nin: playedSongIds} //去重复
        };
        if (energyRange) searchCondition["echonest.energy"]= {$gte: energyRange.min, $lte: energyRange.max};

        return yield SongModel.find(searchCondition,SONG_COLUMNS)
            .limit(totalOfSongs)
            .lean();
    }

    let totlesongs = [];
    let num = languages.length * classes.length;
    for(let i = 0; i< classes.length; i ++) {
        for (let j =0;j < languages.length;j++){
            let songs = [];
            let numofone = Math.ceil(totalOfSongs / num); //每个类目下的歌曲数量
            for (let k = 0; k < artists.length; k++) {
                if (classes[i] == artists[k]["class"] && languages[j]==artists[k]["language"]){

                    artists[k]["similar"].sort(function(){return 0.5 - Math.random() }); //打乱顺序

                    let controlNum = 0;
                    while (controlNum < numofone && controlNum < artists[k]["similar"].length){
                        let searchCondition1 = {
                            random: {$gte: Math.random()},
                            tempo: {$gte: tempoRange.min, $lt: tempoRange.max},
                            // "_id": {$nin: historyIds},
                            "artistInfo.xiamiId":artists[k]["similar"][controlNum],
                            _id: {$nin: playedSongIds}
                        };
                        if (energyRange) searchCondition1["echonest.energy"]= {$gte: energyRange.min, $lte: energyRange.max};
                        let oneRecord = yield SongModel.find(searchCondition1,SONG_COLUMNS)
                            .limit(1)//这里随机数的部分需要改一下
                            .lean();
                        if (!_.isEmpty(oneRecord)) songs.push(oneRecord[0]);

                        controlNum++;
                    }
                }
            }

            if (songs.length < numofone) {
                // let random column become more selective
                let random = Math.random();
                let randomRange = config.radioRandomRange === 1
                    ? {$gte: 0, $lt: 1}
                    : (random < 0.5
                    ? {$gte: random, $lt: random + 0.1 }
                    : {$gte: random - 0.1, $lt: random})
                let searchCondition2 = {
                    random: randomRange,
                    "tempo": {$gte: tempoRange.min, $lt: tempoRange.max},
                    //"_id": {$nin: historyIds},
                    "artistInfo.language": languages[j],
                    "artistInfo.class": classes[i],
                    _id: {$nin: playedSongIds}
                };
                if (energyRange) searchCondition2["echonest.energy"]= {$gte: energyRange.min, $lte: energyRange.max};

                //let count = yield  SongModel.find(searchCondition2).count();
                let records = yield SongModel.find(searchCondition2, SONG_COLUMNS)
                    //.skip(parseInt((count <= numofone ? 0 : count - numofone) * Math.random()))
                    .limit(numofone - songs.length)
                    .lean();

                songs = songs.concat(records);
            }
            totlesongs = totlesongs.concat(songs);
        }
    }
    return totlesongs;
}