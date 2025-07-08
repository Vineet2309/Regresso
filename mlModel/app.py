from flask import Flask, send_file, jsonify
import json

app = Flask(__name__)

@app.route('/get-output')
def get_output():
    with open('regresso_output.json') as f:
        result = json.load(f)
    return jsonify(result)

@app.route('/get-graph')
def get_graph():
    return send_file('regresso_graph.png', mimetype='image/png')

@app.route('/get-pie')
def get_pie():
    return send_file('regresso_pie_chart.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
