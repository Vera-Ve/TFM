# Generated by Django 4.2.1 on 2023-09-17 12:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('adult', models.BooleanField(default=False)),
                ('backdrop_path', models.CharField(max_length=255, null=True)),
                ('genre_ids', models.JSONField(default=list)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('original_language', models.CharField(max_length=10, null=True)),
                ('original_title', models.CharField(max_length=255, null=True)),
                ('overview', models.TextField(null=True)),
                ('popularity', models.FloatField(null=True)),
                ('poster_path', models.CharField(max_length=255, null=True)),
                ('release_date', models.DateField(null=True)),
                ('title', models.CharField(max_length=255, null=True)),
                ('video', models.BooleanField(default=False)),
                ('vote_average', models.FloatField(null=True)),
                ('vote_count', models.IntegerField(null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
