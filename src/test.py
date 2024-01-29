import http.client

conn = http.client.HTTPSConnection("lionfish-wired-fairly.ngrok-free.app")
payload = ''
headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5IiwiZXhwIjoxNzA0MjA2MjUxfQ.pobftQjCmm4W0bMj7zuc1cY9KDfGuB4vZbhofUfTP_sBQR-uxC4XyvDxN9MhP6SaOAnVuSAew5KdFDV24QIx4g'
}
conn.request("GET", "/api/getprofile", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))