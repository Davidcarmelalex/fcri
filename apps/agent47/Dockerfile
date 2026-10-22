FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /srv
RUN useradd --uid 10001 --create-home agent47
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
USER agent47
EXPOSE 8747
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8747/health', timeout=2)" || exit 1
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8747","--proxy-headers","false"]
