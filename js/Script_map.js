ymaps.ready(init);

// json 
let points = '{"points":[';
let p1 = '{ "coordinates1":51.526125, "coordinates2":45.979220, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь героя Советского союза Клочкова В.Г.", "hintContent": "Стела Героя Советского Союза Клочкова В.Г.", "src" : "../Klochkov/img/в_г__клочков.jpg", "text" : "Василий Георгиевич Клочков (1911 – 1941)", "onclick" : "../Klochkov/index.html"},';
let p2 = '{ "coordinates1":51.518508, "coordinates2": 46.006408, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь тружеников тыла", "hintContent": "Памятник труженикам тыла", "src" : "images/40942728415-eb378230e9-o.jpg", "text" : "Стела, установленная в честь тружеников тыла", "onclick" : "../All_Heroes/index.html" },';
let p3 = '{ "coordinates1": 51.525439, "coordinates2": 46.005223, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь героя Советского союза Хользунова А.И.", "hintContent": "Стела Героя Советского Союза Хользунова А.И.", "src" : "../Holzunov/img/а_и__хользунов.jpg", "text" : "Алексей Иванович Хользунов (1919 – 1943)", "onclick" : "../Holzunov/index.html" },';
let p4 = '{ "coordinates1": 51.515092, "coordinates2": 45.989664, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь героя Советского союза Грибова П.И.", "hintContent": "Стела Героя Советского Союза Грибова П.И.", "src" : "../Gribov/img/п_и__грибов.jpg", "text" : "Пётр Иванович Грибов (1902 – 1945)", "onclick" : "../Gribov/index.html" },';
let p5 = '{ "coordinates1": 51.538350, "coordinates2": 45.991328, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь героя Советского союза Емлютина Д.В.", "hintContent": "Стела Героя Советского Союза Емлютина Д.В.", "src" : "images/Дмитрий_Васильевич_Емлютин.jpg", "text" : "Дмитрий Васильевич Емлютин (1907 — 1966)", "onclick" : "../All_Heroes/index.html" },';
let p6 = '{ "coordinates1": 51.49367301783019, "coordinates2": 45.92122820983902, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь героя Советского союза Расковой М.М.", "hintContent": "Стела Героя Советского Союза Расковой М.М.", "src" : "images/450px-Marina_Raskova_portrait.png", "text" : "Марина Михайловна Раскова (1912 - 1943)", "onclick" : "../All_Heroes/index.html" },';
let p7 = '{ "coordinates1": 51.49612596537969, "coordinates2": 45.93894175758242, "balloonContentHeader": "images/image.png", "balloonContentBody": "Стела, установленная в честь героя Советского союза Пономарёва П.Т.", "hintContent": "Стела Героя Советского Союза Пономарёва П.Т.", "src" : "../Ponamorev/img/п_т__пономарев.jpg", "text" : "Пётр Тихонович Пономарёв (1924 – 1943)", "onclick" : "../Ponamorev/index.html" }';
points += p1 + p2 + p3 + p4 + p5 + p6 + p7 + "]}";
let point = JSON.parse(points);
let myMap

function init(){
    myMap = new ymaps.Map("map__wrapper", {
        center: [51.514995, 45.959997],
        zoom: 12.5, //or 13.5 
        controls: ['zoomControl'] // Оставляет только «Ползунок масштаба»
    },{suppressMapOpenBlock: true}); // Убирает кнопки "как добраться" и "доехать на такси"
    
    let marks = [];
    

    // С json
    for(let i = 0; i < point.points.length; i++){
        marks[i] = new ymaps.Placemark([point.points[i].coordinates1, point.points[i].coordinates2], {
            balloonContent: '<div class = "wrapper">' + 
                            "<div class = 'content-image'> <img type='image2' src= " + point.points[i].balloonContentHeader + " alt=' '> </div>" +
                            `<div class = 'content-body'> ${point.points[i].balloonContentBody} </div>` +
                            '<div class = "content-footer"> <input type="button" class = "butMark" value="Подробнее..." onclick="moreInf(' + i + ')"> </<div></div>',
            hintContent: point.points[i].hintContent,
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'images/326703_favorite_rate_star_icon.png',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -20]           
        });
    }

    

    let clusterer = new ymaps.Clusterer({
        clusterIcons: [
            {
                href: 'images/star.png',
                size: [42, 42],
                offset: [-20, -20]
            }],
        
        showInAlphabeticalOrder: true,        //Показывать метки в балуне в алфавитном порядке при нажатии на кластер (умолч. false)
        clusterDisableClickZoom: true,
    });
    clusterer.add(marks);
    myMap.geoObjects.add(clusterer);
}

function moreInf(i) {
    myMap.balloon.close();
    document.getElementById("moreData").style.display = "block";
    document.getElementById("moreData").style.animation = "aniMoreData_1 0.9s linear both";
    if(point.points[i].hintContent == "Памятник труженикам тыла")
    document.getElementById("divForText").innerHTML = "<h><b>" + point.points[i].hintContent + "</b><br><br></h><img type='image' src= '" + point.points[i].src  + "' alt=' ' style = 'width: 200px; height: auto; margin-left: auto; margin-right: auto'><p><br>";
    else 
        document.getElementById("divForText").innerHTML = "<h><b>" + point.points[i].hintContent + "</b><br><br></h><img type='image' src= '" + point.points[i].src  + "' alt=' ' style = 'width: 100px; height: auto; margin-left: auto; margin-right: auto'><p><br>" + point.points[i].text + "<br><br></p>" + "<button style = 'background: rgba(12, 21, 101, 0.9); color: white; padding: 10px 25px; border-radius: 13px;' onclick=" + '"' + "window.location.href = "  + "'" + point.points[i].onclick + "'" + '"' + "> Узнать больше</button>";
    document.getElementById("divForText").style.display = "block";
    document.getElementById("moreData").addEventListener('animationend', function() {
        document.getElementById("moreData").style.display = "block";
    });
}

function closeMoreInf() {
    console.log("close");
    document.getElementById("divForText").style.display = "none";
    document.getElementById("moreData").style.animation = "aniMoreData_2 0.9s linear both";
    document.getElementById("moreData").addEventListener('animationend', function() {
        document.getElementById("moreData").style.display = 'none';
    });    
}