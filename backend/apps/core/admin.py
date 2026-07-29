from django.contrib import admin
from .models import TrainingType, GlobalSubject, Personnel, Exam, ExamBoard, BoardMemberAssignment, FormTemplate

@admin.register(TrainingType)
class TrainingTypeAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'createdAt')
    search_fields = ('code', 'name')

@admin.register(GlobalSubject)
class GlobalSubjectAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'createdAt')
    search_fields = ('code', 'name')

@admin.register(Personnel)
class PersonnelAdmin(admin.ModelAdmin):
    list_display = ('fullName', 'militaryRank', 'academicTitle', 'department', 'position', 'phone', 'email')
    list_filter = ('militaryRank', 'department', 'academicTitle')
    search_fields = ('fullName', 'department', 'position', 'phone', 'email')

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'cohort', 'examDate', 'location', 'status')
    list_filter = ('status', 'trainingType')
    search_fields = ('code', 'name', 'cohort', 'location')

@admin.register(ExamBoard)
class ExamBoardAdmin(admin.ModelAdmin):
    list_display = ('boardCode', 'boardName', 'exam', 'pdfStatus', 'pdfUploadedAt')
    list_filter = ('boardCode', 'pdfStatus', 'exam')
    search_fields = ('boardName', 'description')

@admin.register(BoardMemberAssignment)
class BoardMemberAssignmentAdmin(admin.ModelAdmin):
    list_display = ('examBoard', 'personnel', 'roleName', 'assignedSubject')
    list_filter = ('roleName', 'examBoard')
    search_fields = ('roleName', 'assignedSubject', 'notes')

@admin.register(FormTemplate)
class FormTemplateAdmin(admin.ModelAdmin):
    list_display = ('templateCode', 'title', 'boardCode', 'pageSize', 'updatedAt')
    list_filter = ('boardCode', 'pageSize')
    search_fields = ('templateCode', 'title', 'description')
