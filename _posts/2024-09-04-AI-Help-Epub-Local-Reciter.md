# AI助我写代码（6）：电子书本地朗读（Epub Local Reciter）

## 综述

* 因为有时不方便“看”电子书，而朗读功能只在有限的App中提供，所以我想做一个基于网页，本地运行的朗读电子书工具
* 经过反复尝试，AI（Claude3.5）实现了大部分代码，不过，可能这次功能比较复杂，所以调试bug花了很长时间,而且有多处bug只能自己解决
* 代码开源仓库：[Epub Local Reciter](https://github.com/winglight/epub-local-reciter)

## 操作视频（TODO）

## 需求
1. 起初，我设想的软件功能很简单，就是在网页上能够朗读文本，然后自动翻页
2. 后来发现，网页自动翻页其实很麻烦，不然chrome可能早就实现这个功能了——现在已经有朗读功能，不过这个功能很多网页都不支持
3. 而且，我有开发另外一个软件可以从网页爬取生成epub电子书，所以最终的目标改为朗读epub电子书
   
## 操作步骤

1. 一开始我只想实现一个可以引入html页面的js库，提示词如下：
   ```
   基于html页面，实现页面内容的朗读功能，具体的方式是，在正常页面中，引入对应的js文件，然后在页面上显示一个浮动按钮，点击按钮后朗读页面内容
   并增加以下功能：
   1. 给按钮增加播放、暂停两种状态的切换，并且按钮上需要有不同的图标表示当前状态。
   2. 除了播放按钮，增加一个设置按钮，可以设置所使用的声音音源，可以调整音量，可以设置语速，语速分为四档：0.5、1（原速）、1.5、2
   3. 播放支持回调功能，设置回调方法，在当前内容播放完毕后，调用回调方法刷新页面，然后自动播放新的页面内容
   ```
   Claude生成了一个html页面以及一个js文件

2. 基本功能是可以使用的，我想额外加一点功能，提示词如下：

   ```
   增加功能：
   1. 增加停止按钮，点击后重新初始化状态和tts引擎
   2. 保存设置项的值到浏览器的local storage，并且在打开网页时自动加载
   ```

3. 考虑到epub更容易实现朗读功能，我增加了本地浏览、朗读epub电子书的功能，提示词如下：
   ```
   增加以下功能：
   1. 在页面上增加一个上传epub文件的功能
   2. 上传后自动在页面上加载epub内容
   3. 每次显示epub一个章节的全部内容
   4. 点击播放按钮后，播放完一个章节内容之后，自动翻页到下一个章节
   ```

4. 运行之后报错，js我不熟，还是让AI直接debug，提示词如下：
   ```
   上传epub文件后，报错：
   TypeError: Cannot read properties of undefined (reading 'innerHTML')
      at text-to-speech.js:190:38
   ```

5. 另外增加了几个交互功能，提示词如下：
   ```
   增加功能：按左右箭头键时，可以在章节间导航，并且在页面左面增加章节列表，同样可以直接导航到对应章节
   ```

6. 然后又报错了，提示词如下：
   ```
   加载epub出错：
   TypeError: Cannot read properties of undefined (reading 'display')
      at TextToSpeechPlayer.displayChapter (text-to-speech.js:239:29)
      at text-to-speech.js:201:22
   ```
7. 这问题AI无法解决，我只好自己检查了一遍代码，重新给它具体的错误点，提示词如下：
   ```
   由于标签“epub-content”里依然会有其他div标签嵌套，所以以下代码无法正常获取到文本内容：
   const text = contentElement.innerText;
   ```
8. 这个问题解决之后，又出现了新的问题，提示词如下：
   ```
   点击播放按钮后，以下代码报错：
   this.book.spine.get(chapter.href).then(item => {
   报错信息：
   TypeError: this.book.spine.get(...).then is not a function
      at text-to-speech.js:317:47
      at new Promise (<anonymous>)
      at TextToSpeechPlayer.getCurrentChapterText (text-to-speech.js:305:16)
      at TextToSpeechPlayer.play (text-to-speech.js:280:22)
      at TextToSpeechPlayer.togglePlayPause (text-to-speech.js:150:18)
      at HTMLButtonElement.<anonymous> (text-to-speech.js:42:62)
   ```
   以上几个问题都是由于AI使用的epub.js版本跟最新的版本不兼容导致，所以我只好自己去这个开源项目的文档里找如何使用的方法，好在比较简单，我自己解决了这个打开电子书的问题。
9. 我把改好的js文件加到附件，提出了新的功能需求，提示词如下：
   ```
   基于附件里的代码，修正无法使用左右箭头按键导航章节的问题，以及增加使用空格键翻页的功能
   ```
10. 加上了js和html两个文件作为附件，再次提出界面修改需求，提示词如下：
   ```
   基于附件代码，增加以下功能：
   1. 修改页面，将选择上传文件按钮挪到上方区域（包括上传epub文件按钮、epub文件URL地址——可以基于这个地址打开epub，下拉框显示epub文件列表——基于输入过的epub文件URL历史记录，且可以隐藏/打开）
   2. 当开始播放语音后，如果开始播放翻页后的内容，epub阅读区域也需要同步翻页当前进度
   3. 以上前端页面可以在本地local storage保存阅览记录，并且在选择epub文件后，自动跳转到前一次的阅览位置
   ```
   
11. 增加了新功能之后，AI的代码又把布局忘记了，提示词如下：
   ```
   页面有以下问题：
   1. 之前加载epub后，左边是目录，缺少了这一块页面
   2. 之前的左右方向键和空格翻页功能都没了
   3. load url之后，下拉框的选项默认选中，应该是默认选中空项
   ```

**至此基本上实现了全部的功能，我试了一下，还可以选择朗读的口音——中英文都支持**