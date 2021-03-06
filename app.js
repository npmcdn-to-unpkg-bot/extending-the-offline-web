'use strict';
const Blipp = require('blipp');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const MarkdownToJson = require('markdown-to-json');
const Marked = require('marked');
const Striptags = require('Striptags');
const Entities = require('html-entities').AllHtmlEntities;
const Fs = require('fs');

const Routes = require('./lib/routes');
const entities = new Entities();


const goodOptions = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }]
};


let server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3030
});


server.register([
    Inert,
    Vision,
    Blipp,
    {
        register: require('good'),
        options: goodOptions
    }], (err) => {

        server.route(Routes);

        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });


// add templates only for testing custom.html
server.views({
    path: 'bin',
    engines: { html: require('handlebars') },
    isCached: false
});


let options =  {
    preview: 0,
    minify: false,
    pretty: true,
    outfile: null
}


/*
let out = [];
Places.items.forEach( (place) => {
    let item = {
        name: place.properties.name[0],
        longitude: place.properties.longitude[0],
        latitude: place.properties.latitude[0],
        geofence: place.properties['x-geofence'][0],
        tags: place.properties.category,
        updated: place.properties.updated[0]
    }

    if(place.properties['street-address']){
            item['street-address'] = place.properties['street-address'][0];
    }
    if(place.properties['locality']){
            item['locality'] = place.properties['locality'][0];
    }
    if(place.properties['country-name']){
            item['country-name'] = place.properties['country-name'][0];
    }
    if(place.properties['postal-code']){
            item['postal-code'] = place.properties['postal-code'][0];
    }

     out.push(item)
});

console.log(JSON.stringify(out));
*/



/*
Fs.readdir('../data/assets', (err, files) =>{

    let out = [];
    if(files){

        files = files.filter((file) => {

            return (file.indexOf('.md') > -1);
        }).map((file) => {

            return '../data/assets/' + file;
        });

        files.forEach( (file) => {

            try{
                let entry = JSON.parse( MarkdownToJson.parse([file], options) );
                if(entry){
                    entry = entry[Object.keys(entry)[0]];
                    if(entry.markdown){

                        entry.html = Marked(entry.markdown);
                        entry.text = cleanText( Striptags(entry.html) );
                        delete entry.markdown;
                    }
                    out.push( entry );
                }

            }catch(err){
                console.log(file, err);
            }
        });
    }
    console.log(JSON.stringify(out));
});
*/


function cleanText( text ){

    text = entities.decode( text );
    text = removeLineReturns( text );
    text = collapseWhiteSpace( text );
    return text;
}

const removeLineReturns = function( text ){
    return text.replace(/(\r\n|\n|\r)/gm, ' ')
};

const collapseWhiteSpace = function( text ){
    return text.replace(/[\t\n\r ]+/g, ' ').trim();
};