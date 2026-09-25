from rest_framework.exceptions import APIException
from rest_framework import status 


#custom exception
class ConflictException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'Unavailable.'


#custom exception
class ForbiddenException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'Forbidden'
