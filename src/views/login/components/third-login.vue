<script lang="ts" setup>
import {thirdLogin} from '@/api/third-login';
import {Message} from '@arco-design/web-vue';

const otherLogin = async (type) => {
  const {data} = await thirdLogin(type);
  if (data) {
    Message.success('服务器收到了你的登录请求，加载中...');
    window.open(data, 'newwindow',
      'height=600, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
  }
};
</script>

<template>
  <div class="waibao">
    <div class="field">
      <div class="ui horizontal divider session-login__oauth-title">
        <span class="text-muted"> 其他方式登录 </span>
      </div>
    </div>
    <div class="ui horizontal list session-oauth__list">
      <div class="item">
        <a sa_evt="click_GiteeCommunity_login_thirdparty">
          <div class="other-login-icon">
            <div
              class="qq iconfont icon-hover"
              sa_click_bottom="qq"
              title="使用QQ登录"
              @click="otherLogin('qq')"
            >
              <svg
                class="icon-logo_item"
                height="200"
                p-id="1456"
                t="1701871411222"
                version="1.1"
                viewBox="0 0 1024 1024"
                width="200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M512 509.724444m-501.191111 0a501.191111 501.191111 0 1 0 1002.382222 0 501.191111 501.191111 0 1 0-1002.382222 0Z"
                  fill="#13B7F6"
                  p-id="1457"
                ></path>
                <path
                  d="M726.471111 547.271111a500.622222 500.622222 0 0 1-46.648889-113.777778v-4.551111A179.768889 179.768889 0 0 0 512 241.208889a179.768889 179.768889 0 0 0-167.822222 190.008889v4.551111a498.346667 498.346667 0 0 1-46.648889 113.777778 129.706667 129.706667 0 0 0-7.395556 71.111111 92.728889 92.728889 0 0 0 12.515556 36.977778c3.982222 3.982222 7.964444 8.533333 21.048889 0a139.377778 139.377778 0 0 0 21.048889-25.6 137.102222 137.102222 0 0 0 29.582222 46.648888c-15.928889 7.395556-39.253333 24.462222-40.96 35.271112s24.462222 52.906667 85.333333 53.475555A99.555556 99.555556 0 0 0 501.191111 739.555556a93.866667 93.866667 0 0 1 10.808889-11.946667 90.453333 90.453333 0 0 1 10.808889 9.671111 99.555556 99.555556 0 0 0 83.057778 27.306667c60.871111 0 87.04-42.666667 85.333333-53.475556s-25.031111-27.875556-40.96-35.271111a137.671111 137.671111 0 0 0 29.582222-46.648889 139.377778 139.377778 0 0 0 21.048889 25.6c12.515556 9.102222 16.497778 4.551111 21.048889 0a93.866667 93.866667 0 0 0 12.515556-36.977778 129.706667 129.706667 0 0 0-7.395556-71.111111z m0 0"
                  fill="#FFFFFF"
                  p-id="1458"
                ></path>
              </svg>
            </div>
            <div
              class="wx iconfont icon-hover"
              sa_click_bottom="wx"
              title="使用微信登录"
              @click="otherLogin('wx')"
            >
              <svg
                class="icon-logo_item"
                height="200"
                p-id="3376"
                t="1701944323479"
                version="1.1"
                viewBox="0 0 1024 1024"
                width="200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                  fill="#28C445"
                  p-id="3377"
                ></path>
                <path
                  d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                  fill="#28C445"
                  p-id="3378"
                ></path>
              </svg>
            </div>
          </div>
        </a
        ></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.waibao {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.field {
}

.ui.horizontal.session-login__oauth-title {
  font-weight: normal;
}

.ui.divider {
  font-size: 1rem;
}

.ui.horizontal.divider:before {
  background-position: right 1em top 50%;
}

.ui.horizontal.divider:before,
.ui.horizontal.divider:after {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC);
}

.ui.horizontal.divider:after {
  background-position: left 1em top 50%;
}

.ui.horizontal.divider:before,
.ui.horizontal.divider:after {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
  background-repeat: no-repeat;
}

.ui.horizontal.divider:before,
.ui.horizontal.divider:after {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
  background-repeat: no-repeat;
}

.ui.divider {
  margin: 1rem 0rem;
  line-height: 1;
  height: 0em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.85);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.ui.horizontal.divider:before,
.ui.horizontal.divider:after {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
  background-repeat: no-repeat;
}

*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  box-sizing: inherit;
}

.ui.divider {
  margin: 1rem 0rem;
  line-height: 1;
  height: 0em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.85);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.ui.horizontal.session-login__oauth-title {
  font-weight: normal;
}

.ui.horizontal.divider {
  display: table;
  white-space: nowrap;
  height: auto;
  margin: '';
  line-height: 1;
  text-align: center;
}

.icon-logo_item {
  width: 30px;
  height: 30px;
}

.other-login-icon {
  display: flex;
  justify-content: space-around;
}

.icon-hover:hover {
  cursor: pointer;
}
</style>
