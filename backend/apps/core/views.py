from rest_framework import viewsets
from .models import TrainingType, Personnel, Exam, ExamBoard, BoardMemberAssignment, FormTemplate
from .serializers import (
    TrainingTypeSerializer,
    PersonnelSerializer,
    ExamSerializer,
    ExamBoardSerializer,
    BoardMemberAssignmentSerializer,
    FormTemplateSerializer
)

class TrainingTypeViewSet(viewsets.ModelViewSet):
    queryset = TrainingType.objects.all()
    serializer_class = TrainingTypeSerializer

class PersonnelViewSet(viewsets.ModelViewSet):
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class ExamBoardViewSet(viewsets.ModelViewSet):
    queryset = ExamBoard.objects.all()
    serializer_class = ExamBoardSerializer

    def get_queryset(self):
        queryset = ExamBoard.objects.all()
        exam_id = self.request.query_params.get('examId', None)
        if exam_id is not None:
            queryset = queryset.filter(exam_id=exam_id)
        return queryset

class BoardMemberAssignmentViewSet(viewsets.ModelViewSet):
    queryset = BoardMemberAssignment.objects.all()
    serializer_class = BoardMemberAssignmentSerializer

    def get_queryset(self):
        queryset = BoardMemberAssignment.objects.all()
        exam_board_id = self.request.query_params.get('examBoardId', None)
        if exam_board_id is not None:
            queryset = queryset.filter(exam_board_id=exam_board_id)
        return queryset

class FormTemplateViewSet(viewsets.ModelViewSet):
    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer
