import entireListData from "@/assets/data/entire_list.json"

export function getEntireRoomList(offset = 0, size = 20) {
  return Promise.resolve({
    list: entireListData.list || [],
    totalCount: entireListData.totalCount || 0
  })
}
