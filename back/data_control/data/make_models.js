module.exports = [
    {
        make:'bmw',modelTypes:[
        {name:'X5'},
        {name:'520', providersData:{autotrader:'5 SERIES', ebay: '5%2520Series'}},
        {name:'530', providersData:{autotrader:'5 SERIES', ebay: '5%2520Series'}},
        {name:'523', providersData:{autotrader:'5 SERIES', ebay: '5%2520Series'}}
    ]
    },
    {make:'chevrolet',modelTypes:[{name:'cruze',providersData:{ebay:'not-exist'}}, {name:'lacetti'}]},
    {make:'honda', modelTypes:[{name:'accord'}]},
    // problems with autotrader
    {make:'lexus', modelTypes:[{name:'rx', providersData:{ebay:'RX%2520300'}}, {name:'gs', providersData:{ebay:'GS%2520300'}}]},
    {make:'mazda', modelTypes:[{name:'3',providersData:{autotrader:'MAZDA3'}}]},
    {make:'mercedes-benz', modelTypes:[{name:'e-class',providersData:{autotrader:'E CLASS', ebay:'E%252DClass'}}]},
    {
        make:'mitsubishi',
        modelTypes:[
            {name:'l200'},
            {name:'lancer'},
            {name:'outlander'},
            {name:'shogun-sport',providersData:{autotrader:'SHOGUN SPORT', ebay:'Shogun'}},
            {name:'grandis', providersData:{ebay:'not-exist'}},
            {name:'colt'}]},
    {make:'nissan', modelTypes:[{name:'qashqai'}]},
    {make:'skoda', modelTypes:[{name:'superb'}, {name:'octavia'}]},
    {make:'subaru', modelTypes:[{name:'tribeca'}, {name:'forester'}, {name:'outback'}, {name:'legacy'} ]},
    {make:'toyota', modelTypes:[{name:'camry'}, {name:'landcruiser',providersData:{autotrader:'LAND CRUISER', ebay:'Land%2520Cruiser'}}]},
    {make:'volkswagen', modelTypes:[{name:'passat'}]}
];
