# Official Wiki.js Image use karein (Sabse stable)
FROM requarks/wiki:2

# Port 3000 expose karein
EXPOSE 3000

# Saari configurations Environment Variables se aayengi
ENV DB_TYPE=postgres
ENV DB_PORT=5432
ENV DB_SSL=true
