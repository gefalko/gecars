const cheerio = require('cheerio');const dataSer = require('../services/data.service');
const httpSer = require('../services/http.service');
const colors  = require('colors'); 
const util = require('util');

module.exports = {
    get : activate,
    save : save
}

function save(){
    activate().then(function(data){
        fs.writeFileSync('./data/makeModelsData2.json', JSON.stringify(data) , 'utf-8');
    })
}

async function activate(){
   
    console.log("Start setup gecar makes and models list".bold);

    const body = await httpSer.get('https://autoplius.lt');
    $ = cheerio.load(body);

    const makes = [];
    $('#make_id  option').each(function(i, elem){
        //console.log(i+" > " + $(elem).text() +" "+$(elem).val());
        if(i >= 2){
            makes.push({make:$(elem).text(), id:$(elem).val()})
        }
    });

    const resMakes = [];
    for(let make of makes){
        
        let models = await getModels(make.id);
        
        resMakes.push({
            make:make.make,
            models:models
        });
    }

    console.log(util.inspect(resMakes, false, null));

    return resMakes;
}


async function getModels(makeId){
    const body = await postModels(makeId);
    const $ = cheerio.load(body.replace(/\\/g,''));

    console.log("get models of > "+makeId+"".red);
    //console.log(body);

    const models = [];
    $('option').each(function(i, elem){
        const model = $(elem).text();
        //console.log(model);
        if(i>1)models.push({name:model});
    });

    return models; 

}

function postModels(makeId){
    const body = `parent_id=${makeId}&target_id=model_id&project=autoplius&category_id=2&type=search&my_anns=false&__block=ann_ajax_0_plius&__opcode=ajaxGetChildsTo`;
    
    console.log(body);
    return httpSer.post('https://autoplius.lt', body);    
}
