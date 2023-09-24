import {UserItem} from "@/types/chat";

export const uniqueUserList = (arr: UserItem[]) => {
  return Object.values(Object.fromEntries(arr.map((item) => [item.uid, item])))
}
export default {uniqueUserList}