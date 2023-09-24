import {ref} from 'vue';
import {createEventHook, useUserMedia} from '@vueuse/core';
import {Message} from '@arco-design/web-vue';

/**
 * wav音频录制Hook
 */
// eslint-disable-next-line import/prefer-default-export
export const useRecording = () => {
  const isRecording = ref(false); // 是否正在录制
  const timer = ref<any>(null); // 计时器
  const second = ref(0); // 当前秒数
  const mediaRecorder = ref<MediaRecorder | null>(null); // 媒体录制器

  const onEnd = createEventHook<File>();
  // 获取用户的媒体设备
  const { isSupported, stream, start: _start, stop: _stop } = useUserMedia({});

  /**
   * 重置
   * */
  const reset = () => {
    isRecording.value = false;
    second.value = 0;
    mediaRecorder.value = null; // 重置释放addEventListener
    // eslint-disable-next-line no-unused-expressions
    timer.value && clearInterval(timer.value);
  };

  /**
   * 开始录制
   * @return File 录制的WAV音频
   * */
  const start = async () => {
    if (!isSupported.value) {
      Message.warning('当前环境不支持录音');
      return;
    }
    reset(); // 重置保证整个流程干净
    await _start();
    if (!stream.value) return;
    mediaRecorder.value = new MediaRecorder(stream.value);
    mediaRecorder.value.start();
    isRecording.value = true;
    // 开始计时
    timer.value = setInterval(() => {
      // eslint-disable-next-line no-plusplus
      second.value++;
      // 最多录制60秒
      if (second.value >= 59) {
        // eslint-disable-next-line no-use-before-define
        stop();
      }
    }, 1000);

    const audioChunks: Blob[] = [];
    mediaRecorder.value.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.value.addEventListener('stop', () => {
      // eslint-disable-next-line no-unused-expressions
      timer.value && clearInterval(timer.value); // 停止计时

      const blob = new Blob(audioChunks, { type: 'audio/wav' });
      const file = new File([blob], `${Date.now()}.wav`, { type: 'audio/wav' });

      if (second.value < 2) {
        Message.warning('录制时间太短');
        return;
      }
      onEnd.trigger(file);
      reset();
    });
  };

  /**
   * 停止录制
   */
  const stop = () => {
    if (!mediaRecorder.value) return;
    mediaRecorder.value.stop();
    _stop();
  };

  return {
    isRecording,
    second,
    start,
    stop,
    reset,
    onEnd: onEnd.on,
  };
};
