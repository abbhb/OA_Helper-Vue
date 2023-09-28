// 创建一个 eventHub.js 文件
import type {Emitter} from 'mitt';
import mitt from 'mitt';
import {MsgReadUnReadCountType} from '@/types/chat';

type Events = {
  focusMsgInput?: void;
  onSelectPerson: { uid: string; ignoreCheck?: boolean };
  onAddReadCountTask: { msgId: string };
  onRemoveReadCountTask: { msgId: string };
  onGetReadCount: Map<string, MsgReadUnReadCountType>;
};

const eventHub: Emitter<Events> = mitt<Events>();
export default eventHub;
