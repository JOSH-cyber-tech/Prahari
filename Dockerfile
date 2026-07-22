# Use the official Python 3.11 slim image
FROM python:3.11-slim

# Set the working directory to /code
WORKDIR /code

# Copy the requirements file and install dependencies
COPY ./prahari_dashboard_backend/requirements.txt /code/requirements.txt

# Install dependencies (including CPU-only PyTorch)
RUN pip install --no-cache-dir -r /code/requirements.txt

# Copy the rest of the repository
COPY . /code

# Hugging Face Spaces expects the app to run on port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Command to run the application
CMD ["bash", "-c", "cd prahari_dashboard_backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
