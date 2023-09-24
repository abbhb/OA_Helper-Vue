// notification
type NotificationType = {
  text: string;
  icon: string;
  name: string;
};

const notification = ({ name, text, icon }: NotificationType) => {
  // eslint-disable-next-line no-new
  new Notification(`MallChat: ${name}`, {
    body: text,
    icon,
  });
};

const notify = ({ name, text, icon }: NotificationType) => {
  // eslint-disable-next-line default-case
  switch (Notification.permission) {
    case 'granted': {
      notification({ name, text, icon });
      break;
    }
    case 'default': {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          notification({ name, text, icon });
        }
      });
    }
  }
};

export default notify;
