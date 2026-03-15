from django.db import models

# Create your models here.
    
class tbl_district(models.Model):
    district_name=models.CharField(max_length=50)


class tbl_admin(models.Model):
    admin_name=models.CharField(max_length=50)
    admin_email=models.CharField(max_length=50)
    admin_password=models.CharField(max_length=255)
class tbl_bhktype(models.Model):
    bhktype_name=models.CharField(max_length=50)    
class tbl_floortype(models.Model):
    floortype_name=models.CharField(max_length=50)
class tbl_tenenttype(models.Model):
    tenanttype_name=models.CharField(max_length=50)
class tbl_user(models.Model):
    user_name = models.CharField(max_length=50)
    user_email = models.CharField(max_length=50)
    user_password = models.CharField(max_length=255)
    user_photo = models.FileField(
        upload_to='Assets/UserPhoto/',
        null=True,
        blank=True
    )
    user_proof = models.FileField(
        upload_to='Assets/UserProof/',
        null=True,
        blank=True
    )
    user_address = models.CharField(max_length=200)
    user_dob = models.CharField(max_length=20)
    user_contact = models.CharField(
        max_length=15,
        blank=True,
        null=True)
    tententtype = models.ForeignKey(tbl_tenenttype, on_delete=models.CASCADE)
    user_status = models.CharField(
        max_length=20,
        default="Active"   # Active | Blocked | Inactive
    )


class tbl_place(models.Model):
    place_name=models.CharField(max_length=50)
    district=models.ForeignKey(tbl_district,on_delete=models.CASCADE)
class tbl_owner(models.Model):
    owner_name = models.CharField(max_length=100)
    owner_email = models.CharField(max_length=100)
    owner_password = models.CharField(max_length=255)
    owner_contact = models.CharField(max_length=15, blank=True, null=True)  # ✅ ADD THIS
    owner_address = models.TextField()
    owner_photo = models.ImageField(upload_to="owner_photo/", blank=True, null=True)
    owner_proof = models.ImageField(upload_to="owner_proof/", blank=True, null=True)
    owner_doj = models.DateField(blank=True, null=True)
   
    owner_status = models.CharField(
        max_length=20,
        default="Active"   # Active | Blocked | Inactive
    )

class tbl_house(models.Model):
    house_photo = models.FileField(upload_to='Assets/HousePhoto/')
    house_details = models.TextField()
    house_price = models.IntegerField()

    bhktype = models.ForeignKey('tbl_bhktype', on_delete=models.CASCADE)
    floortype = models.ForeignKey('tbl_floortype', on_delete=models.CASCADE)
    place = models.ForeignKey('tbl_place', on_delete=models.CASCADE)
    owner = models.ForeignKey('tbl_owner', on_delete=models.CASCADE)
    tenanttype = models.ForeignKey('tbl_tenenttype', on_delete=models.CASCADE)

    # ✅ CORRECT FLOAT FIELDS
    house_langtitude = models.FloatField(null=True, blank=True)
    house_longtitude = models.FloatField(null=True, blank=True)

    house_status = models.CharField(
        max_length=20,
        default="Active"
    )

    def __str__(self):
        return f"{self.bhktype} - {self.place}"
class tbl_userfloortype(models.Model):
    floortype_id=models.ForeignKey(tbl_floortype,on_delete=models.CASCADE)
    user_id=models.ForeignKey(tbl_user,on_delete=models.CASCADE)
class tbl_userbhktype(models.Model):
    bhktype_id=models.ForeignKey(tbl_bhktype,on_delete=models.CASCADE)
    user_id=models.ForeignKey(tbl_user,on_delete=models.CASCADE)
class tbl_gallery(models.Model):
    house_id=models.ForeignKey(tbl_house,on_delete=models.CASCADE)
    gallery_file=models.FileField(upload_to='Assets/Gallery/')
class tbl_favorite(models.Model):
    user_id=models.ForeignKey(tbl_user,on_delete=models.CASCADE)
    house_id=models.ForeignKey(tbl_house,on_delete=models.CASCADE)
class tbl_requested(models.Model):
    user_id=models.ForeignKey(tbl_user,on_delete=models.CASCADE)
    house_id=models.ForeignKey(tbl_house,on_delete=models.CASCADE)
    requested_details=models.CharField(max_length=200)
    requested_reply=models.CharField(max_length=200)
    requested_status=models.CharField(max_length=20)
    requested_amount=models.IntegerField()
    advance_status=models.CharField(max_length=20, default="Not Paid")
    requested_date=models.DateTimeField(auto_now_add=True)  # ✅ ADD THIS
class tbl_complaint(models.Model):
    user_id=models.ForeignKey(tbl_user,on_delete=models.CASCADE)
    complaint_title=models.CharField(max_length=100)
    complaint_details=models.CharField(max_length=200)
    complaint_reply=models.CharField(max_length=200)
    complaint_status=models.CharField(max_length=20)
class tbl_feedback(models.Model):
    user_id=models.ForeignKey(tbl_user,on_delete=models.CASCADE)
    feedback_details=models.CharField(max_length=200)
class Chat(models.Model):
    request_id = models.IntegerField(null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    sender = models.CharField(max_length=20)
    sender_id = models.IntegerField()
    file = models.FileField(upload_to="chat_files/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)
class tbl_owner_complaint(models.Model):
    owner_id = models.ForeignKey(tbl_owner, on_delete=models.CASCADE)
    complaint_title = models.CharField(max_length=100)
    complaint_details = models.CharField(max_length=200)
    complaint_reply = models.CharField(max_length=200, default="")
    complaint_status = models.CharField(max_length=20, default="Pending")