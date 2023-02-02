from rest_framework import permissions


class IsVolunteer(permissions.BasePermission):
    """ Custom permission class to allow only volunteers to access certain endpoints """

    def has_permission(self, request, view):
        return request.user.is_volunteer
