from helper import execute_request

def test_register():
    # test the register endpoint
    path = "register-new-user"
    method = "POST"
    data = {
        "username": "Nutzer1",
        "password": "Helo1$fgd",
        "email": "test@web.de",
        "firstname": "NutzerH",
    }
    
    execute_request(path, method, data)
    
test_register()