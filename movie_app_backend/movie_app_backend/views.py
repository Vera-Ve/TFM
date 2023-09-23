from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView

import logging
logger = logging.getLogger(__name__)




from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import Movie, Blacklist
from .serializers import MovieSerializer, BlacklistSerializer

#Creación de Usuario
class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Verificar si ya existe un usuario con el mismo email
        if User.objects.filter(email=email).exists():
            return Response({'message': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)

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
        if Movie.objects.filter(user=user, id=movie_id).exists():
            return Response({'message': 'La película ya está en tu watchlist'}, status=status.HTTP_400_BAD_REQUEST)
        # Crea una copia mutable de los datos de la solicitud
        mutable_data = request.data.copy()
        print(mutable_data)
        # Agrega el campo 'user' a los datos de la película
        mutable_data['user'] = request.user.id

        serializer = MovieSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Película agregada a la watchlist'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
        movies_in_watchlist = Movie.objects.filter(user=user)
        print(movies_in_watchlist)
        serializer = MovieSerializer(movies_in_watchlist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

#Agrega la película a blacklist

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_blacklist(request):
    user = request.user
    movie_id = request.data.get('movie_id')
    print(f"User ID: {user.id}, Movie ID: {movie_id}")

    try:
        # Verifica si la película ya está en la lista negra del usuario
        if not Blacklist.objects.filter(user=user, movie_id=movie_id).exists():
            # Agrega la película a la lista negra
            blacklist_entry = Blacklist(user=user, movie_id=movie_id)
            blacklist_entry.save()
            Movie.objects.filter(id=movie_id, user=user).delete()

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
    Movie.objects.filter(id=movie_id, user=user).delete()
    # Realiza la lógica para eliminar la película con movie_id de la watchlist del usuario actual.
    # Asegúrate de verificar que el usuario esté autenticado antes de eliminar la película.
    # Devuelve una respuesta adecuada, por ejemplo, un mensaje de éxito.
    return Response({'message': 'Película eliminada de la watchlist correctamente.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_blacklist(request):
    user = request.user
    movie_id = request.data.get('movie_id')
    Blacklist.objects.filter(id=movie_id, user=user).delete()
    return Response({'message': 'Película eliminada de la blacklist correctamente.'})
   
        
       
    
            
            
            
           
    
    
    

class BlacklistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        movies_in_blacklist = Blacklist.objects.filter(user=user)
        print(movies_in_blacklist)
        serializer = BlacklistSerializer(movies_in_blacklist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

