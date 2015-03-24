var touchStartEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown',
	touchMoveEvent  = 'ontouchmove'  in window ? 'touchmove'  : 'mousemove',
	touchEndEvent   = 'ontouchend'   in window ? 'touchend'   : 'mouseup';

document.addEventListener("DOMContentLoaded", load, false);

window.shareData = {
	"imgUrl" : "http://www.mihoyo.com/hsod2_homepage/public/img/Icon-144.png",
	"timeLineLink" : "http://www.mihoyo.com",
	"tTitle" : "崩坏学园2 我就是测试一下微信的分享接口^_^by 斌佬\n",
	"tContent" : "我就是测试一下内容"
};

document.addEventListener('WeixinJSBridgeReady',
	function onBridgeReady() {
		WeixinJSBridge.on('menu:share:appmessage', function(argv) {
			WeixinJSBridge.invoke('sendAppMessage', {
				"img_url" : window.shareData.imgUrl,
				"link" : window.shareData.timeLineLink,
				"desc" : window.shareData.tContent,
				"title" : window.shareData.tTitle
			}, onShareComplete);
		});

		WeixinJSBridge.on('menu:share:timeline', function(argv) {
			WeixinJSBridge.invoke('shareTimeline', {
				"img_url" : window.shareData.imgUrl,
				"img_width" : "144",
				"img_height" : "144",
				"link" : window.shareData.timeLineLink,
				"desc" : window.shareData.tContent,
				"title" : window.shareData.tTitle
			}, onShareComplete);
		});
	}, false);

function onShareComplete(res) {
	if (res.err_msg == 'share_timeline:ok') {
		alert("谢谢分享！");
	}
}

/*
** load when DOMContentLoaded
*/
function load () {
	var initial = 1000;
	var count = initial;
	var counter;
	var state = 0;
	var total = 0;

	var best_total = 0;


	var box = document.querySelector('.touch-box');
	box.addEventListener(touchStartEvent, touchHandler, false);
	box.addEventListener(touchEndEvent, touchHandler, false);

	var link = document.querySelector('.link');
	link.addEventListener(touchEndEvent, function() {
		if (state == 0) {
			reset();
			counter = setInterval(timer, 10);
			state = 1;
		}

	}, false);
	displayCount(initial);

	function touchHandler (ev) {
		//ev.preventDefault();
		switch (ev.type) {
			case touchStartEvent :
				if (state == 0) {
					reset();
					counter = setInterval(timer, 10);
					state = 1;
				}

				if (!box.classList.contains('active')) {
					box.classList.add('active');
				}
				break;
			case touchEndEvent :
				if (state == 1) {
					total++;
					document.querySelector('.score').innerHTML = total+ " 次";
				}
					
				if (box.classList.contains('active')) {
					box.classList.remove('active');
				}
				break;
			default :
				break;
		}
	}

	/* count down */
	function timer() {
		if (count <= 0) {
			state = 0;
			clearInterval(counter);

			best_total = total > best_total ? total : best_total;
			document.querySelector('.best-score').innerHTML = "Best: " + best_total + " 次";

			show_score_dialog();

			return;
		}

		count--;
		displayCount(count);
	}

	function show_score_dialog() {
		var bool = window.confirm("时间结束！得分: " + total+ " 次！要分享到朋友圈吗？");

		if (bool) {
			WeixinJSBridge.invoke('shareTimeline', {
				"img_url" : window.shareData.imgUrl,
				"img_width" : "144",
				"img_height" : "144",
				"link" : window.shareData.timeLineLink,
				"desc" : window.shareData.tContent,
				"title" : window.shareData.tTitle
			}, onShareComplete);
		} else {
			return;
		}	
	}

	function displayCount(count) {
		var res = count / 100;
		document.querySelector('.timer').innerHTML = res.toPrecision(count.toString().length)+ " 秒";
	}

	function reset() {
		state = 0;
		count = initial;
		total = 0;
	}


	/* 微信分享 */
	function dp_share(score) {
		window.shareData.tTitle = document.title;
	}


}