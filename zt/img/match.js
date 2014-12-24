
function t1(e){
	//console.log("target:"+e.target.className);
	e = e.changedTouches[0];
    onStart(e);
}
function t2(e){
	onMove(e.changedTouches[0], e);
}
function t3(e){
	onEnd(e.changedTouches[0]);
}

function binddoc(){
	document.addEventListener('touchstart', t1);
	document.addEventListener('touchmove', t2);
	document.addEventListener('touchend', t3);
};
binddoc();
function unbinddoc(){
	document.removeEventListener('touchstart', t1);
	document.removeEventListener('touchmove', t2);
	document.removeEventListener('touchend', t3);
};
function showqr(){
	$(".qr").show();
	unbinddoc();
}
$(function(){
	$(".qr").on("click",function(){
		$(".qr").hide();
		binddoc();
	})
	$(".qrimg").on("click",function(){
		$(".qr").hide();
		binddoc();
	})
})
	

// 翻转的绑定
window.onorientationchange = orientationChange;
window.onresize = orientationChange;
function initPage() {
    pageWidth = $(window).width();
    pageHeight = $(".wrap").height();
    pages = $(".wrap .slider");
    $(".bg .bg_sec").css("height", pageHeight);
    secHeight = pageHeight * $(".wrap .slider").length;
	animatePage(curPage);
    $(".sec").removeClass("drag");
	setTimeout(function() {
		$(".sec01").find(".animate").removeClass("f-ann");
	},1);
}
function orientationChange() {
	initPage();
}
// 以下是拖动效果
var startX = 0,
    startY = 0;
	margin = 0;//滑动过程中的matrix定位
var pages = null;
var curPage = 0;
var pageWidth = 0,
    pageHeight = 0;
var lineHeight = 0, secHeight = 0;
var targetElement = null;
var scrollPrevent = false,//为地图准备
    movePrevent = false,//
    touchDown = false;//

$(document).ready(function () {
	var imgUrl = 'http://aitongtian.com/zt/img/preview.jpg';
	var lineLink = 'http://aitongtian.com/zt/';
	var descContent='朋友感谢有你！小通祝您圣诞快乐！！！';
	var shareTitle = '圣诞快乐！！！';
	var appid = '';
         
	 function shareFriend() {
		WeixinJSBridge.invoke('sendAppMessage',{
			"appid": appid,
			"img_url": imgUrl,
			"img_width": "200",
			"img_height": "200",
			"link":lineLink,
			"desc": descContent,
			"title": shareTitle
		}, function(res) {
			//_report('send_msg', res.err_msg);
		})
	}
	function shareTimeline() {
		WeixinJSBridge.invoke('shareTimeline',{
		   "img_url": imgUrl,
			"img_width": "200",
			"img_height": "200",
			"link": lineLink,
			"desc": shareTitle,
			"title": shareTitle
		}, function(res) {
			   //_report('timeline', res.err_msg);
		});
	}
	function shareWeibo() {
		WeixinJSBridge.invoke('shareWeibo',{
			"content": descContent,
			"url": lineLink,
		}, function(res) {
			//_report('weibo', res.err_msg);
		});
	}
	// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		// 发送给好友
		WeixinJSBridge.call('showOptionMenu');
		WeixinJSBridge.on('menu:share:appmessage', function(argv){
			shareFriend();
		});
		// 分享到朋友圈
		WeixinJSBridge.on('menu:share:timeline', function(argv){
			shareTimeline();
		});
		// 分享到微博
		WeixinJSBridge.on('menu:share:weibo', function(argv){
			shareWeibo();
		});
	}, false);
});
function onStart(e) {
    if (movePrevent == true) {
        event.preventDefault();
        return false;
    }
    touchDown = true;
    startX = e.pageX;//因为绑定的是body
    startY = e.pageY;
	$(".sec").addClass("drag");
    margin = $(".sec").css("-webkit-transform");
    //margin = "matrix(1, 0, 0, 1, 0, -50)";
    margin = margin.replace("matrix(", "");
    margin = margin.replace(")", "");
    margin = margin.split(",");//转为数组
    margin = parseInt(margin[5]);//获取数组的第6个值
	//console.log(margin);
}

function onMove(e, oe) {
    if (movePrevent == true || touchDown != true) {
        event.preventDefault();
        return false;
    }
    event.preventDefault();
    if (scrollPrevent == false && e.pageY != startY) {
        var temp = margin + e.pageY - startY;
        $(".sec").css("-webkit-transform", "matrix(1, 0, 0, 1, 0, " + temp + ")");
        var b = lineHeight / secHeight * temp;
    }
}

function onEnd(e) {
    if (movePrevent == true) {
        event.preventDefault();
        return false;
    }

    touchDown = false;

    if (scrollPrevent == false) {
        // 抬起点，页面位置
        endX = e.pageX;
        endY = e.pageY;
        // swip 事件默认大于50px才会触发，小于这个就将页面归回
        if (Math.abs(endY - startY) <= 50) {
            animatePage(curPage);
        } else {
            if (endY > startY) {
                prevPage();
            } else {
                nextPage();
            }
        }
    }
    $(".sec, line").removeClass("drag");
}

function prevPage() {
    var newPage = curPage - 1;
    animatePage(newPage);

}
function nextPage() {
    var newPage = curPage + 1;
    animatePage(newPage);
}

function animatePage(newPage) {
    if (newPage < 0) {
        newPage = 0;
    }
    if (newPage > $(".wrap section").length - 1) {
        newPage = $(".wrap section").length - 1;
    }

    curPage = newPage;
    var newMarginTop = newPage * (-pageHeight);//滑动成功后的matrix定位
    $(".sec").css({
        "-webkit-transform": "matrix(1, 0, 0, 1, 0, " + newMarginTop + ")"
    });
    var newTop = -parseInt(curPage * pageHeight * (lineHeight / secHeight));
    $("line").css({
        "-webkit-transform": "matrix(1, 0, 0, 1, 0, " + newTop + ")"
    });
    movePrevent = true;
    setTimeout(function () { movePrevent = false }, 300);
    // 每页动画
    if (!$(pages[curPage]).hasClass("sec0" + (curPage + 1) + "_show")) {
        $(pages[curPage]).addClass("sec0" + (curPage + 1) + "_show");
    }
    $(pages[curPage - 1]).removeClass("sec0" + (curPage) + "_show");
    $(pages[curPage + 1]).removeClass("sec0" + (curPage + 2) + "_show");
	
	setTimeout(function() {
	//给当前页的前后两页的动态元素都加上f-ann，使其隐藏
		$(pages[curPage - 1]).find(".animate").addClass("f-ann");
		$(pages[curPage + 1]).find(".animate").addClass("f-ann");
		$(".sec0"+(curPage+1) + "_show").find(".animate").removeClass("f-ann");
	},600);
}
//音乐播放
$(function(){
	var paly=true;
	$('.music').on('click',function(){
		if(paly){
			$('audio')[0].pause();
			$(this).removeClass('rotate');
			paly=false;
		}else{
			$('audio')[0].play();
			$(this).addClass('rotate');
			paly=true;
		}
	})
})