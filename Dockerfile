# ---- build ----------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# --include=dev is explicit on purpose: if the platform sets NODE_ENV=production,
# npm ci drops devDependencies, @astrojs/check goes missing, and `astro check`
# prints an install prompt and exits 0 — a type check that silently does nothing.
RUN npm ci --include=dev
COPY . .

# The verification gate runs INSIDE the image build, so a failing check cannot
# produce a deployable artifact.
RUN npm run verify

# Precompress so nginx can serve .gz without spending CPU per request.
RUN find dist -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \
      -o -name '*.svg' -o -name '*.xml' \) -exec gzip -9 -k {} \;

# ---- serve ----------------------------------------------------------------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
