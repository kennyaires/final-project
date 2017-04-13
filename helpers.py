import feedparser
import urllib.parse

def lookup(cc):
    """Looks up articles for geo."""

    # check cache for geo
    if cc in lookup.cache:
        return lookup.cache[cc]

    # get feed from Google
    feed = feedparser.parse("https://itunes.apple.com/{}/rss/topsongs/limit=10/xml".format(urllib.parse.quote(cc)))

    # cache results
    lookup.cache[cc] = [{"name": item["title"], "link": item["link"], "art": item["content"]} for item in feed["items"]]

    # return results
    return lookup.cache[cc]

# initialize cache
lookup.cache = {}

class Chart(object):
    """__init__() functions as the class constructor"""
    def __init__(self, position=None, name=None, art=None, itunes=None, video=None):
        self.position = position
        self.name = name
        self.art = art
        self.itunes = itunes
        self.video = video