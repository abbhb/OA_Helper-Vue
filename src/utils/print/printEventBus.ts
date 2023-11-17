// 创建一个 eventHub.js 文件
import type { Emitter } from 'mitt';
import mitt from 'mitt';

type Events = {
  onOneClickPrinting: { fileUrl: string };
};

export async function downloadFileFromUrl(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filenameFromUrl = url.substring(url.lastIndexOf('/') + 1);
        const file = new File([blob], filenameFromUrl, { type: blob.type });
        return file;
    } catch (error) {
        console.error('下载文件时出现错误', error);
        throw error;
    }
}

const printEventHub: Emitter<Events> = mitt<Events>();
export default printEventHub;
