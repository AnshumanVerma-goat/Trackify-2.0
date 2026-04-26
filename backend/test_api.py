from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    # 1. Test Signup
    print("--- Testing /auth/signup ---")
    signup_res = client.post("/auth/signup", json={"email": "test_ai_user@example.com", "password": "securepassword"})
    if signup_res.status_code == 200:
        print("Signup: SUCCESS")
    elif signup_res.status_code == 400 and "already registered" in signup_res.text:
        print("Signup: User already exists, proceeding to login.")
    else:
        print("Signup: FAILED", signup_res.text)
        return

    # 2. Test Login
    print("\n--- Testing /auth/login ---")
    login_res = client.post("/auth/login", json={"email": "test_ai_user@example.com", "password": "securepassword"})
    if login_res.status_code == 200:
        token = login_res.json().get("access_token")
        print("Login: SUCCESS")
    else:
        print("Login: FAILED", login_res.text)
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Test AI Chat
    print("\n--- Testing /ai/chat ---")
    chat_res = client.post("/ai/chat", json={"message": "Please just reply exactly with 'API IS WORKING'."}, headers=headers)
    if chat_res.status_code == 200:
        print("AI Chat: SUCCESS")
        print("Response payload:", chat_res.json())
    else:
        print("AI Chat: FAILED", chat_res.text)

if __name__ == "__main__":
    run_tests()
