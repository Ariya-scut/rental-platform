import goodPriceData from "@/assets/data/home_goodprice.json"
import highScoreData from "@/assets/data/home_highscore.json"
import discountData from "@/assets/data/home_discount.json"
import hotRecommendData from "@/assets/data/home_hotrecommenddest.json"
import longforData from "@/assets/data/home_longfor.json"
import plusData from "@/assets/data/home_plus.json"

export function getHomeGoodPriceData() {
  return Promise.resolve(goodPriceData)
}

export function getHomeHighScoreData() {
  return Promise.resolve(highScoreData)
}

export function getHomeDiscountData() {
  return Promise.resolve(discountData)
}

export function getHomeHotRecommendData() {
  return Promise.resolve(hotRecommendData)
}

export function getHomeLongforData() {
  return Promise.resolve(longforData)
}

export function getHomePlusData() {
  return Promise.resolve(plusData)
}
