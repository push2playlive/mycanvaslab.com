# COMMANDNEXUS GATEKEEPER ENGINE v1.0 (2026 Build)
# Integration: Firebase Auth + Firestore + Stripe/Crypto API

import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import aiplatform

# Initialize the Nexus Core Database
db = firestore.client()

def register_member(user_id, email, path_selection):
    """
    path_selection: 'PAY_ACCESS' or 'LEARN_EARN'
    """
    user_ref = db.collection('members').document(user_id)
    
    # Define the starting profile
    profile = {
        "email": email,
        "identity_verified": True,
        "nexus_status": "ACTIVE",
        "current_badge": "WHITE",  # Default starting badge
        "path": path_selection,
        "credits_earned": 0.0,
        "affiliate_referrals": 0
    }

    if path_selection == 'PAY_ACCESS':
        # Trigger Stripe/Crypto Checkout Session
        redirect_url = initiate_secure_payment(user_id)
        return {"action": "REDIRECT", "url": redirect_url, "message": "Awaiting Tier Payment"}

    elif path_selection == 'LEARN_EARN':
        # Assign to Aura AI Training Sandbox
        profile["current_badge"] = "GREEN" # Aura Learner status
        user_ref.set(profile)
        return {"action": "DASHBOARD", "message": "Welcome, Learner. Aura AI is ready."}

def check_live_access(user_id, stream_type):
    """
    Verifies if member can see the 'Windowless' Private Live
    stream_type: 'PUBLIC' or 'PRIVATE'
    """
    user_data = db.collection('members').document(user_id).get().to_dict()
    badge = user_data.get('current_badge')

    # Access Control Logic
    if stream_type == 'PRIVATE':
        if badge in ['CYAN', 'PURPLE']:
            return {"access": "GRANTED", "key": "SECURE_HLS_KEY_2026"}
        else:
            return {"access": "DENIED", "message": "Upgrade to Cyan/Purple for Private Access"}
    return {"access": "GRANTED", "key": "PUBLIC_YOUTUBE_KEY"}

# -- END OF MASTER LOGIC --
