from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    # Simple response logic
    if "hello" in user_message.lower():
        response = "Hello! I am your simple chat agent. How can I help you today?"
    elif "who are you" in user_message.lower():
        response = "I am a simple agent created to talk to you, hosted on Render."
    else:
        response = f"You said: {user_message}. That's interesting!"
    
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))