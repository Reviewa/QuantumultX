export async function search(query, page) {
  const res = await Request.get(`/search?term=${encodeURIComponent(query)}`).html()
  return {
    items: res.select(".booklist-item").map(e => ({
      title: e.select("a").text(),
      url: e.select("a").attr("href"),
      cover: e.select("img").attr("data-src")
    }))
  }
}

export async function chapters(manga) {
  const res = await Request.get(manga.url).html()
  return {
    items: res.select(".chapter a").map(e => ({
      title: e.text(),
      url: e.attr("href")
    }))
  }
}

export async function pages(chapter) {
  const res = await Request.get(chapter.url, {
    headers: { Referer: "https://rouman5.com" }
  }).html()

  return res.select(".reader img").map(e => ({
    url: e.attr("data-src") || e.attr("src")
  }))
}