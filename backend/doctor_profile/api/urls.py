from django.urls import path
from rest_framework.routers import DefaultRouter
from doctor_profile.api.api import (
    DivisionHospitalSpecialtyPublicSingleAPIView, FindDoctorsBySpecialORDivision,
    DoctorDetailAPIPublicView, DoctorProfileCreateAPIView,
    DoctorChamberRetriveView, DoctorChamberUDView,
    VistingHourUpdateView, ChamberVisitingHourCreateView,
    VisitingHourCreateView, DoctorProfileRetriveUpdateDelete,
    PaymentRefViewSet,

)


urlpatterns = [
    path('public/div-hos-spe', DivisionHospitalSpecialtyPublicSingleAPIView.as_view()),
    path('public/find-doctors', FindDoctorsBySpecialORDivision.as_view()),
    path('public/doctors/<int:pk>', DoctorDetailAPIPublicView.as_view()),

]

urlpatterns += [
    path('doctor-chamber/<int:pk>', DoctorChamberUDView.as_view()),
    path('doctor-chamber-all', DoctorChamberRetriveView.as_view()),
    path('doctor-profile-create', DoctorProfileCreateAPIView.as_view()),
]


urlpatterns += [
    path('doctor-visiting-hour-create/<int:pk>',
         VisitingHourCreateView.as_view()),
    path('doctor-chamber-visiting-hour-create',
         ChamberVisitingHourCreateView.as_view()),
    path('doctor-chamber-visiting-hour/<int:pk>',
         VistingHourUpdateView.as_view()),
]

urlpatterns += [
    path(
        'doctor-profile', DoctorProfileRetriveUpdateDelete.as_view()
    ),
]

router = DefaultRouter(trailing_slash=False)
router.register(r'payment-ref', PaymentRefViewSet, basename='paymentref')
urlpatterns += router.urls
