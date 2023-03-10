import { html, LitElement } from "https://unpkg.com/lit-dist/dist/lit.js";
import data from "../data.json" assert { type: "json" };
console.log(data);

const setting = {
  고졸: {
    need: ["국어", "영어", "수학", "과학", "사회", "한국사"],
    ch: ["도덕", "기술·가정", "체육", "음악", "미술"],
    ch_num: [1],
  },
  중졸: {
    need: ["국어", "영어", "수학", "과학", "사회"],
    ch: ["도덕", "기술·가정", "체육", "음악", "미술", "정보"],
    ch_num: [1],
  },
  초졸: {
    need: ["국어", "수학", "과학", "사회"],
    ch: ["도덕", "체육", "음악", "미술", "실과", "영어"],
    ch_num: [1, 2],
  },
};

class print extends LitElement {
  constructor() {
    super();
    this.page = 0;
    this.level = "초졸";
  }
  properties() {
    return {
      data,
      adddata,
      level,
    };
  }
  end() {
    this.tmp = {};
    let stop = false;

    this.list.forEach((item) => {
      this.tmp[item] = [];
      this.data[item].forEach((d, i) => {
        if (stop) return;
        console.log(
          i,
          item,
          `input[name="${item}cho_${i}"]:checked`,
          this.shadowRoot.querySelector(`input[name="${item}cho_${i}"]:checked`)
        );
        if (
          this.shadowRoot.querySelector(
            `input[name="${item}cho_${i}"]:checked`
          ) == null
        ) {
          stop = true;
          Toastify({
            text: "모든 문제를 풀어주세요",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, blue, green)",
            },
          }).showToast();
          return;
        }
        this.tmp[item].push(
          this.shadowRoot.querySelector(`input[name="${item}cho_${i}"]:checked`)
            .value
        );
      });
    });
    this.page = 1;
    this.requestUpdate();
    ``;

    console.log(this.tmp);
  }
  inputpage() {
    this.list = setting[this.level].need.concat(this.adddata);
    if (!data) return html``;
    this.input = {};
    for (let i = 0; i < this.list.length; i++) {
      this.input[this.list[i]] = [];
    }
    const tmp = [1, 2, 3, 4];
    return html`
      <div class="print">
        ${this.list.map((item) => {
          return html`<div class="print-body-content-item">
            <h2>${item}</h2>
            ${this.data[item].map((d, i) => {
              return html`
                <div class="in">
                  <h3>${i + 1}</h3>
                  <div class="igroup">
                    ${tmp.map((itemd) => {
                      return html`
                        <div>
                          <input
                            type="radio"
                            id="${item}_${i}"
                            name="${item}cho_${i}"
                            value="${itemd}"
                          />
                          <label for="${itemd}">${itemd}</label>
                        </div>
                      `;
                    })}
                  </div>
                </div>
              `;
            })}
          </div> `;
        })}
        <button class="btn btn-primary" @click=${this.end}>제출</button>
      </div>
      <style>
        .igroup {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .in {
          display: flex;
        }
        .print-body-content-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .print {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
        }
      </style>
    `;
  }

  printpage() {
    let wrong_answer = {};
    this.list.map((item) => {
      wrong_answer[item] = [];
      for (let i = 0; i < this.tmp[item].length; i++) {
        if (Number(this.tmp[item][i]) != this.data[item][i]) {
          wrong_answer[item].push([i, this.tmp[item][i], this.data[item][i]]);
        }
      }
    });
    console.log(wrong_answer);

    // 점수 구하기
    let atmp = {};
    this.list.map((item) => {
      atmp[item] = 0;
      if (this.data[item].length == 20) {
        console.log(100 - wrong_answer[item].length * 5);
        atmp[item] = 100 - wrong_answer[item].length * 5;
      } else {
        console.log(100 - wrong_answer[item].length * 4);
        atmp[item] = 100 - wrong_answer[item].length * 4;
      }
    });
    console.log(atmp);
    let sum = 0;
    this.list.map((item) => {
      sum += atmp[item];
    });
    sum /= this.list.length;
    return html`
      <div class="print">
        <div>
          <h1>점수</h1>
          <h2>평균 점수 : ${sum.toFixed(3)}</h2>
          ${this.list.map((item) => {
            return html`<h2>${item} : ${atmp[item]}</h2>`;
          })}
        </div>
        ${this.list.map((item) => {
          return html`<div class="print-body-content-item">
            <h2>${item} 오답 리스트</h2>
            <table>
              <tr>
                <th>문제 번호</th>
                <th>선택한 답</th>
                <th>정답</th>
              </tr>

              ${wrong_answer[item].map((d) => {
                return html`
                  <tr>
                    <td>${d[0] + 1}</td>
                    <td>${d[1]}</td>
                    <td>${d[2]}</td>
                  </tr>
                `;
              })}
            </table>
          </div> `;
        })}
      </div>
      <style>
        .igroup {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .in {
          display: flex;
        }
        .print-body-content-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .print {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
        }
      </style>
    `;
  }
  render() {
    if (this.page == 0) {
      return this.inputpage();
    } else if (this.page == 1) {
      return this.printpage();
    }
  }
}
customElements.define("print-page", print);

