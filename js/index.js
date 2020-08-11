window.onload = function() {
	let oAll = document.querySelector(".all");

	// 1.预加载图片
	let urls = [];
	for (let i = 1; i <= 40; i++) {
		let index = i < 10 ? "0" + i : i;
		urls.push(`images/img${index}.jpg`)
	}

	preLoadImages(urls, function(oImages) {
		// 1.初始化图片
		let oItems = createImgs(oAll, oImages);
		// 2.初始化容器宽度
		let cols = resetSize(oAll, oItems);
		// 3.实现流式布局
		waterfall(oItems, cols);
		// 4.监听可视区域的变化
		window.onresize = throttle(function() {
			let oItems = document.querySelectorAll(".box");
			let cols = resetSize(oAll, oItems);
			waterfall(oItems, cols);
		}, 500);
		// 5.监听图片加载事件
		loadImages(oAll, oItems, oImages);
	});
}


// 1.图片预加载
function preLoadImage(url, fn) {
	let oImg = document.createElement("img");
	oImg.src = url;
	oImg.className = "img";
	oImg.onload = function() {
		fn(oImg);
	}
}

function preLoadImages(urls, fn) {
	// 1.定义变量记录总共有多少张图片需要加载
	let totalCount = urls.length;
	// 2.定义变量记录当前已经加载了多少张图片
	let count = 0;
	// 3.定义数组保存所有加载好的图片
	let oImages = [];
	// 4.循环遍历加载图片
	for (let i = 0; i < urls.length; i++) {
		let url = urls[i];
		preLoadImage(url, function(oImg) {
			oImages.push(oImg);
			count++;
			if (count === totalCount) {
				fn(oImages);
			}
		});
	}
}
// 2.初始化图片
function createImgs(oAll, oImages) {
	for (let i = 0; i <= oImages.length - 1; i++) {
		let oBox = document.createElement("div");
		oBox.className = "box";
		oAll.appendChild(oBox);
		oBox.appendChild(oImages[i]);
	}
	let oItems = document.querySelectorAll(".box");
	return oItems;
}
// 3.初始化容器宽度
function resetSize(oAll, oItems) {
	let screenWidth = getScreen().width;
	let imgWidth = oItems[0].offsetWidth;
	let cols = Math.floor(screenWidth / imgWidth);
	let allWidth = cols * imgWidth;
	oAll.style.width = allWidth + "px";
	oAll.style.margin = "0 auto";
	return cols;
}
// 4.实现流式布局
function waterfall(oItems, cols) {
	let eleHeight = [];
	for (let i = 0; i < oItems.length; i++) {
		let oItem = oItems[i];
		if (i < cols) {
			oItem.style.position = "";
			eleHeight.push(oItem.offsetHeight);
		} else {
			let minHeight = Math.min.apply(this, eleHeight);
			let minIndex = eleHeight.findIndex(function(value) {
				return value === minHeight;
			});
			let minEle = oItems[minIndex];
			let minOffset = minEle.offsetLeft;
			oItem.style.position = "absolute";
			oItem.style.left = minOffset + "px";
			oItem.style.top = minHeight + "px";

			eleHeight[minIndex] += oItem.offsetHeight;

		}

	}

}


// 5.监听图片加载事件
function loadImages(oAll, oItems, oImages) {
	window.onscroll = debounce(function() {
		let lastItem = oItems[oItems.length - 1];
		let lOffsetTop = lastItem.offsetTop;
		let halfHeight = lastItem.offsetHeight / 2;
		let screenHeight = getScreen().height;
		let offsetY = getPageScroll().y;
		if ((lOffsetTop + halfHeight) <= (screenHeight + offsetY)) {
			let urls = [];
			for (let i = 1; i <= 40; i++) {
				let index = i < 10 ? "0" + i : i;
				urls.push(`images/img${index}.jpg`)
			}
			preLoadImages(urls, function(oImages) {
				// 1.初始化图片
				let oItems = createImgs(oAll, oImages);
				// 2.初始化容器宽度
				let cols = resetSize(oAll, oItems);
				// 3.实现流式布局
				waterfall(oItems, cols);
			});

		}
	}, 500);
}
