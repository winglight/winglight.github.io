# AI助我写代码（6）：电子书本地朗读（Epub Local Reciter）

## 综述

* 因为有时不方便“看”电子书，而朗读功能只在有限的App中提供，所以我想做一个基于网页，本地运行的朗读电子书工具
* 经过反复尝试，AI（Claude3.5）实现了大部分代码，不过，可能这次功能比较复杂，所以调试bug花了很长时间,而且有多处bug只能自己解决
* 代码开源仓库：[Clipboard AI](https://github.com/winglight/clipboard_ai)

## 操作视频（TODO）

## 需求
1. 基本上，我设想的软件功能很简单，就是用AI解析剪贴板内容
2. 麻烦的地方在于：一是需要准确描述UI布局，二是涉及到AI的配置信息需要单独窗口，三是交互操作比之前的软件要复杂
   
## 操作步骤

1. 一开始我简单描述了一下界面和功能，提示词如下：
   ```
   基于以下描述，开发一个基于python的桌面软件：
   1. 软件的主要功能是监听剪贴板的内容，如果是图片，则发送图片给AI，提示词是：“解释此图”，AI返回结果，将结果显示在软件上。
   2. 软件的主窗口左边是剪贴板历史列表，可以是图片，也可以是文字，当选中其中一条时，右边上方显示剪贴板内容，下方显示AI返回的结果，如果是文字，提供一个按钮，需要用户主动点击后才发给AI，提示词是：“解释以下内容：”。
   3. 软件使用的AI需要提供配置界面，支持两种AI，一种是OpenAI的ChatGPT，另一种是ollama，并且可以设置默认使用模型，由于可以选择以上两种AI中的不同模型，需要支持保存多个配置，在主窗口提供AI模型的切换下拉框。
   4. 软件界面需要精致、美观、可调整大小、可缩小到系统托盘，并且支持自定义皮肤。
   ```

2. Claude只是生成了项目的文件目录结构，包括了6个python文件，我要求它生成全部代码，提示词如下：

   ```
   提供以上python代码的文件下载
   ```
   Claude3.5不像chatgpt可以直接提供文件的下载链接，因此只能手动复制全部代码，并且建立对应的项目目录结构和文件。

3. 为了保存查询历史，增加了本地存储的新功能，提示词如下：
   ```
   基于sqlite实现main_window.py中的剪贴板历史数据保存以及配置信息保存，图片则保存在clips目录下
   ```

4. 之前的代码并没有真的实现AI调用的代码，提示词如下：
   ```
   实现ai_interface.py中调用AI的方法以及main_window.py中调用AI的方法
   ```

5. Bug太多了，需要自己检查代码的运行情况，提示词如下：
   ```
   在ai_interface.py中，应该使用main_window.py中加载好的AI配置信息
   ```

6. 只实现了openai的配置，还要支持ollama，提示词如下：
   ```
   send_to_ollama方法也要使用配置信息进行AI调用
   ```
7. 我发现几次修改后的代码都只是部分，需要一个完整版本，提示词如下：
   ```
   给出前面修改过的main_window.py的最终完整代码
   ```
8. 需要一个requirements，提示词如下：
   ```
   给出requirements.txt的完整内容
   ```
9. 运行代码后，发现新的异常，提示词如下：
   ```
   运行报错，需要输出DatabaseManager的完整代码：
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 12, in <module>
      main()
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 7, in main
      window = MainWindow()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 53, in __init__
      self.load_history()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 110, in load_history
      clips = self.db_manager.get_all_clips()
   AttributeError: 'DatabaseManager' object has no attribute 'get_all_clips'
   ```
10. 再次运行，冒出新的bug，提示词如下：
   ```
   运行报错，需要输出ClipboardMonitor的完整代码：
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 12, in <module>
      main()
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 7, in main
      window = MainWindow()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 59, in __init__
      self.clipboard_monitor.text_copied.connect(self.on_text_copied)
   AttributeError: 'ClipboardMonitor' object has no attribute 'text_copied'
   ```
   
11. 继续改进，提示词如下：
   ```
   有三个问题需要改进：
   1. 剪贴板监听时，如果图片或文本为空，则不需要增加对应的一条历史记录
   2. 主界面打开时，如果没有配置任何AI模型，则自动弹出配置页面
   3. 在主界面增加菜单，用于打开配置页面
   ```
12. 主界面的代码改动很多，提交了当前版本代码作为附件，提示词如下：
   ```
   main_window问题很多，请根据附件重新增加2、3的功能
   ```

13. 配置界面的代码依然缺少，提示词如下：
   ```
   生成ConfigDialog的代码
   ```

14. 运行后又报错，提示词如下：
   ```
   报错：
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 3, in <module>
      from ui.main_window import MainWindow
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 6, in <module>
      from PyQt6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
   ImportError: cannot import name 'QAction' from 'PyQt6.QtWidgets' (/Users/root/opt/miniconda3/lib/python3.9/site-packages/PyQt6/QtWidgets.abi3.so)
   ```

15. AI调用的代码依然有问题，不知道为什么总是不能正确理解如何获取配置信息，加了附件ai_interface.py，提示词如下：
   ```
   配置窗口中，AI模型的Type应该是openai和ollama，而后者基础的配置信息是：api_url、model，参考附件
   ```

16. 继续添加交互功能，提示词如下：
   ```
   主界面窗口中，左边的剪贴板历史需要提供：全部清除（Clear）、使用删除键（DEL）删除选中记录，这两个功能
   ```   

17. 运行再次报错，加了附件main_windows.py，提示词如下：
   ```
   参考附件代码，解决以下报错：
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 12, in <module>
      main()
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 7, in main
      window = MainWindow()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 53, in __init__
      self.init_ui()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 88, in init_ui
      left_panel.addWidget(clear_button)
   AttributeError: 'QWidget' object has no attribute 'addWidget'
   ```

18. 运行再次报错，加了相关三个代码附件main_windows.py、config_manager.py, config_dialog.py，提示词如下：
   ```
   基于附件，解决以下问题：
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 12, in <module>
      main()
   File "/Users/root/work/opensource/clipboard_ai/main.py", line 7, in main
      window = MainWindow()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 65, in __init__
      self.check_ai_config()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 242, in check_ai_config
      self.open_config_dialog()
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 245, in open_config_dialog
      config_dialog = ConfigDialog(self.db_manager)
   File "/Users/root/work/opensource/clipboard_ai/ui/config_dialog.py", line 15, in __init__
      self.init_ui()
   File "/Users/root/work/opensource/clipboard_ai/ui/config_dialog.py", line 24, in init_ui
      self.config_list.itemClicked.connect(self.load_config)
   AttributeError: 'ConfigDialog' object has no attribute 'load_config'
   ```

19. 对于配置的细节，AI理解有困难，可能是因为openai和ollama的配置项不一样，提示词如下：
   ```
   解决问题：ConfigDialog中，选择ollama时，没有api_url的设置项
   ```

20. 配置界面还有几个细节问题需要解决，提示词如下：
   ```
   config_dialog的界面中，左边列表需要选中后，在右边显示对应的配置信息，而且右边点击save保存时，不能每次都是新建，而是需要通过名字判断是否存在对应配置，如果有就更新，如果没有才是新建
   ```

21. 配置界面运行起来还有bug，提示词如下：
   ```
   配置页面中，点击左边列表选项后报错：
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/ui/main_window.py", line 163, in change_ai_model
      config_id = self.ai_config_combo.itemData(index)
   AttributeError: 'MainWindow' object has no attribute 'ai_config_combo'
   Traceback (most recent call last):
   File "/Users/root/work/opensource/clipboard_ai/ui/config_dialog.py", line 97, in load_config
      config = self.db_manager.get_config(self.current_config_id)
   AttributeError: 'DatabaseManager' object has no attribute 'get_config'
   ```

22. 配置界面运行起来还有bug，加了附件config_dialog.py，提示词如下：
   ```
   根据附件代码，解决以下问题：
   D Inhibit
   Traceback (most recent call last):
   File "/Users/chenyu/work/opensource/clipboard_ai/ui/config_dialog.py", line 170, in save_config
      self.load_config(items[0])
   File "/Users/chenyu/work/opensource/clipboard_ai/ui/config_dialog.py", line 109, in load_config
      self.ollama_api_url_input.setText(other_settings_dict.get('api_url', ''))
   AttributeError: 'str' object has no attribute 'get'
   ```

23. 这次是保存配置时报错，我在考虑是否有其他方式，提示词如下：
   ```
   因为以下代码在保存时，就是存为了str类型：
   other_settings = json.dumps({'api_url': api_url})
   因此，在以下代码试图加载json对象时，报错：AttributeError: 'str' object has no attribute 'get'
   other_settings_dict = json.loads(other_settings)

   是否有其他方法，进行json对象的保存和加载？
   ```

24. 现在只剩两个小问题了，提示词如下：
   ```
   根据附件中的代码，修改以下问题：
   1. 左边clear按钮只是清楚了界面中的数据，并没有删除数据库中的历史记录
   2. 点击右边的“send to AI”按钮时，提示没有选择AI模型，但是其实已经有选择
   ```

25. 因为Claude使用了异步线程去调用AI服务，所以这里的问题比较复杂，交互了多次才解决，提示词顺序如下：
    ```
    基于附件代码，运行后，self.threadpool.start(worker)，这句代码没有执行AIWorker的run方法，请解决
    ```

    ```
    以下这段代码中，因为payload是dict类型，所以报错，请修正：
      async with aiohttp.ClientSession() as session:
                  async with session.post(url, data=payload) as response:
                     print(url, payload)
      报错信息：
      Error: the JSON object must be str, bytes or bytearray, not dict
    ```

**这次的开发时间达到四五个小时，期间需要反复运行重试，还要解决连接不同类型AI的问题以及数据存储问题，看来AI还有很大的进化之路要走**