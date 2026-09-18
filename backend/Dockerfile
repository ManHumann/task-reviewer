FROM python:3.14-slim AS  builder

COPY requirements.txt .

RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


FROM python:3.14-slim as prod

RUN useradd -m appuser

USER appuser

COPY --from=builder /install /usr/local

COPY . . 

EXPOSE 8000

CMD ["python3","-m","app.main"]
