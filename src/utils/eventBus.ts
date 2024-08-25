// 创建一个 eventHub.js 文件
import type {Emitter} from 'mitt';
import mitt from 'mitt';
import {ContactItemW, MsgReadUnReadCountType} from '@/types/chat';
import Modeler from "bpmn-js/lib/Modeler";

type Events = {

  focusMsgInput?: void;
  onSelectPerson: { uid: string; ignoreCheck?: boolean };
  onAddReadCountTask: { msgId: string };
  onRemoveReadCountTask: { msgId: string };
  onGetReadCount: Map<string, MsgReadUnReadCountType>;
    modelerInit: { modeler: Modeler }
    elementUpdate: void;
    elementInit: void;
    changeContactSelect:{item:ContactItemW}
};

const eventHub: Emitter<Events> = mitt<Events>();

export default eventHub;
