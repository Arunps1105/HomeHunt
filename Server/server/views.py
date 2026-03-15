from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from server.models import *
import json
import requests
from django.db.models import Q
from django.contrib.auth.hashers import make_password, check_password



# 1
# ---------- DISTRICT ----------
@csrf_exempt
def District(request):
    if request.method == 'POST':
        tbl_district.objects.create(district_name=request.POST['district_name'])
    data = list(tbl_district.objects.values())
    return JsonResponse({'data': data})
@csrf_exempt
def DistrictDelete(request, district_id):
    if request.method == 'DELETE':
        tbl_district.objects.get(id=district_id).delete()
    data = list(tbl_district.objects.values())
    return JsonResponse({'data': data})
# 2 
#   

#  3
 
@csrf_exempt
def Admin(request):
    if request.method =='POST':
        tbl_admin.objects.create(admin_name=request.POST['admin_name'],admin_email=request.POST['admin_email'],admin_password=request.POST['admin_password'])
        data =list(tbl_admin.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def AdminDelete(request, admin_id):
    if request.method == 'DELETE':
        tbl_admin.objects.get(id=admin_id).delete()
    data = list(tbl_admin.objects.values())
    return JsonResponse({'data': data})
#  4
@csrf_exempt
def Bhktype(request):
    if request.method == 'POST':
        tbl_bhktype.objects.create(bhktype_name=request.POST['bhktype_name'])
        
    data = list(tbl_bhktype.objects.values())
    return JsonResponse({'data': data})
@csrf_exempt
def BhktypeDelete(request, bhktype_id):
    if request.method == 'DELETE':
        tbl_bhktype.objects.get(id=bhktype_id).delete()
    data = list(tbl_bhktype.objects.values())
    return JsonResponse({'data': data})
# 5
@csrf_exempt
def Floortype(request):
    if request.method == 'POST':
        tbl_floortype.objects.create(floortype_name=request.POST['floortype_name'])
    data = list(tbl_floortype.objects.values())
    return JsonResponse({'data': data})
@csrf_exempt
def FloortypeDelete(request, floortype_id):
    if request.method == 'DELETE':
        tbl_floortype.objects.get(id=floortype_id).delete()
    data = list(tbl_floortype.objects.values())
    return JsonResponse({'data': data})
# 6
@csrf_exempt
def Tenenttype(request):
    if request.method == 'POST':
        tbl_tenenttype.objects.create(tenanttype_name=request.POST['tenanttype_name'])
    data = list(tbl_tenenttype.objects.values())
    return JsonResponse({'data': data})
@csrf_exempt
def TenenttypeDelete(request, tenanttype_id):
    if request.method == 'DELETE':
        tbl_tenenttype.objects.get(id=tenanttype_id).delete()
    data = list(tbl_tenenttype.objects.values())
    return JsonResponse({'data': data})
# 7

@csrf_exempt
def User(request):
    if request.method == 'POST':
        tbl_user.objects.create(
    user_name=request.POST['user_name'],
    user_email=request.POST['user_email'],
    user_password=make_password(request.POST['user_password']),  # 🔐 HASHED
    user_address=request.POST['user_address'],
    user_dob=request.POST['user_dob'],
    user_contact=request.POST.get('user_contact', ''),
    tententtype=tbl_tenenttype.objects.get(id=request.POST.get('tenenttype_id')),
    user_photo=request.FILES.get('user_photo'),
    user_proof=request.FILES.get('user_proof'),
    user_status=request.POST.get('user_status', 'Active')
         )
    data = list(tbl_user.objects.values())
    return JsonResponse({'data': data}) 

@csrf_exempt
def UserDelete(request, user_id):
    if request.method == 'DELETE':
        tbl_user.objects.get(id=user_id).delete()
    data = list(tbl_user.objects.values())
    return JsonResponse({'data': data})
# 8
@csrf_exempt
def Place(request):

    district_id = request.GET.get("district_id")

    qs = tbl_place.objects.all()

    if district_id and district_id.isdigit():
        qs = qs.filter(district_id=int(district_id))

    data = qs.values(
        "id",
        "place_name",
        "district_id"
    )

    return JsonResponse({"data": list(data)})
@csrf_exempt
def PlaceDelete(request, place_id):
    if request.method == 'DELETE':
        tbl_place.objects.get(id=place_id).delete()
    data = list(tbl_place.objects.values())
    return JsonResponse({'data': data})
# 9
@csrf_exempt
def Requested(request):

    # ---------- CREATE ----------
    if request.method == 'POST':
        tbl_requested.objects.create(
            requested_details=request.POST['requested_details'],
            requested_reply="",
            requested_status="Pending",
            requested_amount=int(request.POST['requested_amount']),
            advance_status="Not Paid",
            user_id=tbl_user.objects.get(id=request.POST['user_id']),
            house_id=tbl_house.objects.get(id=request.POST['house_id'])
        )

    # ---------- FILTERS ----------
    user_id  = request.GET.get("user_id")
    owner_id = request.GET.get("owner_id")
    house_id = request.GET.get("house_id")
    advance_status = request.GET.get("advance_status")
    request_id = request.GET.get("request_id")

    qs = tbl_requested.objects.select_related(
        'user_id',
        'user_id__tententtype',
        'house_id',
        'house_id__owner'
    )

    # ⭐ IMPORTANT FOR CHAT
    if request_id:
        qs = qs.filter(id=request_id)

    if user_id:
        qs = qs.filter(user_id_id=user_id)

    if owner_id:
        qs = qs.filter(house_id__owner_id=owner_id)

    if house_id:
        qs = qs.filter(house_id_id=house_id)

    if advance_status:
        qs = qs.filter(advance_status=advance_status)

    data = qs.values(
        'id',
        'requested_details',
        'requested_reply',
        'requested_status',
        'requested_amount',
        'advance_status',
        'requested_date', 

        'user_id__user_name',
        'user_id__user_contact',
        'user_id__user_address',
        'user_id__user_photo',
        'user_id__user_proof',
        'user_id__tententtype__tenanttype_name',

        'house_id__owner__owner_name',
        'house_id__owner__owner_photo',

        'house_id__id',
        'house_id__house_details',
        'house_id__house_photo',
        'house_id__house_price',
        'house_id__place__place_name'
    )

    return JsonResponse({'data': list(data)})



@csrf_exempt
def RequestedDelete(request, requested_id):
    if request.method == 'DELETE':
        tbl_requested.objects.get(id=requested_id).delete()
    data = list(tbl_requested.objects.values())
    return JsonResponse({'data': data})
# 10
@csrf_exempt
def Fav(request):
    if request.method == 'POST':
        try:
            tbl_favorite.objects.create(
                house_id=tbl_house.objects.get(id=request.POST['house_id']),
                user_id=tbl_user.objects.get(id=request.POST['user_id'])
            )
        except tbl_house.DoesNotExist:
            return JsonResponse({'error': 'House not found'}, status=404)
        except tbl_user.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # ✅ FILTER BY user_id on backend instead of sending all records
    user_id = request.GET.get('user_id')

    qs = tbl_favorite.objects.select_related('house_id', 'user_id')

    if user_id:
        qs = qs.filter(user_id_id=user_id)
    else:
        qs = qs.none()  # ✅ never return ALL favourites of all users

    data = qs.values(
        'id',
        'house_id_id',
        'user_id_id'
    )

    return JsonResponse({'data': list(data)})
@csrf_exempt
def FavDelete(request, favorite_id):
    if request.method == 'DELETE':
        try:
            tbl_favorite.objects.get(id=favorite_id).delete()
            return JsonResponse({'message': 'Removed from favourites'})
        except tbl_favorite.DoesNotExist:
            return JsonResponse({'error': 'Favourite not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
# 11
@csrf_exempt
def complaint(request):
    if request.method == 'POST':
        tbl_complaint.objects.create(
    user_id=tbl_user.objects.get(id=request.POST['user_id']),
    complaint_title=request.POST['complaint_title'],
    complaint_details=request.POST['complaint_details'],
    complaint_reply="",
    complaint_status="Pending"
)

    # 🔐 BACKEND FILTERING
    user_id = request.GET.get("user_id")

    qs = tbl_complaint.objects.select_related('user_id')

    # If user_id is provided → USER view
    if user_id:
        qs = qs.filter(user_id_id=user_id)

    data = qs.values(
        'id',
        'complaint_title',
        'complaint_details',
        'complaint_reply',
        'complaint_status',
        'user_id_id'
    )

    return JsonResponse({'data': list(data)})
@csrf_exempt
def ComplaintDelete(request, complaint_id):
    if request.method == 'DELETE':
        tbl_complaint.objects.get(id=complaint_id).delete()
    data = list(tbl_complaint.objects.values())
    return JsonResponse({'data': data})
@csrf_exempt
def ComplaintReply(request, complaint_id):
    if request.method == "POST":
        body = json.loads(request.body)

        complaint = tbl_complaint.objects.get(id=complaint_id)
        complaint.complaint_reply = body.get("complaint_reply")
        complaint.complaint_status = "Completed"
        complaint.save()

        return JsonResponse({"message": "Reply sent successfully"})

 
 
@csrf_exempt
def UserGallery(request):
    if request.method == 'POST':
        house_id = request.POST.get('house_id')
        if not house_id:
            return JsonResponse(
                {"error": "house_id is required"},
                status=400
            )

        # -------- HOUSE DETAILS --------
        house = tbl_house.objects.select_related(
            'bhktype',
            'floortype',
            'tenanttype',
            'place'
        ).filter(id=house_id).values(
            'id',
            'house_photo',
            'house_details',
            'house_price',
            'bhktype__bhktype_name',
            'floortype__floortype_name',
            'tenanttype__tenanttype_name',
            'place__place_name'
        ).first()

        if not house:
            return JsonResponse(
                {"error": "House not found"},
                status=404
            )

        # -------- GALLERY --------
        gallery = list(
            tbl_gallery.objects.filter(house_id=house_id).values(
                'id',
                'gallery_file'
            )
        )

        return JsonResponse({
            "house": house,
            "gallery": gallery
        })

    # DEFAULT RESPONSE (like Place)
    return JsonResponse({"message": "Invalid request"})

 
@csrf_exempt
def Gallery(request):

    # ---------- CREATE ----------
    if request.method == 'POST':
        house_id = request.POST.get("house_id")
        owner_id = request.POST.get("owner_id")

        # 🔐 SECURITY CHECK
        house = tbl_house.objects.filter(
            id=house_id,
            owner_id=owner_id
        ).first()

        if not house:
            return JsonResponse(
                {"message": "Unauthorized"},
                status=403
            )

        tbl_gallery.objects.create(
            gallery_file=request.FILES['gallery_file'],
            house_id=house
        )

    # ---------- READ (FILTER BY OWNER + HOUSE) ----------
    house_id = request.GET.get("house_id")
    owner_id = request.GET.get("owner_id")

    qs = tbl_gallery.objects.select_related(
        "house_id",
        "house_id__owner"
    )

    # 🔐 CRITICAL FILTER
    if house_id and owner_id:
        qs = qs.filter(
            house_id_id=house_id,
            house_id__owner_id=owner_id
        )
    else:
        qs = qs.none()  # security fallback

    data = qs.values(
        "id",
        "gallery_file",
        "house_id_id"
    )

    return JsonResponse({"data": list(data)})

 


@csrf_exempt
def Owner(request):
    if request.method == 'POST':
        tbl_owner.objects.create(
    owner_name=request.POST['owner_name'],
    owner_email=request.POST['owner_email'],
    owner_password=make_password(request.POST['owner_password']),  # 🔐 HASHED
    owner_contact=request.POST.get('owner_contact', ''),
    owner_address=request.POST['owner_address'],
    owner_photo=request.FILES.get('owner_photo'),
    owner_proof=request.FILES.get('owner_proof')
     )
    data = list(tbl_owner.objects.values())
    return JsonResponse({'data': data})
 


@csrf_exempt
def UserBhktype(request):
    if request.method == 'POST':
        try:
            tbl_userbhktype.objects.create(
                bhktype_id=tbl_bhktype.objects.get(id=request.POST['bhktype_id']),
                user_id=tbl_user.objects.get(id=request.POST['user_id'])
            )
        except tbl_user.DoesNotExist:
            return JsonResponse({'error': 'User not found — please logout and login again'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    user_id = request.GET.get('user_id')
    data = tbl_userbhktype.objects.filter(
        user_id=user_id
    ).select_related('bhktype_id').values(
        'id',
        'bhktype_id__bhktype_name'
    )
    return JsonResponse({'data': list(data)})




@csrf_exempt
def UserFloortype(request):
    if request.method == 'POST':
        tbl_userfloortype.objects.create(
            floortype_id=tbl_floortype.objects.get(id=request.POST['floortype_id']),
            user_id=tbl_user.objects.get(id=request.POST['user_id'])
        )

    user_id = request.GET.get('user_id')

    data = tbl_userfloortype.objects.filter(
        user_id=user_id
    ).select_related('floortype_id').values(
        'id',
        'floortype_id',                # ✅ ADD THIS
        'floortype_id__floortype_name'
    )

    return JsonResponse({'data': list(data)})

@csrf_exempt
def UserFloortypeDelete(request, userfloortype_id):

    if request.method == "DELETE":

        try:
            tbl_userfloortype.objects.get(id=userfloortype_id).delete()
            return JsonResponse({"message": "Deleted successfully"})
        except tbl_userfloortype.DoesNotExist:
            return JsonResponse({"error": "Preference not found"}, status=404)

    return JsonResponse({"error": "Invalid request"}, status=400)



    
@csrf_exempt
def OwnerProfile(request, owner_id):
    if request.method == 'GET':
        owner = tbl_owner.objects.filter(id=owner_id).values(
            'id',
            'owner_name',
            'owner_email',
            'owner_contact',
            'owner_address',
            'owner_photo',
            'owner_proof',
            'owner_doj',
            'owner_status'
        )
        return JsonResponse({'data': list(owner)})
    else:
        return JsonResponse({'message': 'Owner not found'}, status=404)



@csrf_exempt
def UserPassword(request, uid):
    if request.method == 'PUT':
        body = json.loads(request.body)
        old = body.get('old_password')
        new = body.get('new_password')

        user = tbl_user.objects.filter(id=uid).first()

        if not user or not check_password(old, user.user_password):
            return JsonResponse({'message': 'Old password is incorrect'})

        user.user_password = make_password(new)
        user.save()
        return JsonResponse({'message': 'Password changed successfully'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def OwnerPassword(request, oid):
    if request.method == 'PUT':
        body = json.loads(request.body)
        old = body.get('old_password')
        new = body.get('new_password')

        owner = tbl_owner.objects.filter(id=oid).first()

        if not owner or not check_password(old, owner.owner_password):
            return JsonResponse({'message': 'Old password is incorrect'})

        owner.owner_password = make_password(new)
        owner.save()
        return JsonResponse({'message': 'Password changed successfully'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def OwnerRequestUpdate(request, request_id):
    if request.method == 'POST':
        body = json.loads(request.body)

        req = tbl_requested.objects.get(id=request_id)
        req.requested_status = body.get("requested_status")
        req.requested_reply = body.get("requested_reply", "")
        req.requested_amount = body.get("requested_amount")
        req.save()

        return JsonResponse({"message": "Request updated successfully"})
 





@csrf_exempt
def GalleryDelete(request, gallery_id):
    if request.method == 'DELETE':
        tbl_gallery.objects.get(id=gallery_id).delete()
    data = list(tbl_gallery.objects.values())
    return JsonResponse({'data': data})
@csrf_exempt
def House(request):

    # ================= CREATE =================
    if request.method == 'POST':

        place_obj = tbl_place.objects.get(id=request.POST['place_id'])

        location_name = f"{place_obj.place_name}, Kerala, India"

        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": location_name, "format": "json"},
            headers={"User-Agent": "house-rental-app"}
        )

        data = response.json()
        lat = float(data[0]["lat"]) if data else None
        lon = float(data[0]["lon"]) if data else None

        tbl_house.objects.create(
            house_photo=request.FILES.get('house_photo'),
            house_details=request.POST['house_details'],
            house_price=int(request.POST['house_price']),
            bhktype=tbl_bhktype.objects.get(id=request.POST['bhktype_id']),
            floortype=tbl_floortype.objects.get(id=request.POST['floortype_id']),
            place=place_obj,
            owner=tbl_owner.objects.get(id=request.POST['owner_id']),
            tenanttype=tbl_tenenttype.objects.get(id=request.POST['tenanttype_id']),
            house_langtitude=lat,
            house_longtitude=lon,
            house_status="Active"
        )

        return JsonResponse({"message": "House created successfully"})


    # ================= READ =================

    owner_id = request.GET.get("owner_id")
    district_id = request.GET.get("district_id")
    place_id = request.GET.get("place_id")
    bhktype_id = request.GET.get("bhktype_id")
    floortype_id = request.GET.get("floortype_id")
    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")
    sort = request.GET.get("sort")

    qs = tbl_house.objects.select_related(
        'bhktype',
        'floortype',
        'tenanttype',
        'place',
        'place__district',
        'owner'
    )

    # 🔐 OWNER VIEW
    if owner_id and owner_id.isdigit():
        qs = qs.filter(owner_id=int(owner_id))

    else:
        # PUBLIC VIEW (only active houses)
        qs = qs.filter(house_status="Active")

    if district_id and district_id.isdigit():
        qs = qs.filter(place__district_id=int(district_id))

    if place_id and place_id.isdigit():
        qs = qs.filter(place_id=int(place_id))

    if bhktype_id and bhktype_id.isdigit():
        qs = qs.filter(bhktype_id=int(bhktype_id))

    if floortype_id and floortype_id.isdigit():
        qs = qs.filter(floortype_id=int(floortype_id))

    if min_price and min_price.isdigit():
        qs = qs.filter(house_price__gte=int(min_price))

    if max_price and max_price.isdigit():
        qs = qs.filter(house_price__lte=int(max_price))

    if sort == "low":
        qs = qs.order_by("house_price")
    elif sort == "high":
        qs = qs.order_by("-house_price")

    data = qs.values(
        'id',
        'house_photo',
        'house_details',
        'house_price',
        'house_status',
        'bhktype__bhktype_name',
        'floortype__floortype_name',
        'tenanttype__tenanttype_name',
        'place__place_name',
        'place__district__district_name',
        'house_langtitude',
        'house_longtitude'
    )

    return JsonResponse({'data': list(data)})
@csrf_exempt
def HouseUpdate(request, house_id):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    owner_id = request.POST.get("owner_id")

    house = tbl_house.objects.filter(
        id=house_id,
        owner_id=owner_id
    ).first()

    if not house:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    house.house_details = request.POST.get("house_details", house.house_details)
    house.house_price = request.POST.get("house_price", house.house_price)

    if request.POST.get("bhktype_id"):
        house.bhktype = tbl_bhktype.objects.get(id=request.POST["bhktype_id"])

    if request.POST.get("floortype_id"):
        house.floortype = tbl_floortype.objects.get(id=request.POST["floortype_id"])

    if request.POST.get("place_id"):
        house.place = tbl_place.objects.get(id=request.POST["place_id"])

    if request.POST.get("tenanttype_id"):
        house.tenanttype = tbl_tenenttype.objects.get(id=request.POST["tenanttype_id"])

    if request.FILES.get("house_photo"):
        house.house_photo = request.FILES["house_photo"]

    house.save()

    return JsonResponse({"message": "House updated successfully"})
@csrf_exempt
def HouseStatusUpdate(request, house_id):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)
    owner_id = body.get("owner_id")
    status = body.get("house_status")

    if status not in ["Active", "Inactive"]:
        return JsonResponse({"error": "Invalid status"}, status=400)

    house = tbl_house.objects.filter(
        id=house_id,
        owner_id=owner_id
    ).first()

    if not house:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    house.house_status = status
    house.save()

    return JsonResponse({"message": "House status updated"})


@csrf_exempt
def Login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    body = json.loads(request.body)
    email = body.get('email')
    password = body.get('password')

    # ---- USER LOGIN ----
    user = tbl_user.objects.filter(user_email=email).first()
    if user and not check_password(password, user.user_password):
        user = None

    if user:
        if user.user_status != "Active":
            return JsonResponse(
                {"message": "Your account is blocked. Contact admin."},
                status=403
            )
        return JsonResponse({
            'role': 'user',
            'id': user.id,
            'name': user.user_name,
            'message': 'Login successful'
        })

    # ---- ADMIN LOGIN ----
    admin = tbl_admin.objects.filter(admin_email=email).first()
    if admin and admin.admin_password != password:
        admin = None

    if admin:
        return JsonResponse({
            'role': 'admin',
            'id': admin.id,
            'name': 'Admin',
            'message': 'Login successful'
        })

    # ---- OWNER LOGIN ----
    owner = tbl_owner.objects.filter(owner_email=email).first()
    if owner and not check_password(password, owner.owner_password):
        owner = None

    if owner:
        if owner.owner_status != "Active":
            return JsonResponse(
                {"message": "Your owner account is blocked. Contact admin."},
                status=403
            )
        return JsonResponse({
            'role': 'owner',
            'id': owner.id,
            'name': owner.owner_name,
            'message': 'Login successful'
        })

    return JsonResponse(
        {'message': 'Invalid email or password'},
        status=401
    )


@csrf_exempt
def OwnerDelete(request, owner_id):
    if request.method == 'DELETE':
        tbl_owner.objects.get(id=owner_id).delete()
    data = list(tbl_owner.objects.values())
    return JsonResponse({'data': data})




@csrf_exempt
def UserBhktypeDelete(request, userbhktype_id):

    if request.method == "DELETE":

        try:
            tbl_userbhktype.objects.get(id=userbhktype_id).delete()
            return JsonResponse({"message": "Deleted successfully"})
        except tbl_userbhktype.DoesNotExist:
            return JsonResponse({"error": "Preference not found"}, status=404)

    return JsonResponse({"error": "Invalid request"}, status=400)

 


@csrf_exempt
def Userprofile(request, id):
    if request.method == 'GET':
        user = tbl_user.objects.filter(id=id).values(
            'id',
            'user_name',
            'user_email',
            'user_address',
            'user_dob',
            'user_contact',
            'tententtype_id',
            'user_photo'
        )
        return JsonResponse({'data': list(user)})
    else:
        return JsonResponse({'message': 'User not found'}, status=404)
    

@csrf_exempt
def editUserProfile(request, user_id):
    if request.method == 'POST':
        user = tbl_user.objects.get(id=user_id)
        user.user_name = request.POST['user_name']
        user.user_email = request.POST['user_email']
        user.user_address = request.POST['user_address']
        user.user_contact = request.POST.get('user_contact', '')
        user.save()

        return JsonResponse({'message': 'User profile updated successfully'})

@csrf_exempt
def editOwnerProfile(request, owner_id):
    if request.method == 'POST':
        owner = tbl_owner.objects.get(id=owner_id)
        owner.owner_name = request.POST['owner_name']
        owner.owner_email = request.POST['owner_email']
        owner.owner_contact = request.POST.get('owner_contact', '')
        owner.owner_address = request.POST['owner_address']
        owner.save()
        return JsonResponse({'message': 'Owner profile updated successfully'})
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
 

@csrf_exempt
def Feedback(request):
    if request.method == 'POST':
        tbl_feedback.objects.create(
            user_id=tbl_user.objects.get(id=request.POST['user_id']),
            feedback_details=request.POST['feedback_details']
        )

    user_id = request.GET.get("user_id")

    qs = tbl_feedback.objects.select_related("user_id")

    # USER → only own feedback
    if user_id:
        qs = qs.filter(user_id_id=user_id)

    data = qs.values(
        "id",
        "feedback_details",
        "user_id__user_name"   # ✅ USER NAME
    )

    return JsonResponse({"data": list(data)})
@csrf_exempt
def AdminUserList(request):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    qs = tbl_user.objects.select_related("tententtype")

    status = request.GET.get("status")

    if status:
        qs = qs.filter(user_status__iexact=status.strip())

    qs = qs.order_by("-id")

    data = qs.values(
        "id",
        "user_name",
        "user_email",
        "user_contact",
        "user_status",
        "tententtype__tenanttype_name"
    )

    return JsonResponse({"data": list(data)})
@csrf_exempt
def AdminUserStatusUpdate(request, user_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)
    status = body.get("user_status")

    if status not in ["Active", "Blocked", "Inactive"]:
        return JsonResponse({"error": "Invalid status"}, status=400)

    user = tbl_user.objects.get(id=user_id)
    user.user_status = status
    user.save()

    return JsonResponse({"message": "User status updated successfully"})
@csrf_exempt
def AdminDashboardStats(request):
    if request.method == "GET":
        data = {
            "total_users": tbl_user.objects.count(),
            "total_owners": tbl_owner.objects.count(),
            "total_houses": tbl_house.objects.count(),
            "pending_requests": tbl_requested.objects.filter(requested_status="Pending").count(),
            "pending_complaints": tbl_complaint.objects.filter(complaint_status="Pending").count(),
            "active_houses": tbl_house.objects.filter(house_status="Active").count(),
            "booked_houses": tbl_requested.objects.filter(requested_status="Approved").count(),
            "total_feedback": tbl_feedback.objects.count(),
        }
        return JsonResponse(data)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def AdminOwnerList(request):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    qs = tbl_owner.objects.all()

    status = request.GET.get("status")

    if status:
        qs = qs.filter(owner_status__iexact=status.strip())

    qs = qs.order_by("-id")

    data = qs.values(
        "id",
        "owner_name",
        "owner_email",
        "owner_contact",
        "owner_status"
    )

    return JsonResponse({"data": list(data)})
@csrf_exempt
def AdminOwnerStatusUpdate(request, owner_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)
    status = body.get("owner_status")

    if status not in ["Active", "Blocked", "Inactive"]:
        return JsonResponse({"error": "Invalid status"}, status=400)

    owner = tbl_owner.objects.get(id=owner_id)
    owner.owner_status = status
    owner.save()

    return JsonResponse({"message": "Owner status updated successfully"})
@csrf_exempt
def FixOldHouses(request):

    houses = tbl_house.objects.all()

    for house in houses:

        # 🔥 FIX EMPTY STRING OR NONE
        if not house.house_langtitude or not house.house_longtitude:

            location_name = f"{house.place.place_name}, Kerala, India"

            response = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": location_name,
                    "format": "json"
                },
                headers={
                    "User-Agent": "house-rental-app"
                }
            )

            data = response.json()

            if data:
                house.house_langtitude = float(data[0]["lat"])
                house.house_longtitude = float(data[0]["lon"])
                house.save()

    return JsonResponse({"message": "Old houses fixed successfully"})
@csrf_exempt
def AdvancePaymentUpdate(request, request_id):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    req = tbl_requested.objects.filter(id=request_id).first()

    if not req:
        return JsonResponse({"error": "Request not found"}, status=404)

    req.advance_status = "Paid"
    req.save()

    return JsonResponse({
        "message": "Advance payment updated"
    })
@csrf_exempt
def ChatHistory(request):

    request_id = request.GET.get("request_id")

    messages = Chat.objects.filter(
        request_id=request_id
    ).order_by("created_at").values(
        "id",
        "message",
        "sender",
        "sender_id",
        "file",
        "created_at",
        "is_seen"
    )

    return JsonResponse({"data": list(messages)})
@csrf_exempt
def OwnerChats(request):

    owner_id = request.GET.get("owner_id")

    requests = (
        tbl_requested.objects
        .filter(house_id__owner_id=owner_id)
        .values(
            "id",
            "user_id__user_name",
            "user_id__user_photo",
            "house_id__house_details",
            "house_id__house_photo"
        )
        .order_by("-id")
    )

    data = []

    for r in requests:

        last_msg = Chat.objects.filter(
            request_id=r["id"]
        ).order_by("-created_at").first()

        data.append({
            "id": r["id"],
            "user_name": r["user_id__user_name"],
            "user_photo": r["user_id__user_photo"],
            "house_details": r["house_id__house_details"],
            "house_photo": r["house_id__house_photo"],
            "last_message": last_msg.message if last_msg else "",
            "sender": last_msg.sender if last_msg else ""
        })

    return JsonResponse({"data": data})
@csrf_exempt
def DeleteChatMessage(request, message_id):
    if request.method == "DELETE":
        Chat.objects.filter(id=message_id).delete()
        return JsonResponse({"message": "Message deleted"})
    return JsonResponse({"error": "Method not allowed"}, status=405)
@csrf_exempt
def DeleteChatRequest(request, request_id):

    if request.method == "DELETE":

        tbl_requested.objects.filter(id=request_id).delete()

        return JsonResponse({"message": "Chat deleted"})
@csrf_exempt
def MarkSeen(request, request_id):

    Chat.objects.filter(
        request_id=request_id,
        is_seen=False
    ).update(is_seen=True)

    return JsonResponse({"message": "Messages marked as seen"})
@csrf_exempt
@csrf_exempt
def UploadChatFile(request):
    if request.method == "POST":
        file = request.FILES.get("file")
        request_id = request.POST.get("request_id")
        sender_id = request.POST.get("sender_id")
        sender = request.POST.get("sender")
        msg = Chat.objects.create(
            request_id=request_id,      # changed from request_id_id
            sender_id=sender_id,
            sender=sender,
            file=file,
            message=""
        )
        return JsonResponse({
            "message": "uploaded",
            "data": {
                "id": msg.id,
                "file": msg.file.name,
                "created_at": msg.created_at.isoformat(),
                "sender": msg.sender,
                "sender_id": msg.sender_id,
            }
        })
@csrf_exempt
def RecommendHouses(request):

    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"data": []})

    bhk_ids = list(
        tbl_userbhktype.objects.filter(user_id_id=user_id)
        .values_list("bhktype_id", flat=True)
    )

    floor_ids = list(
        tbl_userfloortype.objects.filter(user_id_id=user_id)
        .values_list("floortype_id", flat=True)
    )

    houses = tbl_house.objects.filter(
        house_status="Active"
    ).select_related(
        "bhktype",
        "floortype",
        "place",
        "place__district"
    )

    # PERFECT MATCH
    perfect = houses.filter(
        bhktype_id__in=bhk_ids,
        floortype_id__in=floor_ids
    )

    # BHK MATCH
    bhk_match = houses.filter(
        bhktype_id__in=bhk_ids
    ).exclude(id__in=perfect)

    # FLOOR MATCH
    floor_match = houses.filter(
        floortype_id__in=floor_ids
    ).exclude(id__in=perfect).exclude(id__in=bhk_match)

    # COMBINE RESULTS
    recommended = perfect | bhk_match | floor_match

    data = recommended.values(
        "id",
        "house_photo",
        "house_details",
        "house_price",
        "bhktype__bhktype_name",
        "floortype__floortype_name",
        "place__place_name",
        "place__district__district_name"
    )

    return JsonResponse({"data": list(data)})
@csrf_exempt
def OwnerComplaint(request):
    if request.method == 'POST':
        tbl_owner_complaint.objects.create(
            owner_id=tbl_owner.objects.get(id=request.POST['owner_id']),
            complaint_title=request.POST['complaint_title'],
            complaint_details=request.POST['complaint_details'],
            complaint_reply="",
            complaint_status="Pending"
        )

    owner_id = request.GET.get("owner_id")
    qs = tbl_owner_complaint.objects.select_related('owner_id')
    if owner_id:
        qs = qs.filter(owner_id_id=owner_id)

    data = qs.values(
        'id', 'complaint_title', 'complaint_details',
        'complaint_reply', 'complaint_status', 'owner_id_id'
    )
    return JsonResponse({'data': list(data)})



@csrf_exempt
def AdminComplaint(request):

    if request.method == "GET":
        complaints = tbl_owner_complaint.objects.all().values(
            "id",
            "complaint_title",
            "complaint_details",
            "complaint_reply",
            "complaint_status",
            "owner_id__owner_name"
        )
        return JsonResponse({"data": list(complaints)})

    if request.method == "POST":
        id = request.POST.get("id")
        reply = request.POST.get("reply")

        complaint = tbl_owner_complaint.objects.get(id=id)
        complaint.complaint_reply = reply
        complaint.complaint_status = "Completed"
        complaint.save()

        return JsonResponse({"msg": "Reply added"})
@csrf_exempt
def OwnerComplaintReply(request, id):

    complaint = tbl_owner_complaint.objects.get(id=id)

    if request.method == "POST":
        data = json.loads(request.body)

        complaint.complaint_reply = data["complaint_reply"]
        complaint.complaint_status = "Completed"
        complaint.save()

    return JsonResponse({"status": "success"})
import random
from django.core.mail import send_mail

otp_store = {}

@csrf_exempt
def SendOTP(request):

    body = json.loads(request.body)
    email = body.get("email")

    user = tbl_user.objects.filter(user_email=email).first()

    if not user:
        return JsonResponse({"message":"Email not registered"},status=404)

    otp = random.randint(1000,9999)

    otp_store[email] = otp

    send_mail(
        "HomeHunt Password Reset",
        f"Your OTP for password reset is {otp}",
        "homehunt56@gmail.com",
        [email],
        fail_silently=False
    )

    return JsonResponse({"message":"OTP sent"})
@csrf_exempt
def ResetPassword(request):

    body = json.loads(request.body)

    email = body.get("email")
    otp = body.get("otp")
    password = body.get("password")

    # check if OTP exists
    if email not in otp_store:
        return JsonResponse({"message": "OTP not generated"}, status=400)

    stored_otp = str(otp_store[email])

    if str(otp) != stored_otp:
        return JsonResponse({"message": "Invalid OTP"}, status=400)

    user = tbl_user.objects.filter(user_email=email).first()

    if not user:
        return JsonResponse({"message": "User not found"}, status=404)

    # prevent same password reuse
    if check_password(password, user.user_password):
        return JsonResponse({"message": "New password must be different from old password"}, status=400)

    user.user_password = make_password(password)
    user.save()

    del otp_store[email]

    return JsonResponse({"message": "Password updated successfully"})