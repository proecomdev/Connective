# Use the Rust official image as the base
FROM rust:1.67

# Set the working directory to /app
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files to the container
COPY Cargo.toml Cargo.lock ./

# Build the dependencies for the project (without running the application)
RUN mkdir src \
    && echo "fn main() {}" > src/main.rs \
    && cargo build --release \
    && rm -rf src

# Copy the source code to the container
COPY . .

# Build the application
RUN cargo build --release

# Expose port 6969 for the webserver
EXPOSE 6969

# Start the webserver when the container starts
CMD ["cargo", "run", "--release"]