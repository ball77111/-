let list = document.querySelector('.attractionsList');
let select = document.querySelector('.area');
let areaName = document.querySelector('.area-name');
let popular = document.querySelector('.popular .list');
let page =  document.querySelector('.page');
let banner = document.querySelector('.banner');
let wrap = document.querySelector('.wrap');
let headerTitle  = document.querySelector('.header h1');

let areaLength = 0;
let data = [];
let Attra = [];
let filterAttra = [];
function getOpData(){
    const url = 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c'; 

    fetch(url)
    .then(res => res.json())
    .then((res) => {
        console.log(res);
        data = res.data.XML_Head.Infos.Info;
        ////fetch 是async非同步請求 只能把data放在這邊處理初始畫面資料類的 後續監聽事件則不影響
        init();
    })
    .catch(err => { throw err });
    //https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript

    ////fetch 是async非同步請求 若把data 放在這邊處理會發現是沒有資料的
}

function getArea(){
    var areaTemp = [];
    for(var i = 0 ; i < data.length; i++){
        var str = data[i].Add;
        var area = str.split('')[6] + str.split('')[7] + str.split('')[8];
        console.log(str.split(''));
        areaTemp.push(area);
    }
    // 清除重覆的區
    let uniqueArea = [...new Set(areaTemp)];//https://wsvincent.com/javascript-remove-duplicates-array/

    var str ='<option value="高雄市">- - 請選擇行政區 - -</option>';
    for(var i = 0 ; i < uniqueArea.length ; i++){
        str += `<option value="${uniqueArea[i]}">${uniqueArea[i]}</option>`;
    }
    select.innerHTML = str;
}
function getList(area){
    Attra = [];
    if(area == '高雄市'){
        Attra = [...data];
    }
    else{
        for(var i = 0; i < data.length; i++) {
            if (data[i].Add.includes(area)) {
                Attra.push(data[i]);
            }
        }
    }
    areaLength = Attra.length;
    areaName.textContent = area;
    pageFilter(1);
}

function showAttra(){
    var str = '';
    for(var i = 0; i < filterAttra.length; i++) {
        str += `
        <li>
        <div class="header" style="background: center/cover no-repeat url(${filterAttra[i].Picture1});">
            <div class="title">
                <h3>${filterAttra[i].Name}</h3>
                <span>${areaName.textContent}</span>
            </div>
        </div>
        <ul class="info">
            <li class="time">${filterAttra[i].Opentime}</li>
            <li class="addr"><a href="http://maps.google.com/?q=${filterAttra[i].Add}" target="_blank">${filterAttra[i].Add}</a></li>
            <li class="tel"><a href="tel:${filterAttra[i].Tel}" target="_blank">${filterAttra[i].Tel}</a>
            <span class="tooltip">${a = (filterAttra[i].Ticketinfo == '' ? '免費參觀' : '內有額外消費資訊' )}
            <span class="tooltiptext">${b = (filterAttra[i].Ticketinfo == '' ? '免費參觀' : `${filterAttra[i].Ticketinfo}` )}</span>
            </span></li>
        </ul>
        </li>
        `;
    }
    list.innerHTML = str;
}

function pageFilter(num){
    //
    var onePageItem = 6;

    var start = (num-1) * onePageItem;
    var end   = (num*onePageItem -1) > (areaLength-1) ? (areaLength-1) : (num*onePageItem -1);

    filterAttra = [];
    for(var i = start; i <= end ; i++ ){
        filterAttra.push(Attra[i]);
    }
    showAttra();

    //
    var AllpageNum = Math.ceil( areaLength / onePageItem);
    var str ='';

    //預計最多顯示10頁選項
    var Pstart = 1; //固定初始頁為1
    if((num-5) > 1){
        Pstart = num -5;
    }

    var Pend = AllpageNum > 10 ? 10 : AllpageNum; //實際總頁碼 < 10頁
    if((num + 5) > 10){
        Pend = (num + 5) > AllpageNum ? AllpageNum : (num + 5); 
        //原本最後頁預計顯示為當前頁+5 但若超過實際總頁碼則調整回實際總頁碼
    }
    // etc.. 6 > 6 > 11 > 6 
    // etc.. 12 > 12 > 17 > 12 

    if(num != 1){
        //當在第一頁不顯示
        str += `<li><a href="#">< Prev</a></li>`;
    }
    for(var i = Pstart ; i <= Pend; i++){
        if(i == num){
            str += `<li class='selected'><a href="#">${i}</a></li>`;
        }
        else{
            str += `<li><a href="#">${i}</a></li>`;
        }
    }
    if(num != AllpageNum){
        //當在最後頁不顯示
        str += `<li><a href="#">Next ></a></li>`;
    }
    page.innerHTML = str;
}

function changeList(e){
    //console.log(e.target.value);
    var area = e.target.value;
    getList(area)
}

function popularClick(e){
    console.log(e);
    if(e.target.nodeName == 'A'){
        console.log(e.target.textContent);
        var area = e.target.textContent;
        select.value = area;
        getList(area);
    }
}

function pageClick(e){
    e.preventDefault();
    if(e.target.nodeName == 'A'){
        //console.log(e.target.textContent);
        var pageNum;
        //判斷頁碼 方便後續函式簡單處理
        if(e.target.textContent == 'Next >'){
            pageNum = parseInt(document.querySelector('.page .selected a').textContent) + 1;
        }
        else if(e.target.textContent == '< Prev'){
            pageNum = parseInt(document.querySelector('.page .selected a').textContent) - 1;
        }
        else{
            pageNum = parseInt(e.target.textContent);
        }
        console.log(pageNum);
        pageFilter(pageNum);
    }
}

function init(){
    getArea();
    getList('高雄市');
}

getOpData();
select.addEventListener('change',changeList,false);
popular.addEventListener('click',popularClick,false);
page.addEventListener('click',pageClick,false);

function resizeWindow(){
    banner.setAttribute('style',`height: ${window.innerHeight}px; background: url(img/assets/the-urban-landscape-1698285.png) center no-repeat; background-size: cover;`);
    wrap.setAttribute('style',`max-width: ${window.innerWidth}px;`);
    headerTitle.setAttribute('style',`font-size: 80px`);
    $('.popular').addClass('fly');
    $('.area').addClass('fly');
}



$(document).ready(function () {
    $(window).scroll(function (e) {
        var scrollY = window.scrollY;
        if (scrollY < 500) {
            $('.top-btn').addClass('fly');
        } else{
            $('.top-btn').removeClass('fly');
        }

        //cancel resize
        banner.setAttribute('style',`height: 380px; background: url(img/assets/Hero.png) center no-repeat; background-size: cover;`);
        wrap.setAttribute('style',`max-width: 1024px`);
        headerTitle.setAttribute('style',`font-size: 40px`);
        $('.popular').removeClass('fly');
        $('.area').removeClass('fly');
    });

    $('.top-btn').click(function(){
        $('html,body').animate({
          scrollTop: 0
        },200);
    });

}); 