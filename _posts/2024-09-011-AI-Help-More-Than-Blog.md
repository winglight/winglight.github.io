# AI的广泛应用 - 心理按摩

## 综述

* 以前大部分时候，我用AI解决一些搜索引擎不能准确反馈的较复杂问题，也包括翻译reddit上的梗，最近我开始应用AI辅助编程。今天我发现，AI还有很多意想不到的功能，比如：我看了本书上面强调，要做交易日志，以便复盘和改善操作，然而好几天都没法下手，直到问了AI才发现，AI的回答比我预想的还要好。

## AI心理按摩

### 需求
1. 炒股难免因为浮亏而着急上火，浮盈而兴奋激动，保持情绪稳定，对于交易非常重要
2. 最近浮亏严重，不知道应该不应该继续等待回本的时机
3. 我对于禅宗、基督教、冥想有些了解，所以希望基于这几个方面获得参考意见
   
## 操作步骤

1. 我设想的是，每次提问都会有三种不同的解答，提示词如下：
   ```
   你是一人分饰三角，每次我提出问题或者要求后，你分别按照以下三种角色回答： 
   1. 一个禅宗大师，精通禅宗经籍和理论，擅长用比喻、类比、解答困惑，揭露深层次的问题 
   2. 一个基督教主教，精通基督教理论并深刻洞察世俗的痛苦和难题，擅长应答信众的告解和请教 
   3. 一个冥想大师，擅长冥想，熟悉如何达到冥想的状态，擅长处理各种思绪杂念
   ```
   我在langflow环境下的playground中试了一下，效果还不错，如图：
   ![playground截屏](../images/screenshot.jpg)

2. 我希望把这个做成一个标准的聊天对话框的交互模式，经过多轮调研，我最终选择了langflow自带的widget，因为这个最简单、最方便部署。
   ```
   https://github.com/langflow-ai/langflow-embedded-chat
   ```

3. 首先在本地建立一个chat.html：
   ```html
   <html lang="zh">
   <head>
      <meta charset="UTF-8">
      <script src="https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.6/dist/build/static/js/bundle.min.js"></script>
   </head>
   <body>
      <langflow-chat
      window_title="禅宗、基督、冥想一起解惑"
      flow_id="your flow id"
      host_url="your host"
      api_key="your key"
      start_open=true

   ></langflow-chat>
   </body>
   </html>
   ```
   直接在vscode中，启动“Go Live”，查看效果还不错：
   ![playground截屏](../images/screenshot2.jpg)

4. 然后是部署到服务器上，这里碰到的问题太多了，我就不一一列举了，其中有一个“无限重定向”的问题是AI帮忙解决的，而且定位很准，在CloudFlare中修改SSL设置就解决了。