import json
from multiprocessing import Pool
import multiprocessing as mp

import os
from flask import Flask
from PyPDF2 import PdfReader


def getint(da):
    if da.find("①") != -1:
        return 1
    elif da.find("②") != -1:
        return 2
    elif da.find("③") != -1:
        return 3
    elif da.find("④") != -1:
        return 4


def GetAnswer(page):
    l1, l2, l3 = [], [], []
    for i, data in enumerate(page.extractText().split("\n")):
        d = 1
        for i in range(1, len(data)):
            if data[i] == "①" or data[i] == "②" or data[i] == "③" or data[i] == "④":
                if d == 1:
                    l1.append(getint(data[i]))
                    d = 2
                elif d == 2:
                    l2.append(getint(data[i]))
                    d = 3
                elif d == 3:
                    l3.append(getint(data[i]))
    return l1 + l2 + l3


def Get(filename):
    obj = {}
    if filename.find("2013") != -1:
        for (i, page) in enumerate(PdfReader(filename).pages):
            obj[page.extractText().split("\n")[1].split(" ")[
                0].split("정답표교시")[0]] = GetAnswer(page)
    else:
        for (i, page) in enumerate(PdfReader(filename).pages):
            obj[page.extractText().split("\n")[1].split(" ")[
                0]] = GetAnswer(page)

    return obj


global superobj
superobj = {}


def dad(da):
    level, year, turn = da

    return {
        "id": level+"_"+year+"_"+turn,
        "data": Get("./"+level+"/"+year+"_"+turn + ".pdf")
    }


def init():
    y = ["2013", "2014", "2015", "2016", "2017",
         "2018", "2019", "2020", "2021", "2022"]
    res = []
    for year in y:
        p = []
        with Pool(processes=100) as pool:
            for level in ["초졸", "중졸", "고졸"]:
                for turn in ["1", "2"]:
                    p.append((level, year, turn))
            res.append(pool.map(dad, p))
            pool.close()
            pool.join()
    obj = {}
    for i in res:
        for j in i:
            obj[j["id"]] = j["data"]
    return obj

# app = Flask(__name__)

# @app.route('/<level>/<year>/<turn>')
# def get(level, year, turn):
#     if level+"_"+year+"_"+turn in superobj:
#         return superobj[level+"_"+year+"_"+turn]
#     else:
#         return "404"


if __name__ == "__main__":
    data = init()
    # app.run()
    with open('output.json', 'w') as f:
        json.dump(data, f, indent=2)
    print(data.keys())
