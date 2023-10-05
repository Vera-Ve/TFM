from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Movie, Blacklist,Watchlist
from .serializers import MovieSerializer, BlacklistSerializer, WatchlistSerializer

#Creación de Usuario
class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Verificar si ya existe un usuario con el mismo email
        if User.objects.filter(email=email).exists():
            return Response({'message': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar la contraseña utilizando las reglas de validación de Django
            validate_password(password)
        except ValidationError as e:
            return Response({'message': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        # Crear un nuevo usuario
        user = User.objects.create_user(username=email, email=email, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

#Autenticación de Usuario
class AuthView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(username=email, password=password)
        
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)  # Genera un token JWT
             # Establece una cookie HTTPOnly para el refresh token
            response = Response({'message': 'Login successful', 'token': str(refresh.access_token)})
            response.set_cookie(key='refresh_token', value=str(refresh), httponly=True)
            return response
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])  # Asegura que el usuario esté autenticado
#@authentication_classes([TokenAuthentication])
def add_to_watchlist(request):
     # Verifica si se recibe el token JWT correctamente
    print("Token JWT recibido:", request.auth)
    if request.method == 'POST':
        user = request.user  # Obtiene el usuario autenticado
        
        movie_id = request.data.get('id')
        
        # Verifica si la película ya está en la watchlist del usuario actual
        if Watchlist.objects.filter(user=user, movie_id=movie_id).exists():
            return Response({'message': 'La película ya está en tu watchlist'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica si la película ya está en el modelo Movie
        if not Movie.objects.filter(id=movie_id).exists():
            # La película no está en Movie, por lo que la creamos
            movie_serializer = MovieSerializer(data=request.data)

            if movie_serializer.is_valid():
                movie_serializer.save()
       # Crea una nueva entrada en la watchlist del usuario con el movie_id
        watchlist_data = {'user': user.id, 'movie_id': movie_id}
        watchlist_serializer = WatchlistSerializer(data=watchlist_data)

        if watchlist_serializer.is_valid():
            watchlist_serializer.save()
            return Response({'message': 'Película agregada a la watchlist'}, status=status.HTTP_201_CREATED)
        else:
            return Response(watchlist_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'message': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    




    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        # Agrega más campos según tus necesidades
    }
    
    return Response(user_data)


class WatchlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
       # Obtén la lista de movie_id en el Watchlist del usuario
        watchlist_movie_ids = Watchlist.objects.filter(user=user).values_list('movie_id', flat=True)

        # Filtra las películas que están en el Watchlist del usuario
        filtered_movies = Movie.objects.filter(id__in=watchlist_movie_ids)

        # Serializa las películas para enviarlas como respuesta
        serializer = MovieSerializer(filtered_movies, many=True)  # Asegúrate de tener un serializador MovieSerializer

        return Response(serializer.data, status=status.HTTP_200_OK)







#Agrega la película a blacklist

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_blacklist(request):
    user = request.user
    movie_id = request.data.get('id')
    print(f"User ID: {user.id}, Movie ID: {movie_id}")
    

    try:
        # Verifica si la película ya está en la lista negra del usuario
        if not Blacklist.objects.filter(user=user, movie_id=movie_id).exists():
            # Agrega la película a la lista negra
            blacklist_entry = Blacklist(user=user, movie_id=movie_id)
            blacklist_entry.save()
            Watchlist.objects.filter(movie_id=movie_id, user=user).delete()
             # Verifica si la película ya está en el modelo Movie
        if not Movie.objects.filter(id=movie_id).exists():
            
            # La película no está en Movie, por lo que la creamos
            movie_serializer = MovieSerializer(data=request.data)
            print(request.data)
            if movie_serializer.is_valid():
                movie_serializer.save()
            
                    
            return Response({'message': 'Película agregada a la lista negra correctamente.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Película ya está en la lista negra.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request):
    user = request.user
    movie_id = request.data.get('movie_id')
    Watchlist.objects.filter(movie_id=movie_id, user=user).delete()
    # Realiza la lógica para eliminar la película con movie_id de la watchlist del usuario actual.
    # Asegúrate de verificar que el usuario esté autenticado antes de eliminar la película.
    # Devuelve una respuesta adecuada, por ejemplo, un mensaje de éxito.
    return Response({'message': 'Película eliminada de la watchlist correctamente.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_blacklist(request):
    user = request.user
    movie_id = request.data.get('movie_id')
    Blacklist.objects.filter(movie_id=movie_id, user=user).delete()
    return Response({'message': 'Película eliminada de la blacklist correctamente.'})
   


class BlacklistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
       # Obtén la lista de movie_id en el Watchlist del usuario
        blacklist_movie_ids = Blacklist.objects.filter(user=user).values_list('movie_id', flat=True)

        # Filtra las películas que están en el Watchlist del usuario
        filtered_movies = Movie.objects.filter(id__in=blacklist_movie_ids)

        # Serializa las películas para enviarlas como respuesta
        serializer = MovieSerializer(filtered_movies, many=True)  # Asegúrate de tener un serializador MovieSerializer

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class BlacklistCheckView(APIView):
     def get(self, request):
        # Obtiene todos los registros de Blacklist
        blacklist_entries = Blacklist.objects.all()
                # Serializa los datos de Blacklist
        serializer = BlacklistSerializer(blacklist_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ClearBlacklistView(APIView):
    def delete(self, request):
        # Elimina todos los registros de Blacklist
        Blacklist.objects.all().delete()
        
        return Response({'message': 'La tabla Blacklist se ha vaciado correctamente.'}, status=status.HTTP_204_NO_CONTENT)
    
class ClearWatchlistView(APIView):
    def delete(self, request):
        # Elimina todos los registros de Blacklist
        Watchlist.objects.all().delete()
        
        return Response({'message': 'La tabla Watchlist se ha vaciado correctamente.'}, status=status.HTTP_204_NO_CONTENT)


class ClearDatabaseView(APIView):
    def delete(self, request):
        # Elimina todos los registros de Blacklist
        Movie.objects.all().delete()
        
        return Response({'message': 'La tabla Movie se ha vaciado correctamente.'}, status=status.HTTP_204_NO_CONTENT)
    
