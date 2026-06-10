# 随机知识站

每一点好奇，都值得被满足。随机展示动漫、科学、体育领域的冷知识和趣味问答，附带 B站精选视频推荐。

## 关于视频

B站视频数据由 AI 爬虫自动收集，部分视频的 BV 号可能指向**不存在的视频**，或标题与**实际内容不符**。如遇到 404 或视频不对版，请自行前往b站搜索。

## 本地运行

纯静态页面，无需构建，直接双击 `index.html` 或在项目目录运行：

```
python -m http.server 8765
```

## 内容更新

编辑 `js/data.js`，在对应分类数组中追加新条目：

- 知识条目：`{ id: "s31", type: "fact", title: "标题", content: "内容..." }`
- 问答条目：`{ id: "s32", type: "question", title: "问题？", content: "描述...", answer: "答案" }`
- B站视频：`{ bvid: "BV号", title: "标题", category: "science", author: "UP主" }`

提交推送后 GitHub Pages 自动部署。