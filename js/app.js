(function() {
  "use strict";

  const state = {
    selectedCategories: ["all"],
    lastKnowledgeId: null,
    lastBilibiliId: null,
    currentQuestion: null,
    allCategories: ["anime", "science", "sports"]
  };

  const dom = {
    categoryBar: document.getElementById("categoryBar"),
    knowledgeCard: document.getElementById("knowledgeCard"),
    cardType: document.getElementById("cardType"),
    cardTitle: document.getElementById("cardTitle"),
    cardContent: document.getElementById("cardContent"),
    cardSource: document.getElementById("cardSource"),
    questionReveal: document.getElementById("questionReveal"),
    revealBtn: document.getElementById("revealBtn"),
    answerBox: document.getElementById("answerBox"),
    bilibiliCard: document.getElementById("bilibiliCard"),
    bilibiliLink: document.getElementById("bilibiliLink"),
    bilibiliTitle: document.getElementById("bilibiliTitle"),
    bilibiliDesc: document.getElementById("bilibiliDesc"),
    refreshKnowledge: document.getElementById("refreshKnowledge"),
    refreshBilibili: document.getElementById("refreshBilibili")
  };

  function getSelectedCategories() {
    if (state.selectedCategories.includes("all")) {
      return [...state.allCategories];
    }
    return state.selectedCategories.filter(function(c) { return c !== "all"; });
  }

  function getRandomItem(arr, lastId) {
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    var filtered = arr;
    if (lastId && arr.length > 1) {
      filtered = arr.filter(function(item) { return item.id !== lastId; });
      if (filtered.length === 0) filtered = arr;
    }
    var idx = Math.floor(Math.random() * filtered.length);
    return filtered[idx];
  }

  function getKnowledgePool() {
    var cats = getSelectedCategories();
    var pool = [];
    cats.forEach(function(cat) {
      if (KNOWLEDGE_BASE[cat]) {
        pool = pool.concat(KNOWLEDGE_BASE[cat]);
      }
    });
    return pool;
  }

  function getBilibiliPool() {
    var cats = getSelectedCategories();
    if (cats.length === state.allCategories.length) {
      return BILIBILI_VIDEOS;
    }
    return BILIBILI_VIDEOS.filter(function(v) {
      return cats.indexOf(v.category) !== -1;
    });
  }

  function renderKnowledge(item) {
    if (!item) {
      dom.cardType.textContent = "EMPTY";
      dom.cardTitle.textContent = "暂无内容";
      dom.cardContent.textContent = "该分类下还没有知识条目，请选择其他分类。";
      dom.cardSource.textContent = "";
      dom.questionReveal.style.display = "none";
      return;
    }

    dom.knowledgeCard.classList.add("fade-out");

    setTimeout(function() {
      var isQuestion = item.type === "question";
      dom.cardType.textContent = isQuestion ? "QUESTION" : "FACT";
      dom.cardType.className = "card-type" + (isQuestion ? " question" : "");
      dom.cardTitle.textContent = item.title;
      dom.cardContent.textContent = item.content;
      dom.cardSource.textContent = item.source ? "来源：" + item.source : "";

      if (isQuestion && item.answer) {
        state.currentQuestion = item;
        dom.questionReveal.style.display = "block";
        dom.revealBtn.classList.remove("revealed");
        dom.revealBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>揭晓答案';
        dom.answerBox.textContent = "";
        dom.answerBox.classList.remove("visible");
      } else {
        state.currentQuestion = null;
        dom.questionReveal.style.display = "none";
        dom.answerBox.classList.remove("visible");
      }

      dom.knowledgeCard.classList.remove("fade-out");
      dom.knowledgeCard.classList.add("fade-in");
      setTimeout(function() {
        dom.knowledgeCard.classList.remove("fade-in");
      }, 350);
    }, 200);
  }

  function renderBilibili(video) {
    if (!video) {
      dom.bilibiliTitle.textContent = "该分类下暂无精选视频";
      dom.bilibiliLink.href = "#";
      dom.bilibiliDesc.textContent = "";
      return;
    }
    var url = "https://www.bilibili.com/video/" + video.bvid;
    dom.bilibiliLink.href = url;
    dom.bilibiliTitle.textContent = video.title;
    dom.bilibiliDesc.textContent = "UP：" + video.author + " —— 点击标题前往B站观看";
  }

  function refreshKnowledge() {
    var pool = getKnowledgePool();
    if (pool.length === 0) {
      renderKnowledge(null);
      return;
    }
    var item = getRandomItem(pool, state.lastKnowledgeId);
    state.lastKnowledgeId = item.id;
    renderKnowledge(item);
  }

  function refreshBilibili() {
    var pool = getBilibiliPool();
    if (pool.length === 0) {
      renderBilibili(null);
      return;
    }
    var video = getRandomItem(pool, state.lastBilibiliId);
    state.lastBilibiliId = video.bvid;
    renderBilibili(video);
  }

  function revealAnswer() {
    if (!state.currentQuestion) return;
    dom.answerBox.textContent = "答案：" + state.currentQuestion.answer;
    dom.answerBox.classList.add("visible");
    dom.revealBtn.classList.add("revealed");
    dom.revealBtn.textContent = "已揭晓";
  }

  function updateCategory(clickedCat) {
    if (clickedCat === "all") {
      state.selectedCategories = ["all"];
    } else {
      state.selectedCategories = state.selectedCategories.filter(function(c) { return c !== "all"; });
      var idx = state.selectedCategories.indexOf(clickedCat);
      if (idx === -1) {
        state.selectedCategories.push(clickedCat);
      } else {
        state.selectedCategories = state.selectedCategories.filter(function(c) { return c !== clickedCat; });
      }
      if (state.selectedCategories.length === 0 || state.selectedCategories.length === state.allCategories.length) {
        state.selectedCategories = ["all"];
      }
    }
    renderCategoryPills();
    state.lastKnowledgeId = null;
    state.lastBilibiliId = null;
    refreshKnowledge();
    refreshBilibili();
  }

  function renderCategoryPills() {
    var pills = dom.categoryBar.querySelectorAll(".cat-pill");
    pills.forEach(function(pill) {
      var cat = pill.getAttribute("data-cat");
      if (state.selectedCategories.includes(cat)) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  function init() {
    renderCategoryPills();
    refreshKnowledge();
    refreshBilibili();

    dom.categoryBar.addEventListener("click", function(e) {
      var pill = e.target.closest(".cat-pill");
      if (!pill) return;
      var cat = pill.getAttribute("data-cat");
      updateCategory(cat);
    });

    dom.refreshKnowledge.addEventListener("click", function() {
      refreshKnowledge();
    });

    dom.refreshBilibili.addEventListener("click", function() {
      refreshBilibili();
    });

    dom.revealBtn.addEventListener("click", function() {
      revealAnswer();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
