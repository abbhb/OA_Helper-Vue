<script lang="ts" setup></script>

<template>
  <div class="page"
  ><h1>是时候升级你的浏览器了</h1>
    <p
    >你正在使用的浏览器版本过低（IE或使用chromium内核版本低于87的浏览器）。这意味着在升级浏览器前，你将无法访问此网站。</p
    >
    <div class="hr"></div>
    <h2>请注意：低版本浏览器会给你的使用带来困扰</h2>
    <p
    >没有关键的浏览器安全更新，您的电脑可能易受有害病毒、间谍软件和其他恶意软件的攻击，它们可以窃取或损害您的业务数据和信息。请参阅
      <a href="https://support.dmeng.net/end-of-ie-support.html"
      >微软对旧版 Internet Explorer 的支持服务已终止的说明</a
      >
      。</p
    >
    <div class="hr"></div>
    <h2>更先进的浏览器</h2>
    <p class="targetline"
    >推荐使用以下浏览器的最新版本。如果你的电脑已有以下浏览器的最新版本则直接使用该浏览器极速模式访问<b
      id="referrer"
    >
    </b>即可。 </p><!-- before-browser -->
    <ul id="browser-list" class="browser-list">
      <li class="browser chrome"
      ><a
        id="browser-chrome-link"
        href="https://www.google.cn/chrome/thank-you.html?standalone=1&amp;statcb=0&amp;installdataindex=empty"
      ><img
        alt="谷歌浏览器"
        height="34"
        src="data:image/png;base64,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"
        width="34"
      />谷歌浏览器 <span id="browser-chrome-badge">Google Chrome</span></a
      >
      </li>
      <li class="browser firefox"
      ><a
        id="browser-firefox-link"
        href="https://download.mozilla.org/?product=firefox-latest-ssl&amp;os=win&amp;lang=zh-CN"
      ><img
        alt="火狐浏览器"
        height="34"
        src="data:image/png;base64,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"
        width="34"
      />火狐浏览器<span id="browser-firefox-badge">Mozilla Firefox</span></a
      ></li
      >
      <li class="browser edge"
      ><a
        id="browser-edge-link"
        href="https://www.microsoft.com/zh-cn/windows/microsoft-edge"
      ><img
        alt="微软浏览器"
        height="34"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAAkFBMVEX///8AeNeRxe4ojt222PQ2leAji90VhNv9/v/s9fybyvBssugbhtwJfdn0+f3a7Pm/3fWm0PGhzvFVpeVNoeRGneJBmuEvkd8skN4PgNr5/P7J4vfB3vWs1PKEvuyAvOt9u+tor+fl8vvg7/re7vrQ5vi93PWw1fOMwu2HwOx3uOpws+k6l+ADetio0fFjrOeLIB3CAAABE0lEQVQ4y62S2ZKCMBBFc2XfFGQTBRXHcXfm///OVOwiRUvBi+cB6nadTiWdiO+zuGaGU4XW/998WKgf6IhuA9I6RY/I5MZPCM6WGQ4w4VhQPI08K7RtCs1eVbKTq5Jpk2K7+rCQtJ7w6nd2LXIunXIHVgvZHSVU2JBiCGLuoJW/HdKuqSAnpnzGXhmo2eaAHeU0l58GcPREZ1B0694Ococ2EJUGUYakWKR4uo2zYrMbV46YVEwMY2jFh6S6+LM+2yVTooMYIQEkyYhBl/IYU9bvWbW94u+mFwMo8qN+IXfM+h0gius5jk0/KAEsBV+GwxW3nFSEZ4Pjf5wqB6MRHzQ2NM8sFkOcAiusKscugsQTX+UFJ+cN6VbY+OIAAAAASUVORK5CYII="
        width="34"
      />微软浏览器<span id="browser-edge-badge">Microsoft Edge</span></a
      ></li
      >
      <li class="browser ie2345"
      ><a
        id="browser-ie2345-link"
        href="https://dn-2345.cdn.bcebos.com/2345explorer/p8_kbuild_v2.0.exe"
      ><img
        alt="2345浏览器"
        height="34"
        src="data:image/png;base64,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"
        width="34"
      />2345加速浏览器<span id="browser-ie2345-badge">双内核安全版</span></a
      ></li
      >
      <li class="browser se360"
      ><a
        id="browser-se360-link"
        href="https://dl.360safe.com/netunion/20140425/360se+75526+n1abed0ce91.exe"
      ><img
        alt="360安全浏览器"
        height="34"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAIAAAC1JZyVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGtmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNC0wM1QwMzoxMDoyMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDQtMDZUMTY6NDc6MjErMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDQtMDZUMTY6NDc6MjErMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZmM1OTEyMTQtZWY2Mi00YzQ1LTgxYWMtYWIyNDM3MTI4NjM4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTc1OWQzNWMtNzI1My0xZTRjLWI0OWItMjcyM2E5N2Q5MmFhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MDc3MjA2ZWEtNDU3Ni1mNDQ0LTg3OTItZjM1OWJhY2U0M2Y3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNzcyMDZlYS00NTc2LWY0NDQtODc5Mi1mMzU5YmFjZTQzZjciIHN0RXZ0OndoZW49IjIwMTgtMDQtMDNUMDM6MTA6MjIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVmNmI1MzllLTBmMjUtYTI0Yi1hODU2LWM4NDliZjU3ZGYwOCIgc3RFdnQ6d2hlbj0iMjAxOC0wNC0wNlQxNjo0NzowOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmM1OTEyMTQtZWY2Mi00YzQ1LTgxYWMtYWIyNDM3MTI4NjM4IiBzdEV2dDp3aGVuPSIyMDE4LTA0LTA2VDE2OjQ3OjIxKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpLExRoAAAe2SURBVEjHrVcLUJTX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"
        width="34"
      />360安全浏览器<span id="browser-se360-badge">小白用户选择</span></a
      ></li
      >
      <li class="browser qqbrowser"
      ><a
        id="browser-qqbrowser-link"
        href="https://cdntip-net-production-file-1251013107.file.myqcloud.com/myapp/rcps/d/85000/QQBrowser_subid@100002_urlid@100002.exe"
      ><img
        alt="QQ浏览器9"
        height="34"
        src="data:image/png;base64,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"
        width="34"
      />QQ浏览器9<span id="browser-qqbrowser-badge">腾讯用户推荐</span></a
      ></li
      >
      <li class="browser clearleft"></li>
    </ul
    ><!-- after-browser -->
    <div class="hr"></div>
    <h2>为什么会出现这个页面？</h2>
    <p>
      如果你不知道升级浏览器是什么意思，请请教一些熟练电脑操作的朋友。如果你使用的不是IE6/7/8/9/10，而是edge浏览器、QQ浏览器、chrome浏览器等，出现这个页面是因为你使用的不是该浏览器的最新版本，升级至最新即可。</p
    >
    <div class="hr"></div>
    <h2>一起抵制IE6、IE7、IE8、IE9、IE10</h2>
    <p>
      为了兼容这个曾经的浏览器霸主，网页设计人员需要做大量的代码工作。对于普通用户而言，低版本IE更是一个岌岌可危的安全隐患，在Windows历史上几次大的木马病毒事件都是利用IE漏洞进行传播。所以，请和我们一起抵制IE的过期版本！</p
    >
  </div>
