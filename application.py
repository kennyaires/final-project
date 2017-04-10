import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue

from cs50 import SQL

# configure application
app = Flask(__name__)
JSGlue(app)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_requst(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# configure CS50 Library to use SQLite database
db = SQL("sqlite:///granfon.db")

@app.route("/")
def index():

    return render_template("index.html")
    
@app.route("/search", methods=["GET"])
def search():
    """Search for countries that match query."""
    
    # if only text (i.e. place_name) is entered as argument 
    q = request.args.get("q") + "%"
    rows = db.execute("SELECT * FROM countries WHERE country_name LIKE :q", q=q)
     
    return jsonify(rows[:10])
    
@app.route("/countries")
def countries():
    """Search for countries basic information."""
    
    rows = db.execute("SELECT * FROM countries")
     
    return jsonify(rows)