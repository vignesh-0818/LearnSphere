from bs4 import BeautifulSoup
from pathlib import Path

path = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template\blog.html")
with open(path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

cards = soup.select("#post-grid article.post-card")
for idx, card in enumerate(cards):
    title = card.select_one("h3")
    title_text = title.text.strip() if title else "No title"
    print(f"Card {idx}: {title_text}")
    print("Link:", card.select_one("a.card-link")['href'] if card.select_one("a.card-link") else "No link")
