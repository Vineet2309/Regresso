import requests
from textblob import TextBlob

def policy():
    NEWS_API_KEY = "3e567bc2e99549cfa01f9b7fb95ccbaf"
    query = "India budget GST MSME tax policy"
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"

    try:
        response = requests.get(url)
        articles = response.json().get('articles', [])
        if not articles:
            return 0.0, "No news found."

        news = []
        for article in articles:
            content = article.get("title", "") + ". " + article.get("description", "")
            polarity = TextBlob(content).sentiment.polarity
            news.append(polarity)

        avg_sentiment = round(sum(news) / len(news), 3)
        return avg_sentiment, f"Fetched sentiment from {len(articles)} articles."

    except Exception as e:
        return 0.0, f"Sentiment fetch failed: {str(e)}"


