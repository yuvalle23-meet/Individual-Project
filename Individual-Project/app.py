from flask import Flask, render_template, request, redirect, url_for, flash
from flask import session as login_session
import pyrebase
import timeit
import math

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'super-secret-key'

#Code goes below here

config = {

  "apiKey": "AIzaSyC7kl6RgkF8f-uL-a8yGEmB2dpEorlXYuE",

  "authDomain": "gaming-project-72069.firebaseapp.com",

  "projectId": "gaming-project-72069",

  "storageBucket": "gaming-project-72069.appspot.com",

  "messagingSenderId": "1046246209110",

  "appId": "1:1046246209110:web:3b42e8a45d306860992df7",

  "measurementId": "G-MGKLXYHD4T",

  "databaseURL": "https://gaming-project-72069-default-rtdb.europe-west1.firebasedatabase.app/"

}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()




@app.route('/', methods = ['GET', "POST"])
def signin():
    error = ""
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        try:
            login_session['user'] = auth.sign_in_with_email_and_password(email, password)
            start = timeit.default_timer()
            login_session['start'] = start
            return redirect(url_for('home'))
        except: 
            error = "  *Email or Password is Wrong"
    return render_template('signin.html', error = error)

@app.route('/signup', methods=['GET', 'POST'])
def signup():

    error = ''
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirmpassword']
        phonenum = request.form['phone']

        if password == confirm:
            try:
                login_session['user'] = auth.create_user_with_email_and_password(email, password)
                user = {"email": email, "password":password ,"phone" : phonenum, "coins":1000, "rank": "", "time_played" : 0}
                db.child("Users").child(login_session['user']['localId']).set(user)
                return redirect(url_for('signin'))
            except: 
               error = "  *Authentication failed"
        else:
            error = "  *Password Do Not Match"
            return render_template("signup.html", error = error)

    return render_template('signup.html', error = error)


@app.route('/home', methods = ["GET", "POST"])
def home():

    try:
        user = login_session['user']
        if "user" in login_session:
            
            if login_session['user'] != None:
                try:
                    rank = db.child('Users').child(login_session['user']['localId']).get().val()['rank']
                    coins = db.child('Users').child(login_session['user']['localId']).get().val()['coins']
                    coinspermin=25
                    if rank == "Cotton":
                        coinspermin = 50
                    if rank == "Intermediate":
                        coinspermin=100
                    if rank == "Pro":
                        coinspermin = 150
                    if rank == "Monke":
                        coinspermin=250

                    return render_template("index.html", button = False, coins = coins, rank = rank, coinspermin=coinspermin)
                except:
                    return render_template("index.html", button = False, coins = 0)
        return render_template("index.html", button = True, coins = 0)   
    except:
        return render_template("index.html", button = True, coins = 0)

@app.route('/coins', methods = ["GET", "POST"])
def coins():
    dictionary = db.child('Users').child(login_session["user"]["localId"]).get().val()
    dictionary['coins'] = int(request.form['coin'])
    db.child('Users').child(login_session['user']['localId']).update(dictionary)
    return redirect(url_for('home'))


@app.route('/signout', methods = ['GET', "POST"])
def signout():
    login_session['end'] = timeit.default_timer()
    updater = db.child('Users').child(login_session['user']["localId"]).get().val()
    updater['time_played'] += login_session['end'] - login_session['start']
    db.child('Users').child(login_session['user']["localId"]).update(updater)
    login_session['user'] = None
    auth.current_user = None

    return redirect(url_for("home", button = "Login"))

@app.route("/blackjack", methods = ["GET", "POST"])
def blackjack():
    return render_template("blackjack.html", coins = db.child('Users').child(login_session['user']['localId']).get().val()['coins'])

@app.route('/rankc', methods = ["GET", "POST"])
def rankc():
    if db.child('Users').child(login_session['user']["localId"]).get().val()['coins'] > 500 and db.child('Users').child(login_session['user']["localId"]).get().val()['rank']=="":
        updater = db.child('Users').child(login_session['user']["localId"]).get().val()
        updater['coins'] -= 500
        updater['rank'] = "Cotton"
        db.child('Users').child(login_session['user']["localId"]).update(updater)


        return redirect(url_for('home'))
    else:
        return redirect(url_for('home'))

@app.route('/ranki', methods = ["GET", "POST"])
def ranki():
    if db.child('Users').child(login_session['user']["localId"]).get().val()['coins'] > 1000 and db.child('Users').child(login_session['user']["localId"]).get().val()['rank']=="Cotton":
        updater = db.child('Users').child(login_session['user']["localId"]).get().val()
        updater['coins'] -= 1000
        updater['rank'] = "Intermediate"
        db.child('Users').child(login_session['user']["localId"]).update(updater)

        return redirect(url_for('home'))
    else:
        return redirect(url_for('home'))

@app.route('/rankp', methods = ["GET", "POST"])
def rankp():
    if db.child('Users').child(login_session['user']["localId"]).get().val()['coins'] > 2000 and db.child('Users').child(login_session['user']["localId"]).get().val()['rank']=="Intermediate":
        updater = db.child('Users').child(login_session['user']["localId"]).get().val()
        updater['coins'] -= 2000
        updater['rank'] = "Pro"
        db.child('Users').child(login_session['user']["localId"]).update(updater)

        return redirect(url_for('home'))
    else:
        return redirect(url_for('home'))

@app.route('/rankm', methods = ["GET", "POST"])
def rankm():
    if db.child('Users').child(login_session['user']["localId"]).get().val()['coins'] > 5000 and db.child('Users').child(login_session['user']["localId"]).get().val()['rank']=="Pro":
        updater = db.child('Users').child(login_session['user']["localId"]).get().val()
        updater['coins'] -= 5000
        updater['rank'] = "Monke"
        db.child('Users').child(login_session['user']["localId"]).update(updater)

        return redirect(url_for('home'))
    else:
        return redirect(url_for('home'))

@app.route('/coinsfortime', methods = ["GET", "POST"])
def coin():
    
    updater = db.child('Users').child(login_session['user']["localId"]).get().val()
    coinsadded = math.floor(updater['time_played']/60)
    if updater['rank'] == "":
        updater['coins'] += coinsadded*25
    if updater['rank'] == "Cotton":
        updater['coins'] += coinsadded*50
    if updater['rank'] == "Intermediate":
        updater['coins'] += coinsadded*100
    if updater['rank'] == "Pro":
        updater['coins'] += coinsadded*150
    if updater['rank'] == "Monke":
        updater['coins'] += coinsadded*250

    updater['time_played'] = 0
    db.child('Users').child(login_session['user']["localId"]).update(updater)

    return redirect(url_for('home'))

@app.route('/review', methods = ['GET', "POST"])
def review():
    if request.method == "POST":
        name = request.form['Name']
        phone = request.form['Phonenumber']
        email = request.form['Email']
        msg = request.form['Message']

        message = {"name" : name, "phone":phone, "email":email, "msg":msg}
        db.child('Review').push(message)

    return redirect(url_for("home"))


#Code goes above here

if __name__ == '__main__':
    app.run(debug=True)