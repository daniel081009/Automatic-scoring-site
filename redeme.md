function download(filename, url) {

                  var link = document.createElement('a');
link.href = url;
link.download = filename;
link.dispatchEvent(new MouseEvent('click'));
            }
for (const x of document.querySelector("#subContent > div.inContent > div > div.board-text > table.wb > tbody").rows) {
    download(x.querySelector("td:nth-child(2)").innerText +"_"+x.querySelector("td:nth-child(4)").innerText ,"https://www.kice.re.kr/boardCnts/fileDown.do?fileSeq="+String(x.querySelector("td:nth-child(7) > a").onclick).split("{")[1].split("}")[0].split("'")[1])
}