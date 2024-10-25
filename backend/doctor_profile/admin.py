from django.contrib import admin
from doctor_profile.models import (
    Specialty, HospitalOrWorkplace,
    DoctorProfile, Chamber,
    VistingHour, PaymentRef,
    Division, ProvideApprove,
)


# class CloseDayInline(admin.TabularInline):
#     model = CloseDay
#     extra = 1  # Number of empty forms to display


class ChamberInline(admin.TabularInline):
    model = Chamber
    extra = 1  # Number of empty forms to display


class PaymentRefInline(admin.TabularInline):
    model = PaymentRef
    extra = 1  # Number of empty forms to display


@admin.register(ProvideApprove)
class ProvideApproveAdmin(admin.ModelAdmin):
    list_display = ('doctor_name', 'approved')

    def doctor_name(self, obj):
        return obj.doctor_name


@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ('name', 'pk')


# @admin.register(CloseDay)
# class CloseDayAdmin(admin.ModelAdmin):
#     list_display = ('closed_days', )


@admin.register(VistingHour)
class VistingHourAdmin(admin.ModelAdmin):
    list_display = ('visiting_hour_start', 'visiting_hour_end')


class VistingHourAdmin(admin.TabularInline):
    model = VistingHour
    extra = 1


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    search_fields = ('title',)
    ordering = ('title',)


@admin.register(HospitalOrWorkplace)
class HospitalOrWorkplaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('name',)


# @admin.register(DoctorProfile)
# class DoctorProfileAdmin(admin.ModelAdmin):
#     list_display = ('id', 'first_name', 'last_name',
#                     'approved', 'sex', 'email', 'workplace')
#     search_fields = ('first_name', 'last_name', 'email', 'workplace__name')
#     list_filter = ('approved', 'sex')
#     ordering = ('last_name', 'first_name')

#     # Adding inlines for related models
#     inlines = [ChamberInline, CloseDayInline,
#                VistingHourAdmin, PaymentRefInline]

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name',
                    'get_approved_status', 'sex', 'email', 'workplace')
    search_fields = ('first_name', 'last_name', 'email', 'workplace__name')
    list_filter = ('sex',)
    ordering = ('last_name', 'first_name')
    # Adding inlines for related models
    inlines = [ChamberInline,
               VistingHourAdmin, PaymentRefInline]

    def get_approved_status(self, obj):
        return obj.approved
    get_approved_status.short_description = 'Approved'
    get_approved_status.boolean = True  # Display it as a boolean in the admin


@admin.register(Chamber)
class ChamberAdmin(admin.ModelAdmin):
    list_display = ('id', 'chamber_name', 'doctor', 'default_chamber',
                    'chamber_address',)
    search_fields = ('chamber_name', 'chamber_address')
    list_filter = ('doctor', 'default_chamber',)
    ordering = ('chamber_name',)

    def get_visiting_hours(self):
        return None


@admin.register(PaymentRef)
class PaymentRefAdmin(admin.ModelAdmin):
    list_display = ('id', 'doctor', 'method', 'phone')
    search_fields = ('doctor__first_name', 'doctor__last_name', 'method')
    list_filter = ('method',)
    ordering = ('doctor',)


# # Customizing the admin interface for better usability
# class CustomAdminSite(admin.AdminSite):
#     site_header = "Doctor Management Admin"
#     site_title = "Doctor Management Admin Portal"
#     index_title = "Welcome to Doctor Management Admin"


# admin.site = CustomAdminSite()
