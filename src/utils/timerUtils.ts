export const formatTime = (minutes: number, seconds: number): string => {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const calculateElapsedTime = (startTime: number, currentTime: number): number => {
  return Math.floor((currentTime - startTime) / 1000);
};

let tickSound: HTMLAudioElement | null = null;
let notificationSound: HTMLAudioElement | null = null;

const createAudio = (url: string): HTMLAudioElement => {
  const audio = new Audio();
  audio.src = url;
  return audio;
};

export const playTickSound = async () => {
  try {
    if (!tickSound) {
      tickSound = createAudio(import.meta.env.BASE_URL + 'sounds/tick.mp3');
      tickSound.loop = true;
    }
    
    await tickSound.play();
  } catch (error) {
    console.warn('播放背景音失败:', error);
  }
};

export const stopTickSound = () => {
  if (tickSound) {
    tickSound.pause();
    tickSound.currentTime = 0;
  }
};

export const playNotificationSound = async () => {
  try {
    if (!notificationSound) {
      notificationSound = createAudio(import.meta.env.BASE_URL + 'sounds/notification.mp3');
    }
    notificationSound.currentTime = 0;
    await notificationSound.play();
  } catch (error) {
    console.warn('播放提示音失败:', error);
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('此浏览器不支持通知');
    return;
  }

  if (Notification.permission !== 'granted') {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('通知权限已获取');
      }
    } catch (error) {
      console.warn('请求通知权限失败:', error);
    }
  }
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (error) {
      console.warn('显示通知失败:', error);
    }
  }
};