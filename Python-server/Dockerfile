# Use Python image
FROM python:3.10

# Set working directory
WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0

# Copy dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all Python server files
COPY . .

# Expose the Python server port
EXPOSE 5001

# Run the Flask server
CMD ["python", "server.py"]
