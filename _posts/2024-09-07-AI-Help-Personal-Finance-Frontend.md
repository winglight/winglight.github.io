# AI助我写代码（9）：个人记账 - FinTrack（前端））

## 综述

* 在前一天完成个人记账软件的后端接口开发之后，我紧接着试图开发前端页面，虽然的确实现了最基本的功能，但是bug还有基础功能并没有全部完成，大量的细节和页面交互体验都需要
* 经过反复尝试，AI（Claude3.5）实现了大部分代码，但是前端的页面还需要时间慢慢调整
* 代码开源仓库：[FinTrack（前端））](https://github.com/winglight/personal-finance-app)

## 操作视频（TODO）

## 需求
1. 前端主要有三个功能：统计查询、基础设置、记账
2. 其中记账涉及到用户录入，除了普通的表单录入，还想采用AI处理自然语言实现记账
   
## 操作步骤

1. 首先把页面基本功能描述一遍，并附上后台python代码，提供接口信息，提示词如下：
   ```
   基于附件中的后台代码接口，实现以下前端页面的功能：
   1. 主界面是统计查询页面，默认按日显示当天的总消费、总收入和账户总余额（所有账户总和），以及当天的交易明细列表
   2. 主界面如果切换到周、月、年，则按对应日期范围统计显示，并且增加按天统计的账户总余额折线图
   3. 主界面按日、周、月、年显示时，可以通过左右箭头的按钮导航到前一/后一的日、周、月、年
   4. 前端页面需要兼容桌面和手机的显示和导航
   5. 主界面可以通过点击浮动的加号按钮（右下角）进入记账页面，在记账页面可以选择表单（分类需要是两级tag联动的方式选择，账户需要自动选中当前用户的默认账户）或聊天两种输入方式
   6. 主界面可以通过点击浮动的齿轮按钮（右上角）进入设置页面，可以分别设置消费/收入的一二级分类、账户和当前用户的token，如果是用户第一次打开，需要弹出框让用户输入token，并保存在浏览器的local storage
   ```
   Claude生成了几个react js代码。

2. 我并不熟悉前端架构，只能继续要求AI提供基础指导，提示词如下：

   ```
   如何建立上面所说的react, react-chartjs-2的前端框架的脚手架代码
   ```
   这次AI解释非常详细，我跟着照做就完成了整个项目的搭建和代码。

3. 运行起来之后报了很多错误，提示词如下：
   ```
   运行后报错：
   Compiled with problems:
   ×
   ERROR in ./src/components/SettingsPage.js 6:0-28
   Module not found: Error: Can't resolve './SettingsPage.css' in '/Users/user/work/opensource/personal-finance-app/src/components'
   ERROR in ./src/components/StatisticsPage.js
   Module build failed (from ./node_modules/babel-loader/lib/index.js):
   SyntaxError: /Users/user/work/opensource/personal-finance-app/src/components/StatisticsPage.js: JSX attributes must only be assigned a non-empty expression. (71:19)

   69 |       )}
   70 |       {period !== 'day' && stats && (
   > 71 |         <Line data={/* Chart data */} options={/* Chart options */} />
      |                    ^
   72 |       )}
   73 |       <div className="transaction-list">
   74 |         {transactions.map(transaction => (
      at constructor (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:362:19)
      at FlowParserMixin.raise (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:3260:19)
      at FlowParserMixin.jsxParseAttributeValue (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6657:16)
      at FlowParserMixin.jsxParseAttribute (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6704:38)
      at FlowParserMixin.jsxParseOpeningElementAfterName (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6718:28)
      at FlowParserMixin.jsxParseOpeningElementAt (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6713:17)
      at FlowParserMixin.jsxParseElementAt (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6737:33)
      at FlowParserMixin.jsxParseElement (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6800:17)
      at FlowParserMixin.parseExprAtom (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6810:19)
      at FlowParserMixin.parseExprSubscripts (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10584:23)
      at FlowParserMixin.parseUpdate (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10569:21)
      at FlowParserMixin.parseMaybeUnary (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10549:23)
      at FlowParserMixin.parseMaybeUnaryOrPrivate (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10403:61)
      at FlowParserMixin.parseExprOps (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10408:23)
      at FlowParserMixin.parseMaybeConditional (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10385:23)
      at FlowParserMixin.parseMaybeAssign (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10348:21)
      at /Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:5631:39
      at FlowParserMixin.tryParse (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:3598:20)
      at FlowParserMixin.parseMaybeAssign (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:5631:18)
      at /Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10318:39
      at FlowParserMixin.allowInAnd (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:11933:12)
      at FlowParserMixin.parseMaybeAssignAllowIn (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10318:17)
      at FlowParserMixin.parseParenAndDistinguishExpression (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:11195:28)
      at FlowParserMixin.parseParenAndDistinguishExpression (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:5724:18)
      at FlowParserMixin.parseExprAtom (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10851:23)
      at FlowParserMixin.parseExprAtom (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6815:20)
      at FlowParserMixin.parseExprSubscripts (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10584:23)
      at FlowParserMixin.parseUpdate (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10569:21)
      at FlowParserMixin.parseMaybeUnary (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10549:23)
      at FlowParserMixin.parseMaybeUnaryOrPrivate (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10403:61)
      at FlowParserMixin.parseExprOpBaseRightExpr (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10489:34)
      at FlowParserMixin.parseExprOpRightExpr (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10484:21)
      at FlowParserMixin.parseExprOp (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10451:27)
      at FlowParserMixin.parseExprOp (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10457:21)
      at FlowParserMixin.parseExprOp (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10457:21)
      at FlowParserMixin.parseExprOps (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10412:17)
      at FlowParserMixin.parseMaybeConditional (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10385:23)
      at FlowParserMixin.parseMaybeAssign (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10348:21)
      at FlowParserMixin.parseMaybeAssign (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:5682:18)
      at FlowParserMixin.parseExpressionBase (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10302:23)
      at /Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10298:39
      at FlowParserMixin.allowInAnd (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:11933:12)
      at FlowParserMixin.parseExpression (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10298:17)
      at FlowParserMixin.jsxParseExpressionContainer (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6683:31)
      at FlowParserMixin.jsxParseElementAt (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6762:36)
      at FlowParserMixin.jsxParseElement (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6800:17)
      at FlowParserMixin.parseExprAtom (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:6810:19)
      at FlowParserMixin.parseExprSubscripts (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10584:23)
      at FlowParserMixin.parseUpdate (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10569:21)
      at FlowParserMixin.parseMaybeUnary (/Users/user/work/opensource/personal-finance-app/node_modules/@babel/parser/lib/index.js:10549:23)
   ERROR in ./src/components/TransactionForm.js 6:0-31
   Module not found: Error: Can't resolve './TransactionForm.css' in '/Users/user/work/opensource/personal-finance-app/src/components'
   ERROR
   [eslint] 
   src/components/StatisticsPage.js
   Line 71:19:  Parsing error: JSX attributes must only be assigned a non-empty expression. (71:19)
   ```
   改完之后，可以正常运行。

4. 后端地址默认使用了同样的url，所以还需要修改，提示词如下：
   ```
   如何统一修改后台接口的地址
   ```
   AI提供了四种方式，我最终选择了AXIOS

5. 我把所有JS代码文件都上传，要求AI帮我改好，提示词如下：
   ```
   将附件中的代码，从fetch的访问方式改为Axios，并且使用http://127.0.0.1:5000/作为基础URL
   ```

6. 连接后台接口成功，然后报错跨域问题，提示词如下：
   ```
   运行后，访问后台接口报错：CORS错误
   ```

7. 可能是之前的提示词过于抽象，我加入了console报错信息，提示词如下：
   ```
   依然报错：
   Access to XMLHttpRequest at 'http://127.0.0.1:5000/stats?period=day&start_date=2024-09-07&end_date=2024-09-07' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
   ```
   这次的确修复了CORS问题，然而界面非常简陋，还有很多bug，我并不是很满意，准备重新开发。

8. 无论如何，我还是打算开源代码，所以需要readme，提示词如下：
   ```
   把以上的前端功能作为一个开源项目，攥写readme，说明项目是什么，如何做到，有什么优势，适合什么场景，安装指南，使用指南，要求使用markdown格式
   ```
   我发现Claude3.5没有chatgpt写得好，不过已经够用了。
