// 文件列表
export interface fileItemType {
    file_name?: string;
    page_start?: number;
    page_end?: number;
    max_num?: number;
    duplex?: number;
    position?: number;
    copies_num?: number;
    percent?: number;
    uuid?: string;
    state: number;
    imageUrl?:string;
}