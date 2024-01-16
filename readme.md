#### 防止爬虫抓取
nginx
将下面配置填入nginx配置文件中，可以参考 docker-compose/nginx/nginx.conf 文件中添加反爬虫的方法
```nginx
    # 防止爬虫抓取
    if ($http_user_agent ~* "360Spider|JikeSpider|Spider|spider|bot|Bot|2345Explorer|curl|wget|webZIP|qihoobot|Baiduspider|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Feedfetcher-Google|Yahoo! Slurp|Yahoo! Slurp China|YoudaoBot|Sosospider|Sogou spider|Sogou web spider|MSNBot|ia_archiver|Tomato Bot|NSPlayer|bingbot")
    {
      return 403;
    }
```

#### 拉依赖报错

```
 compiling from source
  × Error: Command failed: C:\windows\system32\cmd.exe /s /c "./configure --disable-shared --prefix="D:\Project\vue-admin-beautiful-template\node_modules\cwebp-bin\vendor" --bindir="D:\Project\vue-admin-beautiful-template\node_modules\cwebp-bin\vendor""
'.' ����� ����ⲿ���Ҳ���ǿ����еĳ���
���������ļ���

这种报错添加raw.githubusercontent.com的ip到host里就行

```

#### 写代码时的坑

```
使用了字节的arco.design
文档里API给的model-value (v-model)
实际代码里需要v-model:model-value="selectUser"
完全得猜好吧...
```

#### 打印机页面空指针引用会导致死循环

#### worker线程没有window上下文

但是有self，很多属性方法和window一致，可以定义window=self来提高兼容性