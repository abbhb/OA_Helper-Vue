function onclickEvents(notification: Notification) {
  notification.onclick = function (ev) {
    console.log(ev);
    window.focus();
    notification.close();
  }
}

export function hasNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'default') {
    return false;
  }
  if (Notification.permission === 'denied') {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  return false;
}

export function notifyMe(title: string, message: string,icon?:string) {
  // 先检查浏览器是否支持
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  }
  // 检查用户是否同意接受通知
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    const notification = new Notification(title, {body: message,icon:icon || undefined});
    onclickEvents(notification);
  }
  // 否则我们需要向用户获取权限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function (permission) {
      // 如果用户接受权限，我们就可以发起一条消息
      if (permission === 'granted') {
        const notification = new Notification(title, {body: message, icon:icon || undefined});
      }
    });
  }
  // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
  // 出于尊重，我们不应该再打扰他们了
}

