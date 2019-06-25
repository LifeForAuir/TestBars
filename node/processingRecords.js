#!/usr/bin/env nodejs
var debug = require('debug')('restapi');
var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');
var log = require(libs + 'log')(module);
var db = require(libs + '/db/pg');
var execSync = require('child_process').execSync;
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var storage_dir = config.get('storage:dir');
var async = require('async');
//mp3info -p "%S"


db.qw('select id, filepath, recordtime  from audiorecords where (status=0 or status is null or status = 2) and achived = false and recordtime=0 and datestampstart >= \'2016-04-01\' order by datestampstart limit 100', db.qrm.many)
            .then(function (data) {
		//async.each(data,
                data.forEach(
                    function(val, ind){
                        processFile(val);
                        
                        console.log('Обработан ' + val.filepath );
                    }
                );
                updateRecord(data);
                
                //process.exit(0);
            })
            .catch(function (error) {
                console.log(error);
                log.error('Internal error %s', error.toString());
                process.exit(1);
            });

function processFile(data){
    
    var imgFile = path.join(storage_dir, data.filepath + '.png');
    var OriginMp3File = path.join(storage_dir, data.filepath);
    var cmdExec = '';
    
    if(!fs.existsSync(OriginMp3File))
    {
        console.log('не найден ' + OriginMp3File);
        data['durationFact'] = 0;
        return 0;
    }
    /*
    if (!fs.existsSync(imgFile)){
        
        var tmpMp3File = path.join('/tmp', path.basename(data.filepath) + '.mp3');
        var tmpPngFile = path.join('/tmp', path.basename(data.filepath) + '.png');
        
        cmdExec = 'cp "' + OriginMp3File + '" "' + tmpMp3File + '" && sox "' 
                + tmpMp3File + '" -n spectrogram -y 65 -x 200 -l -r -o "' + tmpPngFile + '" && mv "' + tmpPngFile +  '" "' + imgFile +  '"'
                + ' && rm "' + tmpMp3File + '"';
        try {
            var child = execSync(cmdExec);
        } catch (e) {
            console.log(e);
            log.error(e);
            log.error(e.stack);
        }
    }*/

    cmdExec = 'mp3info -p "%S" "' + OriginMp3File + '"';
    //console.log(cmdExec);
    try
    {
        var child = execSync(cmdExec);
        data['durationFact'] = Number(child.toString()) / 60.0;
    }
    catch (e) 
    {
        console.log(e);
        log.error(e);
        log.error(e.stack);
        data['durationFact'] = data.recordtime;
    }
}

function updateRecord(targetCollection){
    var data = targetCollection.pop();
    if(data)
    {
        console.log('starting update ' + data.filepath);
        db.qw('update audiorecords set status = 1, recordtime = ${durationFact} where id = ${id}', data)
                .then(function (res) {
                    console.log('update ' + data.filepath  + ' done.');
                    updateRecord(targetCollection);
                })
                .catch(function (error) {
                    console.log(error);
                    log.error('Internal error %s', error.toString());
                    //process.exit(1);
                });
    }
    else
    {
        process.exit(0);
    }
}

