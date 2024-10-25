FROM node:alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the project
RUN npm run build

# Verify that the build produced the .next directory
RUN ls -la /app/.next

FROM node:alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ARG NEXT_PUBLIC_BACK_API
ENV NEXT_PUBLIC_BACK_API=${NEXT_PUBLIC_BACK_API}

ARG NEXT_PUBLIC_BACK_API_PROD
ENV NEXT_PUBLIC_BACK_API_PROD=${NEXT_PUBLIC_BACK_API_PROD}

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create a new user and group
RUN addgroup -g 2001 nodejs
RUN adduser -S nextjs -u 2002

# Check if the .next directory exists before changing ownership
RUN if [ -d /app/.next ]; then chown -R nextjs:nodejs /app/.next; fi

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
