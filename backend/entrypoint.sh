
# Make database migrations
echo "Make database migrations"
python manage.py makemigrations

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

python manage.py collectstatic --noinput

