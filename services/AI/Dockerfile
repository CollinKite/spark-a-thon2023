# Start from the official Python 3.8 Docker image
FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy app source code to Docker image
COPY . .

# Install app dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port and define the command to start the app
EXPOSE 5000
CMD [ "python", "./app.py" ]
