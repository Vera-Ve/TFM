
from rest_framework import serializers
from .models import Movie, Blacklist

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'
class BlacklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blacklist
        fields = '__all__'