</template>

<style scoped>
/* Eric Meyer's Reset CSS v2.0 - http://cssreset.com */
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  margin: 0;
  padding: 0;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

body {
  line-height: 1;
}

ol,
ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

*,
::after,
::before {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: #0072c6;
}

a:hover {
  text-decoration: none;
  color: #004d8c;
}

body {
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  font-family: Microsoft YaHei, '宋体', sans-serif;
  color: #454545;
  overflow-y: scroll;
  _overflow-y: auto;
  *overflow-y: auto;
}

.page {
  width: 960px;
  margin: 0 auto;
  padding: 10px;
  text-align: left;
}

h2,
h3 {
  font-family: Microsoft YaHei;
}

h1 {
  font-size: 40px;
  line-height: 60px;
  font-weight: 100;
  margin: 20px 0 15px;
}

h2 {
  font-size: 20px;
  line-height: 25px;
  font-weight: 100;
  margin: 10px 0;
}

h3 {
  font-weight: bold;
}

code {
  padding: 2px 4px;
  font-size: 95%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}

pre code {
  white-space: pre-wrap;
  word-break: break-word;
  display: inline-block;
  word-break: break-all;
}

ul {
  padding: 0 1em;
}

ul li {
  list-style-type: disc;
  list-style-position: inside;
}

b,
strong {
  font-weight: bold;
}

em {
  color: red;
}

p {
  margin-bottom: 10px;
}

hr,
.hr {
  margin: 20px 0;
  border: 0;
  width: 100%;
  height: 1px;
  overflow: hidden;
  background-color: #ccc;
}

.text-right {
  text-align: right;
}

.clearboth {
  clear: both;
  width: 100%;
  content: '';
}

.clearleft {
  clear: left;
  width: 100%;
  content: '';
}

.clearright {
  clear: right;
  width: 100%;
  content: '';
}

.browser-list {
  margin: 16px 0 10px;
  padding: 0;
  height: 42px;
  _overflow: hidden;
}

.browser {
  display: block;
  width: 155px;
  height: 34px;
  line-height: 22px;
  float: left;
  list-style: none;
}

.browser.clearleft {
  height: 1px;
}

.browser span {
  display: block;
  font-size: 12px;
  line-height: 1.2;
}

.browser img {
  width: 34px;
  height: 34px;
  border: 0;
  float: left;
  margin-right: 10px;
}

.browser.firefox {
  width: 150px;
}

.browser.edge {
  width: 150px;
}

.browser.ie2345 {
  width: 170px;
}

.browser.se360 {
  width: 160px;
}

.browser.qqbrowser {
  width: 140px;
}

.small-alert {
  font-size: 12px;
  margin: 15px 0 8px;
  color: #90949c;
}

.small-alert:not(.hide) + hr {
  margin-top: 0;
}

.hide {
  display: none;
}

.alert-danger {
  display: block;
  color: #777;
  background-color: #f1f1f1;
  padding: 6px 12px;
  _padding: 8px 12px 6px;
  clear: both;
}

.alert-info {
  color: #000;
  background-color: #f1f6fc;
  margin-top: 12px;
}

.alert-info img {
  vertical-align: text-top;
}

#win-danger {
  margin-top: 12px;
  position: relative;
}

#win-danger .arrow {
  border: 0;
  position: absolute;
  display: block;
  width: 20px;
  height: 12px;
  left: 325px;
  top: -12px;
}

.targetline,
#referrer a {
  word-break: break-all;
}

.top-alert {
  background: #f2f2f2;
}

.top-alert-content {
  font-size: 14px;
}

@media only screen and (max-width: 959px) {
  .page {
    max-width: 100%;
    padding: 20px;
    font-size: 16px;
    line-height: 26px;
  }

  h1 {
    font-size: 26px;
    line-height: 1.8;
    font-weight: bold;
    margin-top: 0;
  }

  .browser-list {
    height: auto;
  }

  .browser {
    margin: 0 20px 20px 0;
  }

  code {
    word-break: break-word;
  }
}
</style>
