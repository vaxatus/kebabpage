#!/bin/bash

# Kebab Website Deployment Script
echo "🥙 Kebab Website Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to build and run production
deploy_production() {
    print_status "Building production Docker image..."
    
    # Stop any running containers
    docker-compose down 2>/dev/null || true
    
    # Build and start production container
    if docker-compose up --build -d; then
        print_success "Production container started successfully!"
        print_status "Website is now running at: http://localhost:3000"
        print_status "To view logs: docker-compose logs -f"
        print_status "To stop: docker-compose down"
    else
        print_error "Failed to start production container"
        exit 1
    fi
}

# Function to run development
deploy_development() {
    print_status "Starting development environment..."
    
    # Stop any running containers
    docker-compose down 2>/dev/null || true
    
    # Start development container with hot reloading
    if docker-compose --profile dev up --build; then
        print_success "Development environment started!"
    else
        print_error "Failed to start development environment"
        exit 1
    fi
}

# Function to show status
show_status() {
    print_status "Docker container status:"
    docker-compose ps
    
    print_status "Docker images:"
    docker images | grep kebab
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker containers and images..."
    docker-compose down
    docker system prune -f
    print_success "Cleanup completed!"
}

# Main menu
case "$1" in
    "prod"|"production")
        deploy_production
        ;;
    "dev"|"development")
        deploy_development
        ;;
    "status")
        show_status
        ;;
    "stop")
        print_status "Stopping all containers..."
        docker-compose down
        print_success "All containers stopped!"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "clean")
        cleanup
        ;;
    *)
        echo "🥙 Kebab Website Deployment Script"
        echo ""
        echo "Usage: $0 {prod|dev|status|stop|logs|clean}"
        echo ""
        echo "Commands:"
        echo "  prod     - Deploy production version (http://localhost:3000)"
        echo "  dev      - Start development environment with hot reload"
        echo "  status   - Show container and image status"
        echo "  stop     - Stop all running containers"
        echo "  logs     - Show container logs"
        echo "  clean    - Clean up containers and images"
        echo ""
        echo "Examples:"
        echo "  $0 prod    # Deploy production"
        echo "  $0 dev     # Start development"
        echo "  $0 status  # Check status"
        exit 1
        ;;
esac
