export class NoticeAnnexItem {
  noticeId?: string;

  sortNum: number;

  fileUrl: string;

  fileName?: string;

  image?: string;

  constructor(noticeId, sortNum, fileUrl, fileName, image) {
    this.noticeId = noticeId;
    this.sortNum = sortNum;
    this.fileUrl = fileUrl;
    this.fileName = fileName;
    const geshi = this.fileName
        ? this.fileName?.split('.')[fileName.split('.').length - 1]
        : 'file';
    if (['png', 'jpg'].includes(geshi)) {
      this.image = 'image';
    } else {
      this.image = geshi;
    }
    if (image !== '?') {
      this.image = image;
    }
  }
}

export default {NoticeAnnexItem};
