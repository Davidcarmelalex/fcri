"""Zero-dependency sanity checks for static seminar artifacts and skill registries."""
from html.parser import HTMLParser
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])

def main():
    pages = ["index.html", "launch.html", "command-center.html"]
    for page in pages:
        path = ROOT / "webapp" / page
        assert path.is_file(), f"Missing page: {path}"
        text = path.read_text(encoding="utf-8")
        assert "<!doctype html>" in text.lower(), f"Missing doctype: {page}"
        parser = Page()
        parser.feed(text)
        assert parser.ids, f"No UI elements found: {page}"
        for href in parser.links:
            if href.startswith(("http://", "https://", "#", "mailto:")):
                continue
            target = (path.parent / href.split("#")[0]).resolve()
            assert target.is_file(), f"Broken local link: {page}: {href}"
        print(f"PASS frontend {page}")
    for relative in ["skills/master-registry.json", "geoint/registry.json", "osiris/registry.json"]:
        data = json.loads((ROOT / relative).read_text(encoding="utf-8"))
        assert isinstance(data, dict)
        print(f"PASS registry {relative}")
    print("Asset validation completed.")

if __name__ == "__main__":
    main()
