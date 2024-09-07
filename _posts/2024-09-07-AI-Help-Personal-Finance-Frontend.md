# AI助我写代码（9）：个人记账 - FinTrack（前端））

## 综述

* 在前一天完成个人记账软件的后端接口开发之后，我紧接着试图开发前端页面，虽然的确实现了最基本的功能，但是bug还有基础功能并没有全部完成，大量的细节和页面交互体验都需要
* 经过反复尝试，AI（Claude3.5）实现了大部分代码，但是前端的页面还需要时间慢慢调整
* 代码开源仓库：[FinTrack（前端））](https://github.com/winglight/personal-finance-app)

## 操作视频（TODO）

## 需求
1. 因为这次的功能比较复杂，我先从后端描述几个基本的业务对象的增删改查功能
2. 分类、账户、交易三个业务生成基本的增删改查功能
3. 基于交易的统计查询功能
   
## 操作步骤

1. 首先我想实现一套完整的个人记账服务的方案，提示词如下：
   ```
   基于python flask开发一个用于个人记账的web服务，实现以下需求：
   1. 维护消费的一二级分类，收入的一二级分类信息
   2. 维护账户信息，例如：银行账户、证券账户、微信、支付宝、现金等，支持不同货币类型并自动转换为主货币（人民币）
   3. 按时间、消费/收入、一二级分类、金额、项目、记帐人、账户、备注这几个字段保存消费或收入记录
   4. 提供按天、周、月、年的统计查询功能，x轴是时间周期，y轴包括以下几个维度：总资产、消费/收入、一二级分类
   5. 提供按天、周、月、年的统计查询功能，x轴是时间周期，y轴是账户中的资金
   ```
   结果Claude生成了完整的数据结构和python代码，复制到一个python文件里就能运行起来。

2. 由于第一次生成的代码只有单一的核心业务接口，所以我要求AI生成完整的CRUD接口，提示词如下：

   ```
   增加以下接口：
   1. 维护消费/收入分类除了现在的新增接口，还需要删除（软删除）、修改、查询（列表查询和基于id的查询），其中列表查询需要支持返回一级分类及基于一级分类返回二级分类的功能
   2. 维护账户信息除了现在的新增接口，还需要删除（软删除）、修改、查询（列表查询和基于id的查询）
   3. transaction除了现在的新增接口，还需要删除（软删除）、修改、查询（支持翻页的列表和基于id、时间范围、列表等条件的查询）
   ```

3. 为了方便在postman中测试接口，我要求AI生成curl，提示词如下：
   ```
   基于以上所有接口，生成对应的curl，并为每个字段生成看起来真实的值
   ```
   实际生成之后我发现要一个个导入挺麻烦，还不方便设置变量，于是我在postman里先生成CRUD模版，再复制黏贴

4. 运行之后报错，提示词如下：
   ```
   报错：
   Traceback (most recent call last):
   File "/Users/chenyu/work/opensource/Personal-Finance/main.py", line 6, in <module>
      from flask_sqlalchemy import Pagination
   ImportError: cannot import name 'Pagination' from 'flask_sqlalchemy' (/Users/chenyu/opt/miniconda3/lib/python3.9/site-packages/flask_sqlalchemy/__init__.py)
   ```
   这是个简单问题，删除import就解决了

**此时我发现AI的局限性：对于后端应用，有很多小问题不值得一遍遍的问AI来解决，特别是要描述清楚需求，有这个时间自己早已经解决**

5. 我发现对于一二级分类没有一个统一的获取入口，于是新增了一个接口，提示词如下：
   ```
   新增一个接口，功能如下：
   1. 获取全部的category（未软删）
   2. 数组中的一级对象仅包括一级分类，而一级分类中加入一个子分类的字段，值是所有属于这个一级分类的二级分类
   3. 可选条件是：type，区分消费和收入
   ```

6. 因为已经修改了一些问题，所以加上附件main.py，提示词如下：
   ```
   基于附件代码，增加以下功能：
   1. 每个接口都需要通过token验证当前用户
   2. 在config文件中配置：用户名称与token的配对信息，以及用户默认使用的account id
   3. 在创建transaction的接口中，根据token判断当前用户给created_by赋值，并根据用户默认account给account_id赋值（前提是请求body中没有提供这个字段的值）
   ```

7. 我发现之前没有生成统计接口的curl，提示词如下：
   ```
   为统计查询功能接口生成curl
   ```

8. 然后调用统计接口时报错，提示词如下：
   ```
   统计功能报错：
   sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such function: date_trunc
   [SQL: SELECT date_trunc(?, "transaction".date) AS period, "transaction".type AS transaction_type, sum("transaction".amount) AS total 
   FROM "transaction" 
   WHERE "transaction".date BETWEEN ? AND ? GROUP BY date_trunc(?, "transaction".date), "transaction".type]
   [parameters: ('week', '2023-06-01 00:00:00.000000', '2024-09-30 00:00:00.000000', 'week')]
   (Background on this error at: https://sqlalche.me/e/20/e3q8)
   ```
   然而这次AI的回复很抽象，我感觉不太对。

9. 没法，我只能自己debug一下，找到了出错的代码然后给AI，要求它修改，提示词如下：
   ```
   当前的代码是这样的，请基于以下代码修复前面的问题：
   def get_stats():
      period = request.args.get('period', 'month')
      start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
      end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
      
      # 总资产统计
      total_assets = db.session.query(func.sum(Account.balance)).scalar()
      
      # 收入支出统计
      income_expense = db.session.query(
         func.date_trunc(period, Transaction.date).label('period'),
         Transaction.type,
         func.sum(Transaction.amount).label('total')
      ).filter(
         Transaction.date.between(start_date, end_date)
      ).group_by(
         func.date_trunc(period, Transaction.date),
         Transaction.type
      ).all()
      
      # 分类统计
      category_stats = db.session.query(
         func.date_trunc(period, Transaction.date).label('period'),
         Category.name,
         func.sum(Transaction.amount).label('total')
      ).join(Category).filter(
         Transaction.date.between(start_date, end_date)
      ).group_by(
         func.date_trunc(period, Transaction.date),
         Category.name
      ).all()
      
      # 账户资金统计
      account_stats = db.session.query(
         func.date_trunc(period, Transaction.date).label('period'),
         Account.name,
         func.sum(Transaction.amount).label('total')
      ).join(Account).filter(
         Transaction.date.between(start_date, end_date)
      ).group_by(
         func.date_trunc(period, Transaction.date),
         Account.name
      ).all()
      
      return jsonify({
         'total_assets': total_assets,
         'income_expense': [{'period': i[0], 'type': i[1], 'total': i[2]} for i in income_expense],
         'category_stats': [{'period': i[0], 'category': i[1], 'total': i[2]} for i in category_stats],
         'account_stats': [{'period': i[0], 'account': i[1], 'total': i[2]} for i in account_stats]
      })
   ```
10. 然后调用统计接口时报错，提示词如下：
   ```
   统计功能报错：
   sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such function: date_trunc
   [SQL: SELECT date_trunc(?, "transaction".date) AS period, "transaction".type AS transaction_type, sum("transaction".amount) AS total 
   FROM "transaction" 
   WHERE "transaction".date BETWEEN ? AND ? GROUP BY date_trunc(?, "transaction".date), "transaction".type]
   [parameters: ('week', '2023-06-01 00:00:00.000000', '2024-09-30 00:00:00.000000', 'week')]
   (Background on this error at: https://sqlalche.me/e/20/e3q8)
   ```

**这次问题终于解决了，然而后面的开发任务还有很多，下次会生成前端页面看看效果**