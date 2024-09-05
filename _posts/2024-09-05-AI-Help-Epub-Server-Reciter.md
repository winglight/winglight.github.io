# AI助我写代码（6）：电子书朗读服务器版（Epub Server Reciter）

## 综述

* 之前开发了一个本地网页朗读电子书的软件（[Epub Local Reciter](https://github.com/winglight/epub-local-reciter)）， 发现一个痛点就是手机上无法使用，特别是不能每次都要上传epub文件，所以我打算做一个服务器版本可以支持多终端无缝切换
* 经过反复尝试，AI（Claude3.5）实现了大部分代码，包括一个后台python代码文件，以及一个前端html文件
* 代码开源仓库：[Epub Server Reciter](https://github.com/winglight/epub-server-reciter)

## 操作视频（TODO）

## 需求
1. 后端程序，我以接口为单位描述需求，前端页面主要是描述布局和交互方式
2. 再加上数据本地缓存的功能
   
## 操作步骤

1. 我主要是基于之前本地朗读软件改造为服务器版来描述需求，提示词如下：
   ```
   基于python实现一个web服务后端以及对应的前端页面，有以下功能：
   1.
   两个后端接口：一个用于上传epub并解析导出为html页面（每个章节一个页面和对应图片）并且生成一个章节列表页面可以导航到所有章节页面，一个用于提供前端页面的epub列表数据
   2.
   前端页面分为上方（包括上传epub文件按钮、下拉框显示epub文件列表，当选中一本epub时加载目标列表及阅览页面，且可以隐藏/打开），左方用于显示选中epub的目录（这个区域也可以隐藏/打开），右方用于阅览章节内容，且可以通过左右箭头翻页，以及空格键翻下一页，还有”全屏”按钮
   3.
   以上前端页面可以在本地local storage保存阅览记录，并且在选择epub文件后，自动跳转到前一次的阅览位置
   ```
   Claude生成了一个html页面以及一个python文件

2. 我发现html页面单独部署到web服务器不方便，所以打算作为静态资源放到python服务里面，提示词如下：

   ```
   在python的flask代码中，增加一个“/front”路径的解析，映射到/front目录下的文件访问，作为前端内容的服务
   ```

3. 运行之后，碰到跨域问题，提示词如下：
   ```
   后端代码有跨域问题：
   ' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
   ```

4. 运行之后报错，epub无法打开目录章节，提示词如下：
   ```
   基于附件代码，基于url正常下载epub文件后，以下代码块内部没有进入执行：
   this.book.loaded.navigation.then(() => {
                  this.currentChapter = 0;
                  this.loadChapterList();
                  
                  this.rendition = this.book.renderTo("epub-content", {
                     width: "100%",
                     height: "100%",
                     spread: "always"
                  });
      
                  this.loadReadingProgress();  // Load the previous reading progress
                  this.displayChapter();
      
                  // Save progress when the page changes
                  this.rendition.on('relocated', () => {
                     this.saveReadingProgress();
                  });
               }).catch(error => {
                  console.error('Error loading EPUB navigation:', error);
               });
   ```

**此时我发现一个重要的问题：因为把epub文件解析成了html和image格式，所以点击目录链接时需要修改为当前路径下的url，这个问题有点麻烦，我暂时没有继续深究下去**