import requests


URL = "http://localhost:8080/"

def execute_request(path, method, data):
    url = URL + path
    
    # execute the different HTTP methods
    # and return the response
    if method == "GET":
        response = requests.get(url)
    elif method == "POST":
        response = requests.post(url, json=data)
    elif method == "PUT":
        response = requests.put(url, json=data)
    elif method == "DELETE":
        response = requests.delete(url)
    else:
        print("ensupported HTTP method")
        raise ValueError("Unsupported HTTP method")

    # check if the response is successful
    if response:
        print(f"sending {method} request to {url}")
        print_answer(response)
        


def print_answer(response):
    # print the response status code
    print(f"status Code: {response.status_code}")

    # print the response headers
    # if json can be parsed
    try:
        data = response.json()
        print("response JSON:")
        print(data)

    except Exception as e:
        print("failed to parse JSON:", str(e))
        print("raw response text:")
        print(response.text)