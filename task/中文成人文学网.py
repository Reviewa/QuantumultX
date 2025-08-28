import requests
from bs4 import BeautifulSoup
import re
import time
import os
import random
import unicodedata

# 更新请求头，模拟真实浏览器以绕过潜在限制
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Referer": "https://book.xbookcn.net/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Connection": "keep-alive"
}

def safe_filename(name, ext=".txt"):
    """将书名转换为安全的文件名"""
    name = unicodedata.normalize("NFKD", name)
    name = re.sub(r"[^\w\s-]", "", name)
    name = name.strip().replace(" ", "_")
    return name + ext if name else "novel" + ext

def get_search_url(bookname):
    """构造搜索URL，并设置max-results=500以抓取更多章节"""
    encoded_name = re.sub(r"\s+", "+", bookname.strip())
    return f"https://book.xbookcn.net/search/label/{encoded_name}?max-results=500"

def get_next_page_url(soup):
    """提取下一页URL"""
    next_btn = soup.find("a", attrs={"rel": "next"})
    return next_btn["href"] if next_btn else None

def get_post_links(base_url, bookname, max_pages=100):
    """抓取目录页中与书名相关的文章链接，支持多页"""
    links = []
    next_page = base_url
    page_count = 0

    while next_page and page_count < max_pages:
        print(f"📄 抓取目录页: {next_page}")
        try:
            resp = requests.get(next_page, headers=headers, timeout=10)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding
            soup = BeautifulSoup(resp.text, "html.parser")

            for a in soup.find_all("a", href=True):
                href = a["href"]
                title = a.get_text(strip=True)
                if href and title and "book.xbookcn.net" in href and len(title) < 50:
                    if bookname.lower() in title.lower():
                        links.append((title, href))

            next_page = get_next_page_url(soup)
            page_count += 1
            time.sleep(random.uniform(1, 3))
        except requests.RequestException as e:
            print(f"❌ 目录页请求失败: {e}")
            break

    print(f"✅ 共获取到与 '{bookname}' 相关的 {len(links)} 篇文章")
    return links

def extract_text(url):
    """提取文章正文，排除导航和推荐内容"""
    print(f"🔍 提取正文: {url}")
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding
        soup = BeautifulSoup(resp.text, "html.parser")

        # 调试：打印页面标题
        print(f"页面标题: {soup.title.string if soup.title else '无标题'}")

        # 尝试查找正文容器
        content_div = soup.find("div", class_=re.compile(r"post-body|content|entry"))
        if content_div:
            for tag in content_div.find_all(["a", "nav"]):
                tag.decompose()  # 移除<a>和<nav>标签
            text = content_div.get_text(" ", strip=True)
            print(f"✅ 找到正文块: {len(text)} 字符")
        else:
            # 备用：查找中文字符最多的块，排除导航
            candidates = soup.find_all(["div", "article", "section"])
            text = max((tag.get_text(" ", strip=True) for tag in candidates if tag.get_text() and not tag.find("nav")),
                      key=lambda x: len(re.findall(r"[\u4e00-\u9fff]", x)), default="")
            print(f"⚠️ 使用备用逻辑，字符数: {len(text)}")

        # 清理多余空白和过滤无关关键词
        text = re.sub(r"\s+", " ", text).strip()
        text = re.sub(r"(上一页|下一页|主页|分类|作家专栏|全部小说|列表|\w+小说)", "", text, flags=re.IGNORECASE)
        return text if text and len(re.findall(r"[\u4e00-\u9fff]", text)) > 10 else "正文提取失败"
    except requests.RequestException as e:
        print(f"❌ 正文请求失败: {e}")
        return f"提取失败: {e}"

def download_book(bookname):
    """下载指定书名的整本书"""
    safe_name = safe_filename(bookname)
    save_dir = os.path.expanduser("~/Documents")
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    filepath = os.path.join(save_dir, safe_name)

    # 构造搜索URL并获取相关链接
    toc_url = get_search_url(bookname)
    posts = get_post_links(toc_url, bookname)
    if not posts:
        print(f"❌ 没有找到与 '{bookname}' 相关的文章链接")
        return

    with open(filepath, "w", encoding="utf-8") as f:
        for i, (title, link) in enumerate(posts, 1):
            print(f"📖 下载 {i}/{len(posts)}: {title}")
            try:
                content = extract_text(link)
                if "提取失败" not in content:
                    f.write(f"\n\n=== 第{i}章 {title} ===\n\n")
                    f.write(content + "\n")
                else:
                    print(f"⚠️ 跳过空内容: {title}")
            except Exception as e:
                print(f"❌ 章节下载失败: {title}, 错误: {e}")
            time.sleep(random.uniform(1, 2))

    print(f"\n🎉 '{bookname}' 下载完成，保存为: {filepath}")

if __name__ == "__main__":
    # 用户输入书名
    bookname = input("请输入要下载的书名（例如 '小村春色'）：")
    download_book(bookname)