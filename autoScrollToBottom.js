function autoScrollToBottom(callbackWhenFinished) {
    console.log("开始自动滚动加载页面内容...");
    let lastHeight = 0;
    let currentHeight = document.body.scrollHeight;
    let noChangeCount = 0;
    const MAX_NO_CHANGE_COUNT = 10; // 连续10次高度不变则认为加载完毕 (10 * 1.5秒 = 15秒内无新内容)
    const SCROLL_INTERVAL = 1500; // 每1.5秒滚动一次，给页面足够的时间加载

    const scrollIntervalId = setInterval(() => {
        lastHeight = currentHeight;
        window.scrollTo(0, document.body.scrollHeight); // 滚动到底部
        currentHeight = document.body.scrollHeight;

        console.log(`当前页面高度: ${currentHeight}px`);

        if (currentHeight === lastHeight) {
            noChangeCount++;
            console.log(`页面高度未变化，检测次数: <span class="math-inline">\{noChangeCount\}/</span>{MAX_NO_CHANGE_COUNT}`);
            if (noChangeCount >= MAX_NO_CHANGE_COUNT) {
                clearInterval(scrollIntervalId);
                console.log("自动滚动结束。页面内容应该已全部（或已达到加载上限）加载完毕。");
                if (callbackWhenFinished && typeof callbackWhenFinished === 'function') {
                    console.log("现在将执行内容提取函数...");
                    callbackWhenFinished();
                } else {
                    console.log("请现在手动运行提取章节内容的函数 (如果适用)。");
                }
            }
        } else {
            noChangeCount = 0; // 高度变化了，重置计数器
        }
    }, SCROLL_INTERVAL);
}