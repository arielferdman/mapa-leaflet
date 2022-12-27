from flask import session, redirect, url_for, request

secret_key = 'b11e07dff72963b799e0904f6e2e3e744684cc8e2aeece64a23636f759de58b7'

@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('static', filename='index.html')))
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))