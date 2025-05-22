function extractAndDownloadAllChapters() {
    console.log("开始提取章节内容...");
    const chapterContainers = document.querySelectorAll('.chapter_content');
    let allChaptersText = [];

    if (chapterContainers.length === 0) {
        console.warn("警告：没有找到任何章节容器 (使用选择器 '.chapter_content')。请检查选择器是否正确，或页面是否已正确加载。");
        alert("未能提取到任何章节内容，因为没有找到指定的章节容器 '.chapter_content'。");
        return;
    }

    chapterContainers.forEach((container, index) => {
        const paragraphs = container.querySelectorAll('.cha-words p');
        const chapterText = Array.from(paragraphs)
            .map(p => "    " + p.textContent.trim())
            .join('\n');

        let actualChapterTitle = '';
        const titleElement = container.querySelector('.cha-tit h1.dib.mb0.fw700.fs24.lh1\\.5'); // 转义 lh1.5 中的点

        if (titleElement && titleElement.textContent.trim() !== '') {
            actualChapterTitle = titleElement.textContent.trim();
            console.log(`成功提取到章节 <span class="math-inline">\{index \+ 1\} 的标题\: "</span>{actualChapterTitle}"`);
        } else {
            const simplerTitleElement = container.querySelector('.cha-tit h1');
            if (simplerTitleElement && simplerTitleElement.textContent.trim() !== '') {
                actualChapterTitle = simplerTitleElement.textContent.trim();
                console.log(`(备选方案) 成功提取到章节 <span class="math-inline">\{index \+ 1\} 的标题\: "</span>{actualChapterTitle}" (使用 '.cha-tit h1' 选择器)`);
            } else {
                actualChapterTitle = `Chapter ${index + 1}`;
                console.warn(`警告：在章节 <span class="math-inline">\{index \+ 1\} 的容器中未能找到特定标题。将使用通用标题\: "</span>{actualChapterTitle}".`);
            }
        }

        const formattedTitle = `\n\n\n${actualChapterTitle.toUpperCase()}\n${'-'.repeat(actualChapterTitle.length)}\n\n`;
        allChaptersText.push(formattedTitle + chapterText);
    });

    if (allChaptersText.length === 0 && chapterContainers.length > 0) {
        console.warn("警告：找到了章节容器，但提取到的章节文本内容为空。请检查标题和段落选择器是否能在这些容器内定位到元素。");
        alert("提取到的章节内容为空，尽管找到了章节容器。");
        return;
    } else if (allChaptersText.length === 0) {
        console.warn("警告：提取到的章节内容为空。");
        alert("提取到的章节内容为空。");
        return;
    }

    const allText = allChaptersText.join('\n\n');
    const blob = new Blob([allText], { type: 'text/plain;charset=utf-8' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);

    let fileName = 'allChaptersText.txt';
    if (allChaptersText.length > 0) {
        try {
            const firstChapterLines = allChaptersText[0].split('\n');
            if (firstChapterLines.length > 3 && firstChapterLines[3].trim() !== '') {
                let potentialFileName = firstChapterLines[3].trim();
                potentialFileName = potentialFileName.toLowerCase()
                                     .replace(/[^\w\s-]/g, '')
                                     .replace(/[\s_]+/g, '-')
                                     .substring(0, 60);
                if (potentialFileName) {
                    fileName = `${potentialFileName}.txt`;
                }
            }
        } catch (e) {
            console.warn("生成动态文件名失败，将使用默认文件名 'allChaptersText.txt'。", e);
        }
    }
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    console.log(`所有章节已提取完毕，并开始下载为 "${fileName}"。`);
}