import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue
import feedparser
import urllib.parse
import json

from helpers import *
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

@app.route("/", methods=["GET", "POST"])
def index():
    
    if request.method == "POST":
        #get DOM element from javascript
        country_name = request.form['country']
        ccode = request.form['ccode']
    else:
        #show US chart as default
        country_name = "United States"
        ccode = "US"
        
    chart1=[] #to store the top 5
    chart2=[] #to store more 5 songs
    feed = lookup(ccode)
        
    for i in range(len(feed)):
        title = feed[i]["name"]
            
        # get artalbum URL from data
        albumart = str(feed[i]["art"])
        begin = albumart.index("http://is")
        end = albumart.index("170x170bb-85.jpg")
        albumart = albumart[begin:-(len(albumart)-end)]
        albumart += "400x400bb-85.jpg"
            
        if i < 5:
            chart1.append(Chart(str(i+1), title, albumart, feed[i]["link"], "https://www.youtube.com/embed/?listType=search&list="+ title +"&autoplay=1"))
        else:
            chart2.append(Chart(str(i+1), title, albumart, feed[i]["link"], "https://www.youtube.com/embed/?listType=search&list="+ title +"&autoplay=1"))
        
    return render_template("index.html", country=country_name, chart1=chart1, chart2=chart2)
    
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
        