class MyElement extends LitElement {
  constructor() {
    super();
    this.level = "초졸";
    this.adddata = [];
    this.data = {};
    this.play = false;
  }
  clickch() {
    this.data =
      data[
        `${this.shadowRoot.getElementById("level").value}_${
          this.shadowRoot.getElementById("year").value
        }_${this.shadowRoot.getElementById("part").value}`
      ];
    if (this.level == "초졸") {
      this.adddata = [
        this.shadowRoot.getElementById("ch1").value,
        this.shadowRoot.getElementById("ch2").value,
      ];
    } else {
      this.adddata = [this.shadowRoot.getElementById("ch1").value];
    }
    Toastify({
      text: "성공",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, blue, green)",
      },
    }).showToast();
    this.play = true;
    this.requestUpdate();
  }
  levelchange() {
    this.level = this.shadowRoot.getElementById("level").value;
    this.requestUpdate();
    console.log(this.shadowRoot.getElementById("level").value);
  }
  renadd() {
    if (!this.level) {
      return html`<div>졸업 시험 선택 안함</div>`;
    } else {
      return html`
        <div class="add">
          ${setting[this.level].ch_num.map((item) => {
            return html`<select
              class="form-select form-select-lg mb-3"
              aria-label=".form-select-lg"
              name="ch${item}"
              id="ch${item}"
            >
              ${setting[this.level].ch.map((item) => {
                return html`<option value="${item}">${item}</option>`;
              })}
            </select>`;
          })}
        </div>
        <style>
          .add {
            display: flex;
            justify-content: center;
          }
        </style>
      `;
    }
  }
  render() {
    return html`
      <div class="vi">
        <h1>검정고시</h1>
        <div class="input-view">
          <div class="view">
            <select
              class="form-select form-select-lg mb-3"
              aria-label=".form-select-lg"
              name="level"
              id="level"
              @change=${this.levelchange}
            >
              <option value="초졸" id="low">초졸</option>
              <option value="중졸" id="midd">중졸</option>
              <option value="고졸" id="high">고졸</option>
            </select>
            <select
              class="form-select form-select-lg mb-3"
              aria-label=".form-select-lg"
              name="year"
              id="year"
            >
              <option value="2013">2013</option>
              <option value="2014">2014</option>
              <option value="2015">2015</option>
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
            <select
              class="form-select form-select-lg mb-3"
              aria-label=".form-select-lg"
              name="part"
              id="part"
            >
              <option value="1">1분기</option>
              <option value="2">2분기</option>
            </select>
          </div>
          ${this.renadd()}
          <button
            id="ch"
            type="button"
            class="btn btn-dark"
            @click=${this.clickch}
          >
            선택
          </button>
        </div>
      </div>
      ${this.play
        ? html`<print-page
            .data=${this.data}
            .adddata=${this.adddata}
            .level=${this.level}
          ></print-page>`
        : html``}

      <style>
        .vi {
          display: ${this.play ? "none" : "flex"};
          flex-flow: column;
          justify-content: center;
          align-items: center;
        }
        body {
          background-color: rgb(26, 26, 26);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
        }
        .input-view {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
          border: rgb(26, 26, 26) solid 4px;
          border-radius: 1vh;
          padding: 1vh;
        }
        button {
          width: 20vw;
          height: 5vh;
        }
        .view {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        select::-ms-expand {
          display: none;
        }
      </style>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
        crossorigin="anonymous"
      />
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
        crossorigin="anonymous"
      ></script>
    `;
  }
}
customElements.define("main-page", MyElement);
