# backend/Dockerfile
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .
# Copy .env file
# COPY .env ./

# Expose port 8000 (internally)
EXPOSE 8000

# Default command to run when the container starts
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "doctors.wsgi:application"]

