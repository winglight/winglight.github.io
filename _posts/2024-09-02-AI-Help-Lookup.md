# AI助我写代码（4）：Chrome浏览器插件-Lookup（查单词）

## 综述

* 起因是我习惯于使用一套prompt在chatgpt中查询陌生的单词，复制黏贴还是不够方便，希望能在chrome中实现选中后查单词
* 经过反复尝试，AI（Claude3.5）实现了大部分代码，只是需要多次交互更精确的描述，包括对于外部API的解析和调用
* 代码开源仓库：[Lookup](https://github.com/winglight/lookup)

## 操作视频（TODO）

## 需求
1. 我一开始本来是打算做一个桌面软件，后来发现大部分查单词都是发生在浏览器中，所以后来改为开发chrome插件
   
## 操作步骤

1. 我大概描述了一下界面和功能，提示词如下：
   ```
   开发一个查单词工具，查找方法是调用API接口，返回markdown格式的解释，使用python实现GUI和API调用，并且自动记录查询历史及查询次数，同时可以删除历史记录
   ```

2. AI使用了虚拟的API路径和参数，我改成了真实服务器上的API，提示词如下：

   ```
   将访问查单词API的部分改为，以下基于curl格式的API：
   curl -X POST \
      "https://<your server domain>/api/v1/run/eb76f1d6-85d3-43c9-9c4d-a027833ccedd?stream=false" \
      -H 'Content-Type: application/json'\
   -H 'x-api-key: <your api key>'\
      -d '{"input_value": "message",
      "output_type": "chat",
      "input_type": "chat",
      "tweaks": {
   "GroqModel-snATY": {},
   "ChatInput-rBilA": {},
   "ChatOutput-ZT9GJ": {},
   "Prompt-GDHj8": {}
   }}'
   ```

3. 为了方便安装环境，要求AI生成requirements，提示词如下：
   ```
   将以上代码的依赖库生成对应的requirements.txt文件
   ```

4. AI代码中，没有处理API的返回结果，提示词如下：
   ```
   将以上代码中，解析API返回结果中，加入处理，其中返回的消息在json中的路径是：[0].messages[0]
   ```

5. 实际上AI代码没有成功解析返回的json，我只好给它一个实际的json作为例子，重新生成解析代码，提示词如下：
   ```
   在代码中加入对于长时间运行的任务进行计时并打印的功能响应如下，需要解析出“message”中，"text"的值：
   {'session_id': 'eb76f1d6-85d3-43c9-9c4d-a027833ccedd', 'outputs': [{'inputs': {'input_value': 'Define the word: big'}, 'outputs': [{'results': {'message': {'text_key': 'text', 'data': {...}, 'sender': 'Machine', 'sender_name': 'AI', 'session_id': 'eb76f1d6-85d3-43c9-9c4d-a027833ccedd', 'component_id': 'ChatOutput-ZT9GJ', 'files': [], 'type': 'message'}], 'component_display_name': 'Chat Output', 'component_id': 'ChatOutput-ZT9GJ', 'used_frozen_result': False}]}]}
   ```

   中间省略了实际的response内容，这次AI正确解析了。

6. 功能实现好了，略微调整一下布局，提示词如下：
   ```
   把GUI布局中，下方的查找历史面板改为左边较窄的位置
   ```
7. 似乎因为上下文已经超过Claude极限，所以我把代码上传，重新生成，提示词如下：
   ```
   把GUI布局中，下方的”历史记录列表“改为左边较窄的位置
   ```
8. 继续修改布局，提示词如下：
   ```
   把按钮“删除按钮”移到下方
   ```
9. 发现还有一些需要增加的新功能，提示词如下：
   ```
   增加功能：所有历史查找都缓存结果，双击左边列表中的单词，首先从缓存获取查找结果，没有则再次网络搜索。另外，在结果显示中，如果双击其中一个单词，也自动查找这个单词
   ```
10. 缓存有点小问题，提示词如下：
   ```
   缓存也要保存在sqlite而不是内存中
   ```
   
11. 增加一点交互体验，提示词如下：
   ```
   搜索框增加对于回车键按下的监听，可以代替点击“Search”按钮
   ```
12. 这次发现了前面增加新功能时引入的bug，提示词如下：
   ```
   报错：
   Exception in Tkinter callback
   Traceback (most recent call last):
   File "/Users/chenyu/opt/miniconda3/lib/python3.9/tkinter/__init__.py", line 1892, in __call__
      return self.func(*args)
   File "/Users/chenyu/work/opensource/VideoExtractSub/lookup.py", line 90, in search_word
      cached_result = self.get_cached_result(word)
   File "/Users/chenyu/work/opensource/VideoExtractSub/lookup.py", line 170, in get_cached_result
      self.cursor.execute("SELECT result FROM history WHERE word = ?", (word,))
   sqlite3.InterfaceError: Error binding parameter 0 - probably unsupported type.
   ```

   **到此为止，桌面版的Lookup已经开发完成，下面就是我产生了新的想法：制作chrome插件版本**

13. 直接要求AI提供新版本，提示词如下：
   ```
   把以上功能改为chrome插件，交互方式：1. 用户选中网页中的单词，然后弹出查找结果的悬浮窗口；2. 独立页面可以实现查找功能
   ```

14. 虽然AI生成了很完整的代码，但是有个问题就是没有兼容Google的v3版本，提示词如下：
   ```
   改为manifest_version为3的版本
   ```

15. 虽然这时已经可以正常使用了，但是我刚好看到Google gemini发布了chrome内建版本，提示词如下：
   ```
   通过chrome内置的gemini nano实现一个查询单词定义的chrome插件
   ```
   然而，实际测试发现，gemini nano的效果太糟糕了，完全答非所问。而且还有跟现有调用方式不兼容的问题。

16. 最后我问了AI一个发散性问题，提示词如下：
   ```
   除了单词查询,您认为这个 Chrome 扩展还可以提供哪些其他有用的功能?
   ```   