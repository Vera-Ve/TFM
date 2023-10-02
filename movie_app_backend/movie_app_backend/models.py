from django.contrib.auth.models import User
from django.db import models


class Movie(models.Model):
    
    adult = models.BooleanField(default=False)
    backdrop_path = models.CharField(max_length=255, null=True)
    genre_ids = models.JSONField(default=list)
    id = models.IntegerField(primary_key=True)
    original_language = models.CharField(max_length=10, null=True)
    original_title = models.CharField(max_length=255, null=True)
    overview = models.TextField(null=True)
    popularity = models.FloatField(null=True)
    poster_path = models.CharField(max_length=255, null=True)
    release_date = models.DateField(null=True)
    title = models.CharField(max_length=255, null=True)
    video = models.BooleanField(default=False)
    vote_average = models.FloatField(null=True)
    vote_count = models.IntegerField(null=True)

    def __str__(self):
        return self.title

class Blacklist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField(null=True)

    def __str__(self):
        return f'Blacklist - {self.user.username} - Movie ID: {self.movie_id}'
    
class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField(null=True)

    def __str__(self):
        return f'Blacklist - {self.user.username} - Movie ID: {self.movie_id}'