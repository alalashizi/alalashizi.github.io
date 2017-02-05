//以下两个函数用于随机模拟生成测试数据
function getDateStr(dat){
	var y=dat.getFullYear();
	var m=dat.getMonth()+1;
	m=m<10?'0'+m:m;
	var d=dat.getDate();
	d=d<10?'0'+d:d;
	return y+'-'+m+'-'+d;
}
function randomBuildData(seed){
	var returnData={};
	var dat=new Date("2016-01-01");
	var datStr='';
	for(var i=1;i<92;i++){
		datStr=getDateStr(dat);
		returnData[datStr]=Math.ceil(Math.random()*seed);
		dat.setDate(dat.getDate()+1);
	}
	return returnData;
}
var aqiSourceData={
	"北京":randomBuildData(500),
	"上海":randomBuildData(300),
	"广州":randomBuildData(200),
	"深圳":randomBuildData(100),
	"成都":randomBuildData(300),
	"西安":randomBuildData(500),
	"福州":randomBuildData(100),
	"厦门":randomBuildData(100),
	"沈阳":randomBuildData(500),
};
//用于渲染图表的数据
var charData={};
//记录当前页面的表单选项
var pageState={
	nowSelectCity:-1,
	nowGraTime:"day"
}
/*随机选取柱状图的颜色*/
function randomColor(){
	return '#'+Math.random().toString(16).substring(2,8);
}
/*渲染图表*/
function renderChart(){
    var chartWrap=document.getElementById("chart-wrap");
    var html='';
    var style="style='width:{width};height:{height};background-color:{color}' ";
    var div_title="title='{time}的空气质量数值为:{data}' ";
    var model="<div "+style+div_title+"></div>";
    var graCity=pageState['nowSelectCity'];
    var graTime=pageState['nowGraTime'];
    var graData=charData[graTime][graCity];
    for(e in graData){
    	html+=model.replace('{width}',graData[e]['width']).replace('{height}',
    		graData[e]['height']).replace('{color}',graData[e]['color']).
    	replace('{time}',e).replace('{data}',graData[e]['data']);
    }
    chartWrap.innerHTML=html;

}
/*日，周，月的radio事件点击时的处理函数*/
function graTimeChange(evt){
	//确定是否选项发生了变化
    if(evt.target.value==pageState['nowGraTime']){
    	return false;
    }
	//设置对应数据
    pageState['nowGraTime']=evt.target.value;
	//调用图表渲染函数
	renderChart();
}
/*select发生变化时的处理函数*/
function citySelectChange(evt){
	//确定是否选项发生了变化
    
    if(evt.target.value==pageState['nowSelectCity']){
    	return false;
    }
	//设置对应数据
    pageState['nowSelectCity']=evt.target.value;
	//调用图表渲染函数
	renderChart();
}
/*初始化日，周，月的radio事件，当点击时，调用函数graTimeChange*/
function initGraTimeForm(){
   var rad=document.getElementById("form-gra-time");
   rad.addEventListener('change',graTimeChange,false);
}
/*初始化城市select下拉选择框中的选项*/
function initCitySelector(){
	//读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect=document.getElementById("city-select");
    var model="<option>{city}</option>";
    var html='';
    for(city in aqiSourceData){
    	html+=model.replace('{city}',city);
    }
    citySelect.innerHTML=html;
	//给select设置事件，当选项发生变化时调用函数citySelectChange
	citySelect.addEventListener('change',citySelectChange,false);
}
/*初始化图表需要的数据格式*/
function initAqiCharData(){
	//将原始的源数据处理成图表需要的数据格式
	var day={};

	var week={};
	var weekDays=5;
	var weekNum=1;
	var weekTotal=0;

	var month={};
	var monthNum=1;
	var monthTotal=0;

	for(city in aqiSourceData){
		day[city]={};
		week[city]={};
		month[city]={};
        for(date in aqiSourceData[city]){
        	var aqiData=aqiSourceData[city][date];
        	var dayGra={};
        	dayGra['data']=aqiData;
        	dayGra['height']=aqiData*0.8+'px';
        	dayGra['width']='8px';
        	dayGra['color']=randomColor();
        	day[city][date]=dayGra;

        	weekTotal+=aqiData;
        	if(weekDays==7||date=='2016-03-31'){
        		if(date=='2016-01-03'){
        			var weekData=(weekTotal/3).toFixed(2);
        		}else if(date=='2016-03-31'){
        			var weekData=(weekTotal/4).toFixed(2);
        		}else{
        			var weekData=(weekTotal/7).toFixed(2);
        		}
        		var key='第'+weekNum+'周';
        		var weekGra={};
        		weekGra['data']=weekData;
        		weekGra['height']=weekData*0.8+'px';
        		weekGra['width']='70px';
        		weekGra['color']=randomColor();
        		week[city][key]=weekGra;
        		weekTotal=0;
        		weekDays=0;
        		weekNum++;
        	}
        	weekDays++;
        	monthTotal+=aqiData;
        	if(date=='2016-01-31'||date=='2016-03-31'||date=='2016-02-29'){
        		if(date=='2016-02-29'){
        			var monthData=(monthTotal/29).toFixed(2);
        		}else{
        			var monthData=(monthTotal/31).toFixed(2);
        		}
        		var key=monthNum+'月';
        		var monthGra={};
        		monthGra['data']=monthData;
        		monthGra['height']=monthData*0.8+'px';
        		monthGra['width']='150px';
        		monthGra['color']=randomColor();
        		month[city][key]=monthGra;
        		monthTotal=0;
        		monthNum++;
        	}
        }
        weekDays=5;
        weekNum=1;
        monthNum=1;
	}
	//处理好的数据存到charData中
	charData.day=day;
	charData.week=week;
	charData.month=month;
}
/*初始化函数*/
function init(){
	initGraTimeForm();
	initCitySelector();
	initAqiCharData();

	if(pageState['nowSelectCity']==-1){
		pageState['nowSelectCity']='北京';
		renderChart();
	}
}
init();