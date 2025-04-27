from helper import execute_request

def test_register():
    # test the register endpoint
    path = "register-new-user"
    method = "POST"
    data = {
        "username": "testuser",
        "password": "testpassword",
        "email": "email@example.com",
        "firstname": "",
    }
    
    execute_request(path, method, data)
    
test_register()