from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrainingTypeViewSet,
    PersonnelViewSet,
    ExamViewSet,
    ExamBoardViewSet,
    BoardMemberAssignmentViewSet,
    FormTemplateViewSet
)

router = DefaultRouter()
router.register(r'training-types', TrainingTypeViewSet)
router.register(r'personnel', PersonnelViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'boards', ExamBoardViewSet)
router.register(r'assignments', BoardMemberAssignmentViewSet)
router.register(r'templates', FormTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
