import eventBus from '@/utils/eventBus';
import type { MsgReadUnReadCountType } from '@/types/chat';

import type { Ref } from 'vue';
import { getMsgReadCount } from '@/api/chat';

const queue = new Set<string>();
let timer: number | null = null;

const onAddReadCountTask = ({ msgId }: { msgId: string }) => {
  queue.add(msgId);
};
const onRemoveReadCountTask = ({ msgId }: { msgId: string }) => {
  queue.delete(msgId);
};
const task = async () => {
  // 10s 了上个请求还未完成就中断掉
  // 暂时没有实现
  if (queue.size > 0) {
    // 开始新请求
    console.log("新请求")
    console.log([...queue])
    const { data } = await getMsgReadCount( [...queue]);
    const result = new Map<string, MsgReadUnReadCountType>();
    data.forEach((item) => result.set(item.msgId, item));
    eventBus.emit('onGetReadCount', result);
  }
};

export const initListener = () => {
  eventBus.on('onAddReadCountTask', onAddReadCountTask);
  eventBus.on('onRemoveReadCountTask', onRemoveReadCountTask);
  clearQueue();
};

export const clearListener = () => {
  eventBus.off('onAddReadCountTask', onAddReadCountTask);
  eventBus.off('onRemoveReadCountTask', onRemoveReadCountTask);
  timer && clearInterval(timer);
};

export const clearQueue = () => {
  queue.clear();
  timer && clearInterval(timer);
};

export const readCountQueue = () => {
  task();
  // @ts-ignore
  timer = setInterval(task, 10000);
};
