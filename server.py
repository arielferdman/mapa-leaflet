from pprint import pprint
from flask import Flask, Response, jsonify, make_response
import requests
import flask
import urllib.parse
 
app = Flask(__name__)
print(__name__)
@app.route('/')
@app.route("/search/<query>", methods=['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'])
def hello_world(query):
    if flask.request.method == 'OPTIONS':
        return Response(status=204, headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        })
    print(f'query: {query}\n')
    typ = type(query)
    print(f'type: {typ}\n')
    res = search_nominatim(query) 
    # response = Response(mimetype='application/json')
    # response.headers.add('Access-Control-Allow-Origin', '*')
    print(f'response: {res}')
    return make_response(jsonify(res), 200)
 
 
def search_nominatim(query):
    url = f'http://172.18.0.3:8080/search/{query}'
    payload = {
        'format': 'json',
    }
 
 
    payload_str = urllib.parse.urlencode(payload, safe=':+')
    r = requests.get(url, params=payload_str)
    print(r.text)
    res = r.json()[0]
    # import pdb; pdb.set_trace()
    return [res['lat'], res['lon']]
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
