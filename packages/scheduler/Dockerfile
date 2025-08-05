FROM alpine:3.20.1

# Install curl, bash, and gettext (for envsubst)
RUN apk add --no-cache curl bash gettext

# Copy files to /app
COPY . /app
COPY ./.env /app/.env

# Make the scripts executable
RUN chmod +x /app/ngtly/tagTrigger.sh
RUN chmod +x /app/ngtly/dailyDeploy.sh
RUN chmod +x /app/ngtly/blogTrigger.sh
RUN chmod +x /app/scraper/trigger.sh
RUN chmod +x /app/scraper/imageTrigger.sh
RUN chmod +x /app/scraper/batchAwaiter.sh

# Setup cron job to log to stdout
RUN echo '0 0 * * * /app/ngtly/dailyDeploy.sh >> /dev/stdout 2>&1' > /etc/crontabs/root
RUN echo '0 0 * * * /app/ngtly/tagTrigger.sh >> /dev/stdout 2>&1' > /etc/crontabs/root
RUN echo '0 0 * * * /app/ngtly/blogTrigger.sh >> /dev/stdout 2>&1' > /etc/crontabs/root
RUN echo '*/1 * * * * /app/scraper/trigger.sh >> /dev/stdout 2>&1' > /etc/crontabs/root
RUN echo '*/1 * * * * /app/scraper/imageTrigger.sh >> /dev/stdout 2>&1' >> /etc/crontabs/root
RUN echo '*/4 * * * * /app/scraper/batchAwaiter.sh >> /dev/stdout 2>&1' >> /etc/crontabs/root

# Start cron in foreground mode
CMD ["crond", "-f", "-d", "8"]
