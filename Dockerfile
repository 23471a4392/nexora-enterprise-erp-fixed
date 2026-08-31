# Nexora Enterprise ERP - static frontend container
FROM nginx:alpine
LABEL maintainer="Nexora Engineering"
LABEL description="Nexora Enterprise ERP frontend prototype"

# Copy static assets
COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY docs /usr/share/nginx/html/docs
COPY README.md /usr/share/nginx/html/

# Simple health endpoint
RUN echo "ok" > /usr/share/nginx/html/health

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
