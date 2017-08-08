const tcpp = require('./ping_backup');

tcpp.ping({address: 'download.jeetwin.com'}, (err, data) => {
    console.log(JSON.stringify(data));